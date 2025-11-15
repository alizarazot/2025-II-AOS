import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

class AuditoriaService {
  constructor() {
    this.sessionId = null;
    this.sessionStartTime = null;
    this.currentUser = null;
  }

  // Registrar el ingreso del usuario
  async registrarIngreso(usuario) {
    try {
      this.currentUser = usuario;
      this.sessionStartTime = new Date();

      const auditoriaRef = collection(db, "auditoria");
      const docRef = await addDoc(auditoriaRef, {
        Usuario: usuario.email || usuario.correo,
        Ingreso: serverTimestamp(),
        Salida: null,
        "Tiempo total": 0,
        "Acción Realizada": "Ingreso al sistema",
      });

      this.sessionId = docRef.id;
      console.log("Sesión de auditoría iniciada:", this.sessionId);
      return this.sessionId;
    } catch (error) {
      console.error("Error al registrar ingreso:", error);
    }
  }

  // Registrar la salida del usuario
  async registrarSalida() {
    if (!this.sessionId) {
      console.warn("No hay sesión activa para registrar salida");
      return;
    }

    try {
      const sessionEndTime = new Date();
      const tiempoTotalMinutos = Math.round(
        (sessionEndTime - this.sessionStartTime) / 1000 / 60,
      );

      const auditoriaDocRef = doc(db, "auditoria", this.sessionId);
      await updateDoc(auditoriaDocRef, {
        Salida: serverTimestamp(),
        "Tiempo total": tiempoTotalMinutos,
        "Acción Realizada": "Salida del sistema",
      });

      console.log("Sesión de auditoría cerrada:", this.sessionId);
      this.sessionId = null;
      this.sessionStartTime = null;
      this.currentUser = null;
    } catch (error) {
      console.error("Error al registrar salida:", error);
    }
  }

  // Registrar una acción CRUD
  async registrarAccion(accion, detalles = "") {
    // Obtener el usuario actual de Firebase Auth si no está almacenado
    const usuario = this.currentUser || auth.currentUser;

    if (!usuario) {
      console.error("❌ No hay usuario activo para registrar acción");
      console.log("this.currentUser:", this.currentUser);
      console.log("auth.currentUser:", auth.currentUser);
      return;
    }

    const accionCompleta = `${accion}${detalles ? `: ${detalles}` : ""}`;
    console.log("📝 Registrando acción:", accionCompleta);
    console.log("Usuario:", usuario.email);

    try {
      const auditoriaRef = collection(db, "auditoria");
      const docRef = await addDoc(auditoriaRef, {
        Usuario: usuario.email || usuario.correo,
        Ingreso: serverTimestamp(),
        Salida: serverTimestamp(),
        "Tiempo total": 0,
        "Acción Realizada": accionCompleta,
      });

      console.log("✅ Acción registrada exitosamente. ID:", docRef.id);
    } catch (error) {
      console.error("❌ Error al registrar acción:", error);
      console.error("Detalles del error:", error.message);
    }
  }

  // Métodos específicos para CRUD
  async registrarCreacion(entidad, nombreEntidad = "") {
    await this.registrarAccion(`Creó ${entidad}`, nombreEntidad);
  }

  async registrarActualizacion(entidad, nombreEntidad = "") {
    await this.registrarAccion(`Actualizó ${entidad}`, nombreEntidad);
  }

  async registrarEliminacion(entidad, nombreEntidad = "") {
    await this.registrarAccion(`Eliminó ${entidad}`, nombreEntidad);
  }

  async registrarConsulta(entidad) {
    await this.registrarAccion(`Consultó ${entidad}`);
  }
}

// Exportar una instancia única (singleton)
export const auditoriaService = new AuditoriaService();
