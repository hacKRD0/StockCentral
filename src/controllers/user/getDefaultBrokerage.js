import db from '../../db/models/index.js';

const User = db.User;
const Brokerage = db.Brokerage;

export default async (req, res) => {
  const { userId } = req;
  try {
    const user = await User.findByPk(userId);
    const defaultBrokerage = await user.getDefaultBrokerage();
    return res.status(200).send({
      success: true,
      message: 'Default brokerage retrieved successfully.',
      defaultBrokerage: defaultBrokerage,
    });
  } catch (error) {
    console.log('getDefaultBrokerage Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while retrieving default brokerage.',
    });
  }
};
