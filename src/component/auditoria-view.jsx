import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { db } from "../firebase";
import { Table, Container, Spinner, Form, Button } from "react-bootstrap";

import * as Excel from "exceljs";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

const auditsCollection = collection(db, "auditoria");

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
          orderBy("Ingreso", "desc"),
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
      <div className="d-flex flex-md-row flex-column justify-content-md-between align-items-start align-items-md-center mb-4">
        <h2>Registro de Auditoría</h2>
        <Form.Select
          style={{ maxWidth: "250px" }}
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
        <Button onClick={DownloadAsExcel}> Download as XSLX (MS Excel) </Button>
        <Button onClick={DownloadAsPDF}> Download as PDF </Button>
      </div>

      <AuditsTable auditorias={auditorias} />

      <div className="text-muted small mt-3">
        Total de registros: {auditorias.length}
      </div>
    </Container>
  );
}

function AuditsTable({ auditorias }) {
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

  return (
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
  );
}

function AuditsTablePDF({ auditorias }) {
  // Create styles
  const styles = StyleSheet.create({
    table: {
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      marginBottom: 10,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#343a40",
      color: "#fff",
      fontWeight: "bold",
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      borderBottomStyle: "solid",
    },
    tableRowEven: {
      backgroundColor: "#f8f9fa",
    },
    tableCell: {
      padding: 5,
      fontSize: 8,
      borderRightWidth: 1,
      borderRightColor: "#000",
      borderRightStyle: "solid",
      flex: 1,
    },
    tableCellHeader: {
      padding: 5,
      fontSize: 8,
      borderRightWidth: 1,
      borderRightColor: "#000",
      borderRightStyle: "solid",
      flex: 1,
      fontWeight: "bold",
      color: "#fff",
    },
    centeredCell: {
      textAlign: "center",
      flex: 1,
    },
    badge: {
      padding: "2 4",
      borderRadius: 2,
      fontSize: 7,
      fontWeight: "bold",
    },
    badgeSuccess: { backgroundColor: "#28a745", color: "#fff" },
    badgeWarning: { backgroundColor: "#ffc107", color: "#000" },
    badgeDanger: { backgroundColor: "#dc3545", color: "#fff" },
    badgePrimary: { backgroundColor: "#007bff", color: "#fff" },
    badgeSecondary: { backgroundColor: "#6c757d", color: "#fff" },
    noRecords: {
      padding: 10,
      textAlign: "center",
      color: "#6c757d",
      fontStyle: "italic",
    },
  });

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

  const getBadgeStyle = (accion) => {
    if (accion.includes("Creó"))
      return { ...styles.badge, ...styles.badgeSuccess };
    if (accion.includes("Actualizó"))
      return { ...styles.badge, ...styles.badgeWarning };
    if (accion.includes("Eliminó"))
      return { ...styles.badge, ...styles.badgeDanger };
    if (accion.includes("Ingreso"))
      return { ...styles.badge, ...styles.badgePrimary };
    return { ...styles.badge, ...styles.badgeSecondary };
  };

  return (
    <View style={styles.table}>
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableCellHeader}>#</Text>
        <Text style={styles.tableCellHeader}>Usuario</Text>
        <Text style={styles.tableCellHeader}>Acción Realizada</Text>
        <Text style={styles.tableCellHeader}>Ingreso</Text>
        <Text style={styles.tableCellHeader}>Salida</Text>
        <Text style={styles.tableCellHeader}>Tiempo Total (min)</Text>
      </View>

      {/* Table Body */}
      {auditorias.length === 0 ? (
        <View style={styles.tableRow}>
          <Text
            style={{ ...styles.tableCell, ...styles.centeredCell, flex: 6 }}
          >
            No hay registros de auditoría
          </Text>
        </View>
      ) : (
        auditorias.map((aud, idx) => (
          <View
            key={aud.id}
            style={[styles.tableRow, idx % 2 === 0 && styles.tableRowEven]}
          >
            <Text style={styles.tableCell}>{idx + 1}</Text>
            <Text style={styles.tableCell}>{aud.usuario}</Text>
            <View style={styles.tableCell}>
              <Text style={getBadgeStyle(aud.accion)}>{aud.accion}</Text>
            </View>
            <Text style={styles.tableCell}>{formatDate(aud.ingreso)}</Text>
            <Text style={styles.tableCell}>{formatDate(aud.salida)}</Text>
            <Text style={styles.tableCell}>{aud.tiempoTotal}</Text>
          </View>
        ))
      )}
    </View>
  );
}

async function DownloadAsExcel() {
  const workbook = new Excel.Workbook();

  workbook.creator = "Temu2";
  workbook.lastModifiedBy = "Temu2 WebApp";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Audits", {
    properties: { tabColor: { argb: "FF0D6EFD" } },
  });

  sheet.columns = [
    { header: "Acción Realizada", key: "Acción Realizada", width: 20 },
    { header: "Ingreso", key: "Ingreso", width: 30 },
    { header: "Salida", key: "Salida", width: 30 },
    { header: "Tiempo Total", key: "Tiempo total", width: 10 },
    { header: "Usuario", key: "Usuario", width: 30 },
  ];

  (await getDocs(auditsCollection)).forEach((doc) => {
    console.log(doc.data());
    const data = doc.data();

    if (data.Ingreso != null) {
      data.Ingreso = data.Ingreso.toDate().toString();
    } else {
      data.Ingreso = "N/A";
    }
    if (data.Salida != null) {
      data.Salida = data.Salida.toDate().toString();
    } else {
      data.Salida = "N/A";
    }

    data["Tiempo total"] = humanizeMinutes(data["Tiempo total"]);

    sheet.addRow(data);
  });

  workbook.modified = new Date();

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const downloadUrl = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = "audits.xlsx";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

async function DownloadAsPDF() {
  let data = [];

  (await getDocs(auditsCollection)).forEach((doc) => {
    console.log(doc.data());
    const d = doc.data();

    data.push({
      id: doc.id,
      usuario: d.Usuario || "N/A",
      accion: d["Acción Realizada"] || "N/A",
      ingreso: d.Ingreso?.toDate?.() || null,
      salida: d.Salida?.toDate?.() || null,
      tiempoTotal: d["Tiempo total"] || 0,
    });
  });

  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#E4E4E4",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
  });

  const blob = await pdf(
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Auditorías</Text>
          <AuditsTablePDF auditorias={data} />
        </View>
      </Page>
    </Document>,
  ).toBlob();

  const downloadUrl = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = "audits.pdf";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

// I trust Gemini.
function humanizeMinutes(totalMinutes) {
  if (totalMinutes === 0) {
    return "0 minutes";
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const parts = [];

  if (hours > 0) {
    parts.push(hours + (hours === 1 ? " hour" : " hours"));
  }

  if (minutes > 0) {
    parts.push(minutes + (minutes === 1 ? " minute" : " minutes"));
  }

  // Combine parts with "and"
  if (parts.length === 2) {
    return parts.join(" and ");
  } else {
    return parts[0];
  }
}
