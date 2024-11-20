import db from '../../db/models/index.js';

const User = db.User;
const StockReference = db.StockReference;

export default async (req, res) => {
  const { userId } = req;
  const { stockReferenceId, sectorId } = req.body;

  if (!sectorId || !stockReferenceId) {
    return res.status(400).send('Sector id is required.');
  }

  try {
    await StockReference.update(
      {
        SectorId: sectorId,
        updatedAt: new Date(),
      },
      {
        where: { id: stockReferenceId },
      }
    );

    const stockReference = await StockReference.findByPk(stockReferenceId);
    // console.log('Stock: ', stock);
    return res.status(200).send({
      success: true,
      message: 'Stock reference updated successfully.',
      stockReference: stockReference,
    });
  } catch (error) {
    console.log('updateStockReference Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while updating the stock reference.',
    });
  }
};
