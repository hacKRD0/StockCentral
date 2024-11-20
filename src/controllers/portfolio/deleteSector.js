import db from '../../db/models/index.js';

const Sector = db.Sector;
const StockReference = db.StockReference;

export default async (req, res) => {
  const { userId } = req;
  const { sectorId } = req.body;

  try {
    const unknownSector = await Sector.findOne({
      where: { name: 'Unknown', UserId: userId },
    });

    if (sectorId === unknownSector.id) {
      return res.status(400).send({
        success: false,
        message: 'You cannot delete the Unknown sector.',
      });
    }

    await StockReference.update(
      { SectorId: unknownSector.id },
      { where: { SectorId: sectorId, UserId: userId } }
    );

    const sector = await Sector.destroy({
      where: { id: sectorId },
    });

    return res.status(200).send({
      success: true,
      message: 'Sector deleted successfully.',
      sector: sector,
    });
  } catch (error) {
    console.log('deleteSector Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while deleting the sector.',
    });
  }
};
