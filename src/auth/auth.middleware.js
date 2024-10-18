import db from '../db/models/index.js';

const User = db.User;

export default async (req, res, next) => {
  //check if request has authorization header
  // if (!req.headers.authorization) {
  //   return res
  //     .status(401)
  //     .send({ success: false, message: 'No authorization header provided' });
  // }
  // extract the jwt token, tokens are sent like this 'Bearer xxxxtokenxxxx'
  // const jwtToken = req.headers.authorization.split(' ')[1];
  // if (!jwtToken) {
  //   return res
  //     .status(401)
  //     .send({ success: false, message: 'No token provided' });
  // }

  try {
    // const decoded = await jwt.verify(jwtToken, config.jwtSecret);
    // if (!decoded.id) {
    //   return res.status(401).send({
    //     success: false,
    //     message: 'Something went wrong while logging in. Please, try again',
    //     auth: false,
    //   });
    // }
    // const user = await User.findByPk(decoded.id);
    // if (!user)
    //   return res.status(404).send({
    //     success: false,
    //     message: 'User not found',
    //   });
    // req.userId = decoded.id;
    console.log(req.body);
    req.userId = 1;

    next();
  } catch (error) {
    console.log('verifyToken Error: ', error);
    return res.status(401).send({ auth: false, message: error.message });
  }
};
