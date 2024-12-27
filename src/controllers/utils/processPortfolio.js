import db from '../../db/models/index.js';
import { readFile } from 'fs/promises';
// import { unlinkSync } from 'fs';
// import { join, dirname } from 'path'; // Correct way to import from 'path'

const User = db.User;
const Sector = db.Sector;
const Brokerage = db.Brokerage;
const UserStocks = db.UserStocks;
const StockMaster = db.StockMaster;
const StockReference = db.StockReference;

export default async (user, filePath, brokerageName, date) => {
  try {
    // Read and parse the CSV file
    const data = await readFile(filePath, 'utf8');
    const rows = data
      .split('\n')
      .map((row) => row.trim()) // Trim whitespace from rows
      .filter((row) => row); // Remove empty rows

    // Validate brokerage
    const brokerage = await Brokerage.findOne({
      where: { name: brokerageName },
    });
    if (!brokerage) throw new Error(`Brokerage not found: ${brokerageName}`);

    const parsedData = rows.map((row) => {
      let symbol, quantity, price;
      if (brokerage.id === 1) {
        [symbol, quantity, price] = row.split(',').map((col) => col.trim());
      } else {
        [symbol, , quantity, price] = row.split(',').map((col) => col.trim());
      }

      // Strip quotes from symbol
      const sanitizedSymbol = symbol.replace(/^"(.*)"$/, '$1');
      return {
        symbol: sanitizedSymbol,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
      };
    });

    // Filter invalid rows
    const validData = parsedData.filter(
      ({ symbol, quantity, price }) =>
        symbol && !isNaN(quantity) && quantity > 0 && !isNaN(price) && price > 0
    );

    // Fetch or create "Unknown" sector once
    const [unknownSector] = await Sector.findOrCreate({
      where: { name: 'Unknown', UserId: user.id },
    });

    // Batch process data
    const bulkOperations = validData.map(
      async ({ symbol, quantity, price }) => {
        let stockReference = null;

        if (user.defaultBrokerageId === brokerage.id) {
          [stockReference] = await StockReference.findOrCreate({
            where: {
              UserId: user.id,
              name: symbol,
              code: symbol,
              SectorId: unknownSector.id,
            },
          });
        }

        // Find or create stock
        const [stock] = await StockMaster.findOrCreate({
          where: {
            UserId: user.id,
            BrokerageCode: symbol,
            BrokerageId: brokerage.id,
          },
        });

        // Update the stock with StockReferenceId
        await stock.update({
          StockReferenceId: stockReference ? stockReference.id : null,
        });

        // Perform upsert operation for UserStocks
        await UserStocks.upsert({
          UserId: user.id,
          StockMasterId: stock.id,
          Qty: quantity,
          AvgCost: price,
          Date: new Date(date), // Ensure exact Date match
        });
      }
    );

    // Execute all operations
    await Promise.all(bulkOperations);

    console.log('Data successfully processed and inserted.');
  } catch (error) {
    console.error('Error processing CSV:', error.message);
    throw error; // Rethrow to notify upstream callers
  }
};
