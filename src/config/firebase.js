import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdg_1wWKDI3GnhuBgMbhsELYz9lvANjZ0",
  authDomain: "schoolai-f0223.firebaseapp.com",
  projectId: "schoolai-f0223",
  storageBucket: "schoolai-f0223.appspot.com",
  messagingSenderId: "828391334116",
  appId: "1:828391334116:web:007f25cc2a763711410cf1",
  measurementId: "G-K09HF201C2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const firestore = getFirestore(app);
export const usageCollection = collection(firestore, 'usage');

export const db = getFirestore();

export async function fetchUsers() {
  const usersCollection = collection(db, 'users');
  const userSnapshot = await getDocs(usersCollection);
  const userList = userSnapshot.docs.map(doc => doc.data());
  return userList;
}

export { createUserWithEmailAndPassword, signInWithEmailAndPassword };
