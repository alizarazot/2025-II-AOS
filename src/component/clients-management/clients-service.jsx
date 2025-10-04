import { db } from "../../firebase";
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
  where,
} from "firebase/firestore";

// Colección de clientes en Firestore
const clientsCollection = collection(db, "Clients");

// CREATE - Agregar nuevo cliente
export const addClient = async (client) => {
  const payload = {
    ...client,
    Creation: serverTimestamp(),
    Update: serverTimestamp(),
  };
  return addDoc(clientsCollection, payload);
};

// READ - Obtener todos los clientes
export const getClients = async () => {
  const q = query(clientsCollection, orderBy("Creation", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// READ - Obtener clientes activos únicamente
export const getActiveClients = async () => {
  const q = query(
    clientsCollection,
    where("State", "==", "Activo"),
    orderBy("Creation", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// UPDATE - Actualizar cliente existente
export const updateClient = async (id, newData) => {
  const clientDoc = doc(db, "Clients", id);
  const payload = {
    ...newData,
    Update: serverTimestamp(),
  };
  return updateDoc(clientDoc, payload);
};

// DELETE - Eliminar cliente
export const deleteClient = async (id) => {
  const clientDoc = doc(db, "Clients", id);
  return deleteDoc(clientDoc);
};

// SOFT DELETE - Cambiar estado a Inactivo en lugar de eliminar
export const deactivateClient = async (id) => {
  const clientDoc = doc(db, "Clients", id);
  return updateDoc(clientDoc, {
    State: "Inactivo",
    Update: serverTimestamp(),
  });
};
