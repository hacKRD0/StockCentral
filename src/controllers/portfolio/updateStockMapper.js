import db from '../../db/models/index.js';

const User = db.User;
const StockMapper = db.StockMapper;

export default async (req, res) => {
  const { userId } = req;
  const { stocks } = req.body; // Expecting an array of { stockId, stockMasterId }

  if (!Array.isArray(stocks) || stocks.length === 0) {
    return res
      .status(400)
      .send('A list of stocks with stockId and stockMasterId is required.');
  }

  try {
    // Validate each stock update entry
    const invalidEntries = stocks.filter(
      (stock) => !stock.stockId || !stock.stockMasterId
    );

    if (invalidEntries.length > 0) {
      return res.status(400).send({
        success: false,
        message: 'Each stock must have both stockId and stockMasterId.',
        invalidEntries,
      });
    }

    // Perform updates
    const updatePromises = stocks.map(({ stockId, stockMasterId }) =>
      StockMapper.update(
        {
          StockMasterId: stockMasterId,
          updatedAt: new Date(),
        },
        {
          where: { id: stockId },
        }
      )
    );

    await Promise.all(updatePromises);

    // Fetch updated stocks to confirm changes
    const updatedStocks = await StockMapper.findAll({
      where: {
        id: stocks.map((stock) => stock.stockId),
      },
    });

    return res.status(200).send({
      success: true,
      message: 'Stocks updated successfully.',
      updatedStocks,
    });
  } catch (error) {
    console.log('updateStocks Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while updating the stocks.',
    });
  }
};
