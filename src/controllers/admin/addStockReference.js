import db from '../../db/models/index.js';

const StockMaster = db.StockMaster;

export default async (req, res) => {
  try {
    const { name, code, sector } = req.body;
    const stockMaster = await StockMaster.create({
      name,
      code,
      sector,
    });
    res.status(200).send({
      success: true,
      stockMaster: stockMaster,
    });
  } catch (error) {
    console.log('addStockMaster Error: ', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
