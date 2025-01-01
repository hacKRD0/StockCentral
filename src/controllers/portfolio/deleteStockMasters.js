import db from '../../db/models/index.js';
import { Op } from 'sequelize';

const StockMaster = db.StockMaster;

export default async (req, res) => {
  const { stockMasterIds } = req.body;

  try {
    if (!Array.isArray(stockMasterIds)) {
      return res.status(400).send({
        success: false,
        message: 'A list of stockMaster IDs is required.',
      });
    }

    const deleteCount = await StockMaster.destroy({
      where: {
        id: {
          [Op.in]: stockMasterIds,
        },
      },
    });

    return res.status(200).send({
      success: true,
      message: 'Stocks deleted successfully.',
      count: deleteCount,
    });
  } catch (error) {
    console.log('deleteStock Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while deleting the stock.',
    });
  }
};
