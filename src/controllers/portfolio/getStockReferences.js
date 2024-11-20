import db from '../../db/models/index.js';

const User = db.User;
const Sector = db.Sector;

export default async (req, res) => {
  const { userId } = req;
  try {
    const user = await User.findByPk(userId);
    const stockReferences = await user.getStockReferences({
      include: [{ model: Sector }],
    });
    return res.status(200).send({
      success: true,
      message: 'Stock references retrieved successfully.',
      stockReferences: stockReferences,
    });
  } catch (error) {
    console.log('getStockReferences Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while retrieving stock references.',
    });
  }
};
