import db from '../../db/models/index.js';

const User = db.User;

export default async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    return res
      .status(201)
      .send({ success: true, message: 'User created', user });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
