import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { db } from "../firebase";
import { Table, Container, Spinner, Form } from "react-bootstrap";

export function AuditoriaView() {
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadAuditorias();
  }, [filter]);

  const loadAuditorias = async () => {
    try {
      setLoading(true);
      const auditoriaRef = collection(db, "auditoria");
      let q = query(auditoriaRef, orderBy("Ingreso", "desc"));

      if (filter !== "all") {
        q = query(
          auditoriaRef,
          where("Acción Realizada", ">=", filter),
          where("Acción Realizada", "<=", filter + "\uf8ff"),
          orderBy("Acción Realizada"),
          orderBy("Ingreso", "desc")
        );
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          usuario: d.Usuario || "N/A",
          accion: d["Acción Realizada"] || "N/A",
          ingreso: d.Ingreso?.toDate?.() || null,
          salida: d.Salida?.toDate?.() || null,
          tiempoTotal: d["Tiempo total"] || 0,
        };
      });
      setAuditorias(data);
    } catch (error) {
      console.error("Error cargando auditorías:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-3">Cargando auditorías...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Registro de Auditoría</h2>
        <Form.Select
          style={{ width: "250px" }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todas las acciones</option>
          <option value="Ingreso">Solo ingresos</option>
          <option value="Salida">Solo salidas</option>
          <option value="Creó">Creaciones</option>
          <option value="Actualizó">Actualizaciones</option>
          <option value="Eliminó">Eliminaciones</option>
        </Form.Select>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Usuario</th>
            <th>Acción Realizada</th>
            <th>Ingreso</th>
            <th>Salida</th>
            <th>Tiempo Total (min)</th>
          </tr>
        </thead>
        <tbody>
          {auditorias.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No hay registros de auditoría
              </td>
            </tr>
          ) : (
            auditorias.map((aud, idx) => (
              <tr key={aud.id}>
                <td>{idx + 1}</td>
                <td>{aud.usuario}</td>
                <td>
                  <span
                    className={`badge ${
                      aud.accion.includes("Creó")
                        ? "bg-success"
                        : aud.accion.includes("Actualizó")
                          ? "bg-warning"
                          : aud.accion.includes("Eliminó")
                            ? "bg-danger"
                            : aud.accion.includes("Ingreso")
                              ? "bg-primary"
                              : "bg-secondary"
                    }`}
                  >
                    {aud.accion}
                  </span>
                </td>
                <td>{formatDate(aud.ingreso)}</td>
                <td>{formatDate(aud.salida)}</td>
                <td>{aud.tiempoTotal}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <div className="text-muted small mt-3">
        Total de registros: {auditorias.length}
      </div>
    </Container>
  );
}
