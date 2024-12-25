import db from '../db/models/index.js';
import firebase from '../firebase/index.js';

const User = db.User;

export default async (req, res, next) => {
  //check if request has authorization header
  const authHeader = req.headers.authorization;
  // console.log('authHeader: ', authHeader);
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return res
  //     .status(401)
  //     .send({ success: false, message: 'No authorization header provided' });
  // }
  // const idToken = authHeader.split('Bearer ')[1];
  // console.log('idToken: ', idToken);
  // if (!idToken) {
  //   return res
  //     .status(401)
  //     .send({ success: false, message: 'No token provided' });
  // }
  try {
    // const decoded = await firebase.auth().verifyIdToken(idToken);
    // // console.log('decoded: ', decoded);
    // if (!decoded.email) {
    //   return res.status(401).send({
    //     success: false,
    //     message:
    //       'Something went wrong while verifying the user. Please, try again',
    //     auth: false,
    //   });
    // }
    // const _email = decoded.email;
    // // console.log('_email: ', _email);
    // const user = await User.findOne({ where: { email: _email } });
    // // console.log('user: ', user);
    // if (!user)
    //   return res.status(404).send({
    //     success: false,
    //     message: 'User not found',
    //   });
    // req.userId = user.id;
    // // console.log(req.body);
    req.userId = req.body.userId || 6;

    next();
  } catch (error) {
    console.log('verifyToken Error: ', error);
    return res.status(403).send({ auth: false, message: error.message });
  }
};
