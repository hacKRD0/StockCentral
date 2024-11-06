import db from '../../db/models/index.js';

const Sector = db.Sector;
const StockMaster = db.StockMaster;

export default async (req, res) => {
  const { sectorId } = req.body;

  try {
    const unknownSector = await Sector.findOne({
      where: { name: 'Unknown' },
    });

    await StockMaster.update(
      { SectorId: unknownSector.id },
      { where: { SectorId: sectorId } }
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
