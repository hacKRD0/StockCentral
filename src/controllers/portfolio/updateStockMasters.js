import db from '../../db/models/index.js';

const User = db.User;
const StockMaster = db.StockMaster;

export default async (req, res) => {
  const { userId } = req;
  const { updates } = req.body;

  // Validate that 'updates' is provided and is an array
  if (!updates || !Array.isArray(updates)) {
    return res
      .status(400)
      .json({ success: false, message: "'updates' must be an array." });
  }

  try {
    const updatePromises = updates.map(async (update) => {
      const { stockMasterId, sectorId } = update;

      if (typeof stockMasterId !== 'number' || typeof sectorId !== 'number') {
        return {
          status: 'rejected',
          reason: 'Invalid stockMasterId or sectorId.',
          stockMasterId,
          sectorId,
        };
      }

      try {
        const stockMaster = await StockMaster.findByPk(stockMasterId);
        if (!stockMaster) {
          return {
            status: 'rejected',
            reason: `StockMaster with id ${stockMasterId} not found.`,
            stockMasterId,
            sectorId,
          };
        }

        await StockMaster.update(
          {
            SectorId: sectorId,
            updatedAt: new Date(),
          },
          {
            where: { id: stockMasterId },
          }
        );

        const updatedStockMaster = await StockMaster.findByPk(stockMasterId);
        return { status: 'fulfilled', value: updatedStockMaster };
      } catch (error) {
        console.error(
          `Error updating StockMaster with id ${stockMasterId}:`,
          error
        );
        return {
          status: 'rejected',
          reason: 'Database error occurred.',
          stockMasterId,
          sectorId,
        };
      }
    });

    const results = await Promise.allSettled(updatePromises);

    const successfulUpdates = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);
    const failedUpdates = results
      .filter((result) => result.status === 'rejected')
      .map((result) => result.reason);

    return res.status(failedUpdates.length === 0 ? 200 : 207).send({
      success: successfulUpdates.length !== 0,
      message: `${successfulUpdates.length} stock(s) updated successfully.`,
      updatedStockMasters: successfulUpdates,
      failedUpdates: failedUpdates.length > 0 ? failedUpdates : [],
    });
  } catch (error) {
    console.log('updateStockMaster Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while updating the stock reference.',
    });
  }
};
