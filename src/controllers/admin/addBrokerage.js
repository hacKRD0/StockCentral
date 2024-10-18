import db from '../../db/models/index.js';

const Brokerage = db.Brokerage;

export default async (req, res) => {
  try {
    const { name } = req.body;
    const brokerage = await Brokerage.create({
      name,
    });
    res.status(200).send({
      success: true,
      brokerage: brokerage,
    });
  } catch (error) {
    console.log('addBrokerage Error: ', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
