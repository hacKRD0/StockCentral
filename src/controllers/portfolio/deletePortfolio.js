import db from '../../db/models/index.js';
import { Op } from 'sequelize';

const User = db.User;
const Brokerage = db.Brokerage;
const StockMapper = db.StockMapper;
const UserStocks = db.UserStocks;

export default async (req, res) => {
  const { userId } = req;
  let { brokerageId, fromDate, toDate } = req.body;

  try {
    brokerageId = parseInt(brokerageId);
    const brokerage = await Brokerage.findByPk(brokerageId);
    if (!brokerage) {
      return res.status(400).send({
        success: false,
        message: `Brokerage not found: ${brokerageId}`,
      });
    }

    // Delete existing data for the same date
    const stockMapperIds = await StockMapper.findAll({
      attributes: ['id'],
      where: {
        UserId: userId,
        BrokerageId: brokerage.id,
      },
    });

    // Extract the IDs into an array
    const ids = stockMapperIds.map((m) => m.id);
    console.log('ids: ', ids);

    // Delete all UserStocks for the given StockMapperIds and date
    const deleteCount = await UserStocks.destroy({
      where: {
        UserId: userId,
        Date: { [Op.between]: [new Date(fromDate), new Date(toDate)] },
        StockMapperId: { [Op.in]: ids },
      },
    });

    return res.status(200).send({
      success: true,
      message: 'Portfolio deleted successfully.',
      deleteCount: deleteCount,
    });
  } catch (error) {
    console.log('deletePortfolio Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'Error deleting portfolio',
    });
  }
};
