// firebaseAdmin.js
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json"; // path to your downloaded private key

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
