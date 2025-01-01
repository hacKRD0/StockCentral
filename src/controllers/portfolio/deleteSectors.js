import db from '../../db/models/index.js';
import { Op } from 'sequelize';

const Sector = db.Sector;

export default async (req, res) => {
  const { sectorIds } = req.body;

  try {
    if (!Array.isArray(sectorIds)) {
      return res.status(400).send({
        success: false,
        message: 'A list of sector IDs is required.',
      });
    }

    const deleteCount = await Sector.destroy({
      where: {
        id: {
          [Op.in]: sectorIds,
        },
      },
    });

    return res.status(200).send({
      success: true,
      message: 'Sectors deleted successfully.',
      count: deleteCount,
    });
  } catch (error) {
    console.log('deleteSectors Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while deleting sectors.',
    });
  }
};
