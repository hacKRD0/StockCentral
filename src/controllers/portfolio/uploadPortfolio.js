import { unlinkSync } from 'fs';
import db from '../../db/models/index.js';
import { join, dirname } from 'path'; // Correct way to import from 'path'
import processPortfolio from '../utils/processPortfolio.js';

const User = db.User;

// Helper to get the __dirname in ESM
const __dirname = dirname(`${process.env.WORKING_DIR}`);
// console.log('__dirname: ', __dirname);

export default async (req, res) => {
  const { userId } = req;
  let { brokerageName, date } = req.body;
  // console.log('Request: ', req);
  // console.log('brokerageName: ', brokerageName);
  // console.log('date: ', date);
  // console.log('file: ', req.file);
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const user = await User.findByPk(userId);
    console.log('user: ', user);

    brokerageName = brokerageName.trim();
    // Get the uploaded file path
    const filePath = join(__dirname, req.file.path);
    // console.log('file: ', req.file);
    // console.log('filePath: ', filePath);
    await processPortfolio(user, filePath, brokerageName, date);

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
