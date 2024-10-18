import db from '../../db/models/index.js';

const User = db.User;
const Brokerage = db.Brokerage;
const StockMaster = db.StockMaster;
const StockReference = db.StockReference;

export default async (req, res) => {
  const { userId } = req;
  const { date } = req.body;

  try {
    const user = await User.findByPk(userId);
    const holdingsDate = new Date(date);
    const portfolio = await user.getUserStocks({
      where: { Date: holdingsDate },
      include: {
        model: StockMaster,
        include: [
          {
            model: StockReference,
          },
          {
            model: Brokerage,
          },
        ],
      },
    });

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
