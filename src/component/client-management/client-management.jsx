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

import { ClientManagementForm } from "./form.jsx";
import { Row } from "./row.jsx";

const emptyData = { name: "", uid: "", phone: "", address: "", picture: null };

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
      <h2>Clients</h2>

      <Button
        onClick={(_) => {
          let max = 0;
          for (let data of datalist) {
            if (data.id >= max) {
              max = parseInt(data.id, 10) + 1;
            }
          }
          setCurrentId(max);
        }}
        className="mt-2 mb-4"
      >
        Add new client
      </Button>

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
              onDelete={(id) => {
                setDatalist(datalist.filter((data) => data.id != id));
                deleteDoc(doc(db, "clients", id.toString()));
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
            onClick={(_) => {
              let idx = -1;
              for (let i = 0; i < datalist.length; i++) {
                if (datalist[i].id === currentId) {
                  idx = i;
                  break;
                }
              }

              const obj = { ...currentData, id: currentId };
              if (idx >= 0) {
                setDatalist(datalist.with(idx, obj));
                setDoc(doc(db, "clients", currentId.toString()), currentData);
              } else {
                setDatalist([...datalist, obj]);
                setDoc(doc(db, "clients", currentId.toString()), currentData);
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
