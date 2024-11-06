import db from '../../db/models/index.js';

const Sector = db.Sector;

export default async (req, res) => {
  const { userId } = req;
  const { sectorName } = req.body;
  console.log('Request : ', req.body);

  try {
    const sectorExists = await Sector.findOne({
      where: { name: sectorName, UserId: userId },
    });

    if (sectorExists) {
      return res.status(400).send({
        success: false,
        message: 'Sector already exists.',
      });
    }

    const sector = await Sector.create({
      UserId: userId,
      name: sectorName,
    });

    return res.status(200).send({
      success: true,
      message: 'Sector created successfully.',
      sector: sector,
    });
  } catch (error) {
    console.log('addSector Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while adding the sector.',
    });
  }
};
