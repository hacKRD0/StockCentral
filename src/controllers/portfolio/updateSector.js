import db from '../../db/models/index.js';

const Sector = db.Sector;

export default async (req, res) => {
  const { sectorId, sectorName } = req.body;

  try {
    // console.log('sectorName: ', sectorName);
    const sector = await Sector.update(
      {
        name: sectorName,
      },
      {
        where: { id: sectorId },
      }
    );

    const updatedSector = await Sector.findByPk(sectorId);
    // console.log('updatedSector: ', updatedSector);

    return res.status(200).send({
      success: true,
      message: 'Sector updated successfully.',
      sector: sector,
    });
  } catch (error) {
    console.log('updateSector Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while updating the sector.',
    });
  }
};
