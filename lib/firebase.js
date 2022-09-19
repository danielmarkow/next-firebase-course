import {initializeApp, getApps} from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore, collection, query, where, limit, doc, getDocs, getDoc, Timestamp} from 'firebase/firestore';
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID
};

function initFirebase(firebaseConfig) {
  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);
  const googleAuthProvider = new GoogleAuthProvider();

  const firestore = getFirestore(app);
  const storage = getStorage(app);

  return [app, auth, googleAuthProvider, firestore, storage];
}

export const [app, auth, googleAuthProvider, firestore, storage] = initFirebase(firebaseConfig);

export async function getUserWithUsername(username) {
  const userRef = collection(firestore, "users");
  const q = query(userRef, where("username", "==", username), limit(1));
  const userDoc = await getDocs(q);

  // object with username, photoURL and displayName
  if (userDoc.docs.length > 0) {
    let res = userDoc.docs[0].data();
    // add user id to it
    res = {...res, id: userDoc.docs[0].id};
    return res;
  }

  return null;
};

export function postToJson(doc) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  }
};
export const fromMillis = Timestamp.fromMillis;

