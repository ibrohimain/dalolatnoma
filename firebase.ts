
// Use the standard modular import for initializeApp and Firestore functions.
import * as firebaseApp from "firebase/app";
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
import { Dalolatnoma } from "./types";

const { initializeApp } = firebaseApp;

// The API key is obtained from the environment variable process.env.API_KEY.
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "dalolatnoma-aef2c.firebaseapp.com",
  projectId: "dalolatnoma-aef2c",
  storageBucket: "dalolatnoma-aef2c.firebasestorage.app",
  messagingSenderId: "237195738675",
  appId: "1:237195738675:web:7ae5e93cd8a2b46cabad46",
  measurementId: "G-HBY8JZVH5J"
};

// Initialize Firebase application instance
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Define collection reference for Firestore
export const actsCollection = collection(db, "dalolatnomalar");

// Helper to save a new dalolatnoma
export const saveDalolatnoma = async (act: Omit<Dalolatnoma, 'id' | 'createdAt'>) => {
  return await addDoc(actsCollection, { ...act, createdAt: Date.now() });
};

// Helper to update an existing dalolatnoma
export const updateDalolatnoma = async (id: string, data: Partial<Dalolatnoma>) => {
  const docRef = doc(db, "dalolatnomalar", id);
  return await updateDoc(docRef, data);
};

// Helper to delete a dalolatnoma
export const deleteDalolatnoma = async (id: string) => {
  const docRef = doc(db, "dalolatnomalar", id);
  return await deleteDoc(docRef);
};

// Helper to fetch all records ordered by creation date
export const fetchDalolatnomalar = async (): Promise<Dalolatnoma[]> => {
  const q = query(actsCollection, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dalolatnoma));
};

// Helper to retrieve a single record by ID
export const getActById = async (id: string): Promise<Dalolatnoma | null> => {
  const docRef = doc(db, "dalolatnomalar", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Dalolatnoma;
  }
  return null;
};
