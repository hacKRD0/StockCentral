import { unlinkSync } from 'fs';
import db from '../../db/models/index.js';
import { join, dirname } from 'path'; // Correct way to import from 'path'
import processPortfolio from '../utils/processPortfolio.js';

const User = db.User;

export default async (req, res) => {
  const { userId } = req;
  let { brokerageId, date } = req.body;
  // console.log('Request: ', req);
  // console.log('brokerageId: ', brokerageId);
  // console.log('date: ', date);
  // console.log('file: ', req.file);
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const user = await User.findByPk(userId);
    // console.log('user: ', user);

    // console.log('file: ', req.file);
    const file = req.file;
    brokerageId = parseInt(brokerageId);

    // Check if date is of correct format
    if (!date || isNaN(Date.parse(date))) {
      return res.status(400).send({
        success: false,
        message: 'Invalid date format',
      });
    }

    const response = await processPortfolio(user, file, brokerageId, date);
    console.log('response: ', response);
    res.status(200).send(response);
  } catch (error) {
    console.log('uploadPortfolio Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'Internal server error',
      error: error,
    });
  }
};
