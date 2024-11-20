import db from '../../db/models/index.js';

const User = db.User;
const UserStocks = db.UserStocks;

export default async (req, res) => {
  const { userId } = req;

  try {
    const user = await User.findByPk(userId);
    // Fetch the distinct dates
    const userStocks = await UserStocks.findAll({
      attributes: [
        [db.Sequelize.fn('DATE', db.Sequelize.col('Date')), 'uniqueDate'], // Extract date part
      ],
      where: {
        UserId: userId, // Filter by user
      },
      group: ['uniqueDate'], // Group by extracted date
      raw: true, // Return plain JavaScript objects
    });

    // Extract the dates into an array
    const uniqueDates = userStocks.map((stock) => stock.uniqueDate);

    return res.status(200).send({
      success: true,
      dates: uniqueDates,
    });
  } catch (error) {
    console.log('getUploadedDates Error: ', error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while fetching the user's uploaded dates.",
    });
  }
};
