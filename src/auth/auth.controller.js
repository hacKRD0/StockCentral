import db from '../db/models/index.js';
import bcrypt from 'bcrypt';

const User = db.User;

export default async (req, res) => {
  let { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res
        .status(400)
        .send({ success: false, message: 'User already exists' });
    }
    if (password == '') {
      password = Math.random().toString(36).slice(-8);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    return res
      .status(201)
      .send({ success: true, message: 'User created', user });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
