import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

// Colección de proveedores en Firestore
const providersCollection = collection(db, "Providers");

// CREATE - Agregar nuevo proveedor
export const addProvider = async (provider) => {
  const payload = {
    ...provider,
    Creation: serverTimestamp(),
    Update: serverTimestamp(),
  };
  return addDoc(providersCollection, payload);
};

// READ - Obtener todos los proveedores
export const getProviders = async () => {
  const q = query(providersCollection, orderBy("Creation", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// UPDATE - Actualizar proveedor existente
export const updateProvider = async (id, newData) => {
  const providerDoc = doc(db, "Providers", id);
  const payload = {
    ...newData,
    Update: serverTimestamp(),
  };
  return updateDoc(providerDoc, payload);
};

// DELETE - Eliminar proveedor
export const deleteProvider = async (id) => {
  const providerDoc = doc(db, "Providers", id);
  return deleteDoc(providerDoc);
};

// SOFT DELETE - Cambiar estado a Inactivo en lugar de eliminar
export const deactivateProvider = async (id) => {
  const providerDoc = doc(db, "Providers", id);
  return updateDoc(providerDoc, {
    State: "Inactivo",
    Update: serverTimestamp(),
  });
};

// REACTIVATE - Reactivar proveedor
export const reactivateProvider = async (id) => {
  const providerDoc = doc(db, "Providers", id);
  return updateDoc(providerDoc, {
    State: "Activo",
    Update: serverTimestamp(),
  });
};

// UPDATE - Actualizar información de contacto
export const updateProviderContact = async (id, contactData) => {
  const providerDoc = doc(db, "Providers", id);
  const payload = {
    Email: contactData.Email,
    Phone: contactData.Phone,
    Address: contactData.Address,
    Update: serverTimestamp(),
  };
  return updateDoc(providerDoc, payload);
};

// UPDATE - Actualizar calificación del proveedor
export const updateProviderRating = async (id, rating, comment = "") => {
  const providerDoc = doc(db, "Providers", id);
  const payload = {
    Rating: Number(rating),
    RatingComment: comment,
    Update: serverTimestamp(),
  };
  return updateDoc(providerDoc, payload);
};
