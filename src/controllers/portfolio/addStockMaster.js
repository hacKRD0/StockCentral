import db from '../../db/models/index.js';

const StockMaster = db.StockMaster;

export default async (req, res) => {
  const { userId } = req;
  const { name, code, SectorId } = req.body;
  console.log('req.body: ', req.body);

  try {
    const stockMasterExists = await StockMaster.findOne({
      where: { code: code, UserId: userId },
    });

    if (stockMasterExists) {
      return res.status(400).send({
        success: false,
        message: 'Master stock already exists.',
      });
    }

    const stockMaster = await StockMaster.create({
      UserId: userId,
      name: name,
      code: code,
      SectorId: SectorId ? SectorId : null,
    });

    return res.status(200).send({
      success: true,
      message: 'Master stock added successfully.',
      stockMaster: stockMaster,
    });
  } catch (error) {
    console.log('addStockMaster Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while adding the master stock.',
    });
  }
};
