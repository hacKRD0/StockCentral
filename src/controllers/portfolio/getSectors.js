import db from '../../db/models/index.js';

const User = db.User;

export default async (req, res) => {
  const { userId } = req;
  try {
    const user = await User.findByPk(userId);
    const sectors = await user.getSectors();
    return res.status(200).send({
      success: true,
      message: 'Sectors retrieved successfully.',
      Sectors: sectors,
    });
  } catch (error) {
    console.log('getSectors Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while retrieving the sectors table.',
    });
  }
};
