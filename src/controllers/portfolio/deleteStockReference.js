import db from '../../db/models/index.js';

const User = db.User;
const StockReference = db.StockReference;

export default async (req, res) => {
  const { userId } = req.userId;
  const { stockReferenceId } = req.body;

  try {
    await StockReference.destroy({
      where: { id: stockReferenceId },
    });

    return res.status(200).send({
      success: true,
      message: 'Stock deleted successfully.',
    });
  } catch (error) {
    console.log('deleteStock Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while deleting the stock.',
    });
  }
};
