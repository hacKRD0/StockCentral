import db from '../../../db/models/index.js';
import { readFile } from 'fs/promises';
// import { unlinkSync } from 'fs';
// import { join, dirname } from 'path'; // Correct way to import from 'path'

const User = db.User;
const Brokerage = db.Brokerage;
const UserStocks = db.UserStocks;
const StockMaster = db.StockMaster;

export default async (user, filePath, brokerageName, date) => {
  // Read the CSV file
  const data = await readFile(filePath, 'utf8');

  // Split the data into rows by newlines
  const rows = data.split('\n');

  // Split each row into columns by commas
  const parsedData = rows.map((row) => {
    // Assuming each row is comma-separated
    return row.split(',');
  });

  // Remove the first row (header row)
  parsedData.shift();

  // Remove the last row (empty row)
  parsedData.pop();

  // Insert the data into the database
  for (const row of parsedData) {
    let [symbol, _a, quantity, price] = row;
    symbol = symbol.replace(/^"(.*)"$/, '$1');
    console.log('symbol: ', symbol);
    console.log('quantity: ', quantity);
    console.log('price: ', price);

    if (
      !symbol ||
      !quantity ||
      !price ||
      typeof quantity !== 'number' ||
      typeof price !== 'number'
    ) {
      console.log('Invalid data');
      continue;
    }

    // Find the brokerage by name
    const brokerage = await Brokerage.findOne({
      where: { name: brokerageName },
    });
    console.log('brokerage: ', brokerage);

    // Find the stock by symbol
    const stock = await StockMaster.findOrCreate({
      where: {
        UserId: user.id,
        BrokerageCode: symbol,
        BrokerageId: brokerage.id,
      },
    });
    console.log('stock: ', stock[0].id);

    const portfolioDate = new Date(date);

    // Perform upsert operation
    const [record, created] = await UserStocks.upsert({
      UserId: user.id,
      StockMasterId: stock[0].id,
      Qty: quantity,
      AvgCost: price,
      Date: portfolioDate, // Ensure exact Date match
    });

    if (!created) {
      console.log('Record already exists');
    }
  }
};
