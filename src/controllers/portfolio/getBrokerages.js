import db from '../../db/models/index.js';

const Brokerage = db.Brokerage;

export default async (req, res) => {
  try {
    const brokerages = await Brokerage.findAll();

    return res.status(200).send({
      success: true,
      message: 'Brokerages retrieved successfully.',
      Brokerages: brokerages,
    });
  } catch (error) {
    console.log('getBrokerages Error: ', error);
    return res.status(500).send({
      success: false,
      message: 'An error occurred while retrieving the brokerages table.',
    });
  }
};
