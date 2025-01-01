import db from '../../db/models/index.js';

const Brokerage = db.Brokerage;
const StockMaster = db.StockMaster;
const StockMapper = db.StockMapper;
const Sector = db.Sector;

export default async (req, res) => {
  const { userId } = req;
  try {
    const stockMapper = await StockMapper.findAll({
      where: { UserId: userId },
      include: [
        {
          model: StockMaster,
          include: [
            {
              model: Sector,
              required: false,
            },
          ],
          required: false,
        },
        {
          model: Brokerage,
          required: false,
        },
      ],
    });
    return res.status(200).send({
      success: true,
      message: 'StocksMapper retrieved successfully.',
      stockMapper: stockMapper,
    });
  } catch (error) {
    console.log('getStockMapper Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while retrieving the stock mapper table.',
    });
  }
};
