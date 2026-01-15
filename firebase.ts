
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDUgQvuFWLFEwgeIjUFyWqRjPW2mGsJog",
  authDomain: "dalolatnoma-aef2c.firebaseapp.com",
  projectId: "dalolatnoma-aef2c",
  storageBucket: "dalolatnoma-aef2c.firebasestorage.app",
  messagingSenderId: "237195738675",
  appId: "1:237195738675:web:7ae5e93cd8a2b46cabad46",
  measurementId: "G-HBY8JZVH5J"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const actsCollection = collection(db, "dalolatnomalar");

export const saveDalolatnoma = async (act: Omit<any, 'id'>) => {
  return await addDoc(actsCollection, { ...act, createdAt: Date.now() });
};

export const updateDalolatnoma = async (id: string, data: Partial<any>) => {
  const docRef = doc(db, "dalolatnomalar", id);
  return await updateDoc(docRef, data);
};

export const deleteDalolatnoma = async (id: string) => {
  const docRef = doc(db, "dalolatnomalar", id);
  return await deleteDoc(docRef);
};

export const fetchDalolatnomalar = async () => {
  const q = query(actsCollection, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchDalolatnomaById = async (id: string) => {
  const docRef = doc(db, "dalolatnomalar", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};
