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
  try {
    const data = await readFile(filePath, 'utf8');
    const rows = data
      .split('\n')
      .map((row) => row.trim())
      .filter((row) => row); // Remove empty rows

    const parsedData = rows.map((row, rowIndex) => {
      let symbol, quantity, price;
      const cols = row.split(',').map((col) => col.trim());

      // Map columns based on brokerageId
      try {
        if (brokerageId === 1) {
          [symbol, quantity, price] = cols;
        } else if (brokerageId === 2) {
          [, symbol, quantity, price] = cols;
        } else {
          [symbol, , quantity, price] = cols;
        }

        // Validate and sanitize symbol
        const sanitizedSymbol = (symbol || '').replace(/^"(.*)"$/, '$1');
        if (!sanitizedSymbol) {
          throw new Error(`Symbol is empty at row ${rowIndex + 1}`);
        }

        // Ensure the symbol contains at least one letter
        if (!/[A-Za-z]/.test(sanitizedSymbol)) {
          throw new Error(
            `Symbol must contain at least one letter at row ${rowIndex + 1}`
          );
        }

        // Validate quantity: must be an integer
        const parsedQuantity = parseFloat(quantity);
        if (
          isNaN(parsedQuantity) ||
          parsedQuantity < 0 ||
          !Number.isInteger(parsedQuantity)
        ) {
          throw new Error(
            `Quantity must be a non-negative integer at row ${rowIndex + 1}`
          );
        }

        // Validate price: must be a float
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
          throw new Error(
            `Price must be a non-negative number at row ${rowIndex + 1}`
          );
        }

        // Return parsed and validated data
        return {
          symbol: sanitizedSymbol,
          quantity: parsedQuantity,
          price: parsedPrice,
        };
      } catch (error) {
        // Log the error for debugging
        console.error(`Error processing row ${rowIndex + 1}: ${error.message}`);
        return null; // Skip invalid rows
      }
    });

    // Filter out rows that failed validation
    return parsedData.filter((row) => row !== null);
  } catch (fileError) {
    console.error(`Failed to read file: ${fileError.message}`);
    throw fileError;
  }
};

/**
 * Parses an Excel file (XLS/XLSX) and returns an array of valid data objects.
 * Invalid rows are skipped, and errors are logged for debugging.
 * @param {string} filePath - The path to the Excel file.
 * @param {number} brokerageId - The brokerage ID to determine the parsing logic.
 * @returns {Array<{symbol: string, quantity: number, price: number}>}
 */
const parseExcel = (filePath, brokerageId) => {
  const workbook = XLSX.readFile(filePath);

  console.log('Workbook sheets:', workbook.SheetNames); // Log available sheets

  const sheetName =
    brokerageId === 2 ? workbook.SheetNames[0] : workbook.SheetNames[1]; // Assuming the first sheet
  const worksheet = workbook.Sheets[sheetName];

  console.log('Raw worksheet data:', worksheet); // Log raw worksheet data

  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  console.log('Parsed JSON data:', jsonData); // Log parsed data

  const rows = jsonData
    .map((row) =>
      row.map((cell) => (typeof cell === 'string' ? cell.trim() : cell))
    )
    .filter(
      (row) =>
        row.length > 0 &&
        row.some((cell) => cell !== null && cell !== undefined && cell !== '')
    );

  console.log('Filtered rows:', rows); // Log rows after filtering

  let startIndex = 1;
  if (brokerageId === 3) {
    // Find the index where 'Unrealised (Holdings as on ...)' occurs
    const unrealisedMarker = rows.findIndex((row) =>
      row.some((cell) =>
        typeof cell === 'string'
          ? cell.startsWith('Unrealised (Holdings as on')
          : false
      )
    );

    if (unrealisedMarker === -1) {
      console.warn(
        'Unrealised section not found. No data will be processed for brokerageId 2.'
      );
      return []; // Return empty array as no Unrealised data is present
    }

    // The Unrealised data starts after the marker and its adjacent rows
    // Typically, the structure is:
    // [Marker]
    // []
    // [Headers]
    // [Data Rows]
    // So, we set startIndex to unrealisedMarker + 3
    console.log('Unrealised marker index:', unrealisedMarker);
    startIndex = unrealisedMarker + 3;
  }

  const dataRows = rows.slice(startIndex); // Assuming first two rows are headers for other brokerages

  // console.log('Data rows to process:', dataRows); // Log data rows to be processed

  return dataRows
    .map((row, rowIndex) => {
      let symbol, quantity, price;
      // const cols = row.map((col) => col.trim());

      try {
        if (brokerageId === 1) {
          [symbol, quantity, price] = row;
        } else if (brokerageId === 2) {
          [, symbol, quantity, price] = row;
        } else {
          [symbol, , quantity, price] = row;
        }

        // Validate and sanitize symbol
        const sanitizedSymbol = (symbol || '').replace(/^"(.*)"$/, '$1');
        if (!sanitizedSymbol) {
          throw new Error(`Symbol is empty at row ${rowIndex + 1}`);
        }

        // Ensure the symbol contains at least one letter
        if (!/[A-Za-z]/.test(sanitizedSymbol)) {
          throw new Error(
            `Symbol must contain at least one letter at row ${rowIndex + 1}`
          );
        }

        // Validate quantity: must be an integer
        const parsedQuantity = parseFloat(quantity);
        if (
          isNaN(parsedQuantity) ||
          parsedQuantity < 0 ||
          !Number.isInteger(parsedQuantity)
        ) {
          throw new Error(
            `Quantity must be a non-negative integer at row ${rowIndex + 1}`
          );
        }

        // Validate price: must be a float
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
          throw new Error(
            `Price must be a non-negative number at row ${rowIndex + 1}`
          );
        }

        // Return parsed and validated data
        return {
          symbol: sanitizedSymbol,
          quantity: parsedQuantity,
          price: parsedPrice,
        };
      } catch (error) {
        // Log the error for debugging
        console.error(`Error processing row ${rowIndex + 1}: ${error.message}`);
        return null; // Skip invalid rows
      }
    })
    .filter((row) => row !== null); // Remove invalid rows
};

