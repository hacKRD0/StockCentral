import db from '../../db/models/index.js';

const User = db.User;
const Sector = db.Sector;
const StockReference = db.StockReference;

export default async (req, res) => {
  const { userId } = req;
  const { name, code, SectorId } = req.body;
  console.log('req.body: ', req.body);

  try {
    const stockReferenceExists = await StockReference.findOne({
      where: { name: name, UserId: userId },
    });

    if (stockReferenceExists) {
      return res.status(400).send({
        success: false,
        message: 'Stock reference already exists.',
      });
    }

    const unknownSector = await Sector.findOrCreate({
      where: { name: 'Unknown', UserId: userId },
    });

    const stockReference = await StockReference.create({
      UserId: userId,
      name: name,
      code: code,
      SectorId: SectorId ? SectorId : unknownSector.id,
    });

    return res.status(200).send({
      success: true,
      message: 'Stock reference added successfully.',
      stockReference: stockReference,
    });
  } catch (error) {
    console.log('addStockReference Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while adding the stock reference.',
    });
  }
};
