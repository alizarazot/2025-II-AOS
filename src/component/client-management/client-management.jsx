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

const emptyData = { name: "", uid: "", phone: "", address: "", picture: null };

export function ClientManagement() {
  const [templateData, setTemplateData] = useState(emptyData);
  const [currentData, setCurrentData] = useState(emptyData);
  const [datalist, setDatalist] = useState(sampleData);
  const [currentId, setCurrentId] = useState(-1);

  return (
    <>
      <h2>Clients</h2>

      <Button
        onClick={(_) => {
          let max = 0;
          for (let data of datalist) {
            if (data.id >= max) {
              max = data.id + 1;
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

              if (idx >= 0) {
                setDatalist(
                  datalist.with(idx, { ...currentData, id: currentId }),
                );
              } else {
                setDatalist([...datalist, { ...currentData, id: currentId }]);
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
