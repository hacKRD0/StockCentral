import db from '../../db/models/index.js';

const User = db.User;
const StockMaster = db.StockMaster;

export default async (req, res) => {
  const { userId } = req;
  const { stockId, stockReferenceId, sector } = req.body;

  if (!stockReferenceId && !sector) {
    return res.status(400).send('Stock reference id or sector is required.');
  }

  try {
    await StockMaster.update(
      {
        StockReferenceId: stockReferenceId,
        BrokerageSector: sector,
        updatedAt: new Date(),
      },
      {
        where: { id: stockId },
      }
    );

    const stock = await StockMaster.findByPk(stockId);

    return res.status(200).send({
      success: true,
      message: 'Stock updated successfully.',
      stock: stock,
    });
  } catch (error) {
    console.log('updateStock Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while updating the stock.',
    });
  }
};
