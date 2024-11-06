import { unlinkSync } from 'fs';
import db from '../../db/models/index.js';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path'; // Correct way to import from 'path'
import processZerodhaPortfolio from './brokerages/zerodha.js';
import processGrowwPortfolio from './brokerages/groww.js';
import processSharekhanPortfolio from './brokerages/sharekhan.js';

const User = db.User;
const Brokerage = db.Brokerage;
const UserStocks = db.UserStocks;
const StockMaster = db.StockMaster;

// Helper to get the __dirname in ESM
const __dirname = dirname('D:/Projects/pmapp/src');

export default async (req, res) => {
  const { userId } = req;
  const { brokerageName, date } = req.body;
  console.log('Request: ', req);
  console.log('brokerageName: ', brokerageName);
  console.log('date: ', date);
  console.log('file: ', req.file);
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const user = await User.findByPk(userId);
    console.log('user: ', user);

    // Get the uploaded file path
    const filePath = join(__dirname, req.file.path);
    console.log('file: ', req.file);
    console.log('filePath: ', filePath);

    if (brokerageName === 'Zerodha') {
      await processZerodhaPortfolio(user, filePath, brokerageName, date);
    } else if (brokerageName === 'Groww') {
      await processGrowwPortfolio(user, filePath, brokerageName, date);
    } else if (brokerageName === 'Sharekhan') {
      await processSharekhanPortfolio(user, filePath, brokerageName, date);
    }

    // console.log('parsedData: ', parsedData);
    unlinkSync(filePath);

    res.status(200).send({
      success: true,
      message: 'Portfolio uploaded successfully',
    });
  } catch (error) {
    console.log('uploadPortfolio Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
};
