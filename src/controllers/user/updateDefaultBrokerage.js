import db from '../../db/models/index.js';

const User = db.User;

export default async (req, res) => {
  const { userId } = req;
  const { brokerageId } = req.body;

  if (!brokerageId) {
    return res.status(400).send('Default brokerage id is required.');
  }

  try {
    await User.update(
      {
        defaultBrokerageId: brokerageId,
        updatedAt: new Date(),
      },
      {
        where: { id: userId },
      }
    );

    const user = await User.findByPk(userId);
    return res.status(200).send({
      success: true,
      message: 'Default brokerage id updated successfully.',
      user: user,
    });
  } catch (error) {
    console.log('updateDefaultBrokerage Error: ', error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while updating the user's default brokerage.",
    });
  }
};
