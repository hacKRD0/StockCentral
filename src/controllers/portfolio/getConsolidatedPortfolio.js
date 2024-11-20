import db from '../../db/models/index.js';
import { Op } from 'sequelize';

const User = db.User;
const Brokerage = db.Brokerage;
const Sector = db.Sector;
const StockMaster = db.StockMaster;
const StockReference = db.StockReference;

export default async (req, res) => {
  const { userId } = req;
  let { date } = req.query;
  if (!date) {
    date = req.body.date;
  }

  try {
    const user = await User.findByPk(userId);
    // console.log('Date: ', date);
    const holdingsDate = new Date(date);
    const startOfDay = new Date(holdingsDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(holdingsDate.setUTCHours(23, 59, 59, 999));
    // console.log('holdingsDate: ', holdingsDate);
    // console.log('startOfDay: ', startOfDay);
    // console.log('endOfDay: ', endOfDay);
    const portfolio = await user.getUserStocks({
      where: {
        Date: {
          [Op.between]: [startOfDay, endOfDay], // Matches only on date
        },
      },
      include: {
        model: StockMaster,
        include: [
          {
            model: StockReference,
            include: [
              {
                model: Sector,
              },
            ],
          },
          {
            model: Brokerage,
          },
        ],
      },
    });

    // console.log('portfolio: ', portfolio);

    return res.status(200).send({
      success: true,
      portfolio: portfolio,
    });
  } catch (error) {
    console.log('getConsolidatedPortfolio Error: ', error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while fetching the user's portfolio.",
    });
  }
};
