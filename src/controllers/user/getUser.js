import db from '../../db/models/index.js';

const User = db.User;
const Brokerage = db.Brokerage;

export default async (req, res) => {
  const { userId } = req;

  try {
    const user = await User.findOne({
      where: { id: userId },
      include: [
        {
          model: Brokerage,
          as: 'defaultBrokerage',
        },
      ],
    });

    console.log('user: ', user);

    return res.status(200).send({
      success: true,
      message: 'User found successfully.',
      user: user,
    });
  } catch (error) {
    console.log('getUser Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'Error getting user',
    });
  }
};
