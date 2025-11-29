import { useState } from "react";

import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../../firebase";
import { auditoriaService } from "../../services/auditoria-service";

import * as Excel from "exceljs";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

import { ClientManagementForm } from "./form.jsx";
import { Row } from "./row.jsx";

const emptyData = {
  name: "",
  uid: "",
  phone: "",
  address: "",
  picture: "/src/assets/icon-login.png",
};

export function ClientManagement() {
  const [isLoading, setIsLoading] = useState(true);

  const [templateData, setTemplateData] = useState(emptyData);
  const [currentData, setCurrentData] = useState(emptyData);
  const [datalist, setDatalist] = useState([]);
  const [currentId, setCurrentId] = useState(-1);

  getDocs(collection(db, "clients")).then((data) => {
    const remoteData = [];
    data.forEach((data) => remoteData.push({ ...data.data(), id: data.id }));
    setDatalist(remoteData);
    setIsLoading(false);
  });

  if (isLoading) {
    return <span> Loading... </span>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Clients</h2>
        <div className="d-flex gap-2">
          <Button
            variant="success"
            onClick={() => DownloadClientsAsExcel(datalist)}
            disabled={datalist.length === 0}
          >
            📊 Download Excel
          </Button>
          <Button
            variant="danger"
            onClick={() => DownloadClientsAsPDF(datalist)}
            disabled={datalist.length === 0}
          >
            📄 Download PDF
          </Button>
          <Button
            onClick={(_) => {
              let max = 0;
              for (let data of datalist) {
                if (data.id >= max) {
                  max = parseInt(data.id, 10) + 1;
                }
              }
              setTemplateData(emptyData);
              setCurrentData(emptyData);
              setCurrentId(max);
            }}
          >
            Add new client
          </Button>
        </div>
      </div>

      <Table bordered hover responsive className="align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Picture</th>
            <th>Name</th>
            <th>Document ID</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {datalist.map((data) => (
            <Row
              key={data.id}
              data={data}
              onEdit={(id) => {
                const tmpl = datalist.find((data) => data.id === id);
                setTemplateData(tmpl);
                setCurrentData(tmpl);
                setCurrentId(id);
              }}
              onDelete={async (id) => {
                const client = datalist.find((data) => data.id === id);
                setDatalist(datalist.filter((data) => data.id != id));
                await deleteDoc(doc(db, "clients", id.toString()));
                await auditoriaService.registrarEliminacion(
                  "cliente",
                  client?.name || id,
                );
              }}
            ></Row>
          ))}
        </tbody>
      </Table>

      <Modal
        centered
        backdrop="static"
        show={currentId >= 0}
        onHide={(_) => {
          setCurrentId(-1);
        }}
      >
        <Modal.Header>
          <Modal.Title>Add client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ClientManagementForm
            templateData={templateData}
            onUpdateField={(field, value) => {
              const obj = { ...currentData };
              obj[field] = value;
              setCurrentData(obj);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={(_) => {
              setCurrentId(-1);
            }}
            variant="secondary"
          >
            Close
          </Button>
          <Button
            onClick={async (_) => {
              let idx = -1;
              for (let i = 0; i < datalist.length; i++) {
                if (datalist[i].id === currentId) {
                  idx = i;
                  break;
                }
              }

              const obj = { ...currentData, id: currentId };
              const isUpdate = idx >= 0;

              if (isUpdate) {
                setDatalist(datalist.with(idx, obj));
                await setDoc(
                  doc(db, "clients", currentId.toString()),
                  currentData,
                );
                await auditoriaService.registrarActualizacion(
                  "cliente",
                  currentData.name,
                );
              } else {
                setDatalist([...datalist, obj]);
                await setDoc(
                  doc(db, "clients", currentId.toString()),
                  currentData,
                );
                await auditoriaService.registrarCreacion(
                  "cliente",
                  currentData.name,
                );
              }

              setCurrentId(-1);
            }}
            variant="primary"
          >
            {datalist.find((data) => data.id === currentId) ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Función para descargar clientes como Excel
async function DownloadClientsAsExcel(clients) {
  const workbook = new Excel.Workbook();
  workbook.creator = "Temu2";
  workbook.lastModifiedBy = "Temu2 WebApp";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Clientes", {
    properties: { tabColor: { argb: "FF007BFF" } },
  });

  sheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Nombre", key: "name", width: 30 },
    { header: "Documento ID", key: "uid", width: 20 },
    { header: "Teléfono", key: "phone", width: 15 },
    { header: "Dirección", key: "address", width: 40 },
  ];

  clients.forEach((client) => {
    sheet.addRow({
      id: client.id || "N/A",
      name: client.name || "N/A",
      uid: client.uid || "N/A",
      phone: client.phone || "N/A",
      address: client.address || "N/A",
    });
  });

  workbook.modified = new Date();
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = "clientes.xlsx";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

// Función para descargar clientes como PDF
async function DownloadClientsAsPDF(clients) {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontSize: 10,
    },
    title: {
      fontSize: 18,
      marginBottom: 20,
      fontWeight: "bold",
    },
    table: {
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#007bff",
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
    },
    tableCellHeader: {
      padding: 5,
      fontSize: 8,
      borderRightWidth: 1,
      borderRightColor: "#000",
      borderRightStyle: "solid",
      fontWeight: "bold",
      color: "#fff",
    },
  });

  const blob = await pdf(
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.title}>Lista de Clientes</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, { width: "10%" }]}>ID</Text>
            <Text style={[styles.tableCellHeader, { width: "25%" }]}>Nombre</Text>
            <Text style={[styles.tableCellHeader, { width: "20%" }]}>Documento ID</Text>
            <Text style={[styles.tableCellHeader, { width: "15%" }]}>Teléfono</Text>
            <Text style={[styles.tableCellHeader, { width: "30%" }]}>Dirección</Text>
          </View>
          {clients.map((client, idx) => (
            <View key={client.id} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowEven]}>
              <Text style={[styles.tableCell, { width: "10%" }]}>{client.id}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>{client.name}</Text>
              <Text style={[styles.tableCell, { width: "20%" }]}>{client.uid}</Text>
              <Text style={[styles.tableCell, { width: "15%" }]}>{client.phone}</Text>
              <Text style={[styles.tableCell, { width: "30%" }]}>{client.address}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  ).toBlob();

  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = "clientes.pdf";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
