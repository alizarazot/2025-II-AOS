import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

// Colección en Firestore (asegúrate que coincida con tu DB)
const productsCollection = collection(db, "Products");

// CREATE
export const addProduct = async (product) => {
  const payload = {
    ...product,
    // asegurar tipos numéricos
    ...(product.Price !== undefined ? { Price: Number(product.Price) } : {}),
    ...(product.Stock !== undefined ? { Stock: Number(product.Stock) } : {}),
    // nombres de campos según tu Firestore
    Creation: serverTimestamp(),
    Update: serverTimestamp(),
  };
  return addDoc(productsCollection, payload);
};

// READ
export const getProducts = async () => {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// UPDATE
export const updateProduct = async (id, newData) => {
  const productDoc = doc(db, "Products", id);
  const payload = {
    ...newData,
    // no sobreescribir Creation
    Update: serverTimestamp(),
    ...(newData.Price !== undefined ? { Price: Number(newData.Price) } : {}),
    ...(newData.Stock !== undefined ? { Stock: Number(newData.Stock) } : {}),
  };
  return updateDoc(productDoc, payload);
};

// DELETE
export const deleteProduct = async (id) => {
  const productDoc = doc(db, "Products", id);
  return deleteDoc(productDoc);
};