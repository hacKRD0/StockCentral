import db from '../../db/models/index.js';

const StockReference = db.StockReference;

export default async (req, res) => {
  try {
    const { name, code, sector } = req.body;
    const stockReference = await StockReference.create({
      name,
      code,
      sector,
    });
    res.status(200).send({
      success: true,
      stockReference: stockReference,
    });
  } catch (error) {
    console.log('addStockReference Error: ', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