export default async (user, file, brokerageId, date) => {
  const t = await db.sequelize.transaction();
  const filePath = path.join(__dirname, file.path);

  try {
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

    // Validate brokerage
    const brokerage = await Brokerage.findByPk(brokerageId, { transaction: t });
    if (!brokerage) throw new Error(`Brokerage not found: ${brokerageId}`);

    // Delete existing data for the same date
    const stockMapperIds = await StockMapper.findAll({
      attributes: ['id'],
      where: {
        UserId: user.id,
        BrokerageId: brokerage.id,
      },
      transaction: t,
    });

    // Extract the IDs into an array
    const ids = stockMapperIds.map((m) => m.id);

    // Delete all UserStocks for the given StockMapperIds and date
    const deleteCount = await UserStocks.destroy({
      where: {
        UserId: user.id,
        Date: date,
        StockMapperId: { [Op.in]: ids },
      },
      transaction: t,
    });

    // Filter invalid rows
    const validData = parsedData.filter(
      ({ symbol, quantity, price }) =>
        symbol && !isNaN(quantity) && quantity > 0 && !isNaN(price) && price > 0
    );

    if (validData.length === 0) {
      await t.commit();
      return {
        success: false,
        message: 'No valid data to process.',
        validRows: 0,
        invalidRows: parsedData.length,
      };
    }

    // Batch process data
    const bulkOperations = validData.map(
      async ({ symbol, quantity, price }) => {
        let stockMaster = null;

        if (user.defaultBrokerageId === brokerage.id) {
          [stockMaster] = await StockMaster.findOrCreate({
            where: {
              UserId: user.id,
              code: symbol,
            },
            transaction: t, // Include transaction
          });
        } else {
          stockMaster = await StockMaster.findOne({
            where: {
              UserId: user.id,
              code: symbol,
            },
            transaction: t, // Include transaction
          });
        }

        // Find or create stock
        const [stock] = await StockMapper.findOrCreate({
          where: {
            UserId: user.id,
            BrokerageCode: symbol,
            BrokerageId: brokerage.id,
          },
          transaction: t, // Include transaction
        });

        // Update the stock with StockMasterId
        await stock.update(
          {
            StockMasterId: stockMaster ? stockMaster.id : null,
          },
          { transaction: t } // Include transaction
        );

        // Perform upsert operation for UserStocks
        await UserStocks.upsert(
          {
            UserId: user.id,
            StockMapperId: stock.id,
            Qty: quantity,
            AvgCost: price,
            Date: date, // Ensure exact Date match
          },
          { transaction: t } // Include transaction
        );
      }
    );

    // Execute all operations
    await Promise.all(bulkOperations);

    await t.commit();

    return {
      success: true,
      message: 'Data successfully processed and inserted.',
      validRows: validData.length,
      invalidRows: parsedData.length - validData.length,
    };
  } catch (error) {
    await t.rollback();
    console.error('Error processing file:', error.message);
    return {
      success: false,
      message: `Error processing file: ${error.message}`,
      validRows: 0,
      invalidRows: 0,
    };
  } finally {
    unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log('File deleted successfully.');
      }
    });
  }
};
