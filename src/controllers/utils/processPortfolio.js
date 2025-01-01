import db from '../../db/models/index.js';
import { Op } from 'sequelize';
import { readFile } from 'fs/promises';
import path from 'path';
import XLSX from 'xlsx';
import { unlink, unlinkSync } from 'fs';

const User = db.User;
const Sector = db.Sector;
const Brokerage = db.Brokerage;
const UserStocks = db.UserStocks;
const StockMapper = db.StockMapper;
const StockMaster = db.StockMaster;

// Define the working directory
const __dirname = path.dirname(`${process.env.WORKING_DIR}`);

/**
 * Parses a CSV file and returns an array of data objects.
 * @param {string} filePath - The path to the CSV file.
 * @param {number} brokerageId - The brokerage ID to determine the parsing logic.
 * @returns {Promise<Array<{symbol: string, quantity: number, price: number}>>}
 */
const parseCSV = async (filePath, brokerageId) => {
  const data = await readFile(filePath, 'utf8');
  const rows = data
    .split('\n')
    .map((row) => row.trim())
    .filter((row) => row);

  return rows.map((row) => {
    let symbol, quantity, price;
    const cols = row.split(',').map((col) => col.trim());

    if (brokerageId === 1) {
      [symbol, quantity, price] = cols;
    } else if (brokerageId === 2) {
      [, symbol, quantity, price] = cols;
    } else {
      [symbol, , quantity, price] = cols;
    }

    // Strip quotes from symbol
    const sanitizedSymbol = symbol.replace(/^"(.*)"$/, '$1');
    return {
      symbol: sanitizedSymbol,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
    };
  });
};

/**
 * Parses an Excel file (XLS/XLSX) and returns an array of data objects.
 * @param {string} filePath - The path to the Excel file.
 * @param {number} brokerageId - The brokerage ID to determine the parsing logic.
 * @returns {Array<{symbol: string, quantity: number, price: number}>}
 */
const parseExcel = (filePath, brokerageId) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[1]; // Assuming data is in the first sheet
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  console.log('workbook: ', workbook);
  console.log('worksheet: ', worksheet);
  console.log('jsonData: ', jsonData);
  // Remove empty rows and trim whitespace
  const rows = jsonData
    .map((row) =>
      row.map((cell) => (typeof cell === 'string' ? cell.trim() : cell))
    )
    .filter(
      (row) =>
        row.length > 0 &&
        row.some((cell) => cell !== null && cell !== undefined && cell !== '')
    );

  console.log('rows: ', rows);
  return rows.map((row) => {
    let symbol, quantity, price;

    if (brokerageId === 1) {
      [symbol, quantity, price] = row;
    } else if (brokerageId === 2) {
      [, symbol, quantity, price] = row;
    } else {
      [symbol, , quantity, price] = row;
    }

    // Ensure symbol is a string
    symbol =
      typeof symbol === 'string'
        ? symbol.replace(/^"(.*)"$/, '$1')
        : String(symbol);

    return {
      symbol,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
    };
  });
};

export default async (user, file, brokerageId, date) => {
  try {
    const filePath = path.join(__dirname, file.path);
    console.log('Processing file:', file);

    // Determine the file extension
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    let parsedData;
    if (ext === '.csv' || mimetype === 'text/csv') {
      parsedData = await parseCSV(filePath, brokerageId);
    } else if (
      ext === '.xls' ||
      ext === '.xlsx' ||
      mimetype === 'application/vnd.ms-excel' ||
      mimetype ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      parsedData = parseExcel(filePath, brokerageId);
    } else {
      throw new Error(
        'Unsupported file format. Please upload a CSV, XLS, or XLSX file.'
      );
    }
    console.log('parsedData: ', parsedData);

    // Validate brokerage
    const brokerage = await Brokerage.findByPk(brokerageId);
    if (!brokerage) throw new Error(`Brokerage not found: ${brokerageId}`);

    // Delete existing data for the same date
    const stockMapperIds = await StockMapper.findAll({
      attributes: ['id'],
      where: {
        UserId: user.id,
        BrokerageId: brokerage.id,
      },
    });

    // Extract the IDs into an array
    const ids = stockMapperIds.map((m) => m.id);
    console.log('ids: ', ids);

    // Delete all UserStocks for the given StockMapperIds and date
    const deleteCount = await UserStocks.destroy({
      where: {
        UserId: user.id,
        Date: new Date(date),
        StockMapperId: { [Op.in]: ids },
      },
    });
    console.log('deleteCount: ', deleteCount);

    // Filter invalid rows
    const validData = parsedData.filter(
      ({ symbol, quantity, price }) =>
        symbol && !isNaN(quantity) && quantity > 0 && !isNaN(price) && price > 0
    );

    if (validData.length === 0) {
      console.log('No valid data to process.');
      return;
    }

    // Batch process data
    const bulkOperations = validData.map(
      async ({ symbol, quantity, price }) => {
        let stockMaster = null;

        if (user.defaultBrokerageId === brokerage.id) {
          [stockMaster] = await StockMaster.findOrCreate({
            where: {
              UserId: user.id,
              name: symbol,
              code: symbol,
            },
          });
        } else {
          stockMaster = await StockMaster.findOne({
            where: {
              UserId: user.id,
              code: symbol,
            },
          });
        }

        // Find or create stock
        const [stock] = await StockMapper.findOrCreate({
          where: {
            UserId: user.id,
            BrokerageCode: symbol,
            BrokerageId: brokerage.id,
          },
        });

        // Update the stock with StockMasterId
        await stock.update({
          StockMasterId: stockMaster ? stockMaster.id : null,
        });

        // Perform upsert operation for UserStocks
        await UserStocks.upsert({
          UserId: user.id,
          StockMapperId: stock.id,
          Qty: quantity,
          AvgCost: price,
          Date: new Date(date), // Ensure exact Date match
        });
      }
    );

    // Execute all operations
    await Promise.all(bulkOperations);

    unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log('File deleted successfully.');
      }
    });

    console.log('Data successfully processed and inserted.');
  } catch (error) {
    console.error('Error processing file:', error.message);
    throw error; // Rethrow to notify upstream callers
  }
};
