import { useState } from "react";

import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { ClientManagementForm } from "./form.jsx";
import { Row } from "./row.jsx";

const sampleData = [
  {
    id: 0,
    name: "Sofia",
    uid: "3453405304",
    phone: "123 45 575",
    address: "Bulgaria",
    picture:
      "https://images.unsplash.com/photo-1505483531331-fc3cf89fd382?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 1,
    name: "Rocky",
    uid: "D-235325",
    phone: "434 23 5646",
    address: "Here",
    picture:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 2,
    name: "Derek",
    uid: "5645673735",
    phone: "675 345 23",
    address: "Mars",
    picture:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVufGVufDB8fDB8fHww",
  },
];

export function ClientManagement() {
  const [showModal, setShowModal] = useState(false);
  const [currentData, setCurrentData] = useState({});

  return (
    <>
      <h2>Clients</h2>

      <Button
        onClick={(_) => {
          setShowModal(true);
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
          {sampleData.map((data) => (
            <Row data={data}></Row>
          ))}
        </tbody>
      </Table>

      <Modal
        centered
        backdrop="static"
        show={showModal}
        onHide={(_) => {
          setShowModal(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>Add client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ClientManagementForm
            onUpdateField={(field, value) => {
              const newData = currentData;
              newData[field] = value;
              setCurrentData(newData);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={(_) => {
              setShowModal(false);
            }}
            variant="secondary"
          >
            Close
          </Button>
          <Button
            onClick={(_) => {
              setShowModal(false);
              sampleData.push(currentData);
            }}
            variant="primary"
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
