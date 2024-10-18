import db from '../../db/models/index.js';

const StockReference = db.StockReference;

export default async (req, res) => {
  try {
    const stockReferences = await StockReference.findAll();
    return res.status(200).send({
      success: true,
      message: 'Stock references retrieved successfully.',
      stockReferences: stockReferences,
    });
  } catch (error) {
    console.log('getStockReferences Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while retrieving stock references.',
    });
  }
};
