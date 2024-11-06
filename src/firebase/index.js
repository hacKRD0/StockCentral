import 'dotenv/config';
import firebase from 'firebase-admin';

const credentials = JSON.parse(
  Buffer.from(process.env.FIREBASE_KEY, 'base64').toString()
);

firebase.initializeApp({
  credential: firebase.credential.cert(credentials),
  // credential: firebase.credential.applicationDefault(),
});

export default firebase;
