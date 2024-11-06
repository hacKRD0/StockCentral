import db from '../../db/models/index.js';

const Brokerage = db.Brokerage;
const StockReference = db.StockReference;
const StockMaster = db.StockMaster;
const Sector = db.Sector;

export default async (req, res) => {
  const { userId } = req;
  try {
    const stockMaster = await StockMaster.findAll({
      where: { UserId: userId },
      include: [
        {
          model: StockReference,
          required: false,
        },
        {
          model: Brokerage,
          required: false,
        },
        {
          model: Sector,
          required: false,
        },
      ],
    });
    return res.status(200).send({
      success: true,
      message: 'Stock references retrieved successfully.',
      StockMaster: stockMaster,
    });
  } catch (error) {
    console.log('getStockMaster Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while retrieving the stock master table.',
    });
  }
};
