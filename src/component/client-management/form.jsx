import { useState } from "react";

import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";

export function ClientManagementForm({ templateData, onUpdateField }) {
  const [data, setData] = useState(templateData);

  return (
    <Form className="fluid mx-auto">
      <div className="d-flex">
        <div
          className="d-flex flex-column flex-grow-1 mb-2"
          style={{ flexBasis: 1 }}
        >
          <Form.Group className="mb-2">
            <Form.Label> Name </Form.Label>
            <Form.Control
              value={data.name}
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
                onUpdateField("name", e.target.value);
              }}
              type="text"
              placeholder="Your name here"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label> Document </Form.Label>
            <Form.Control
              value={data.uid}
              onChange={(e) => {
                setData({ ...data, uid: e.target.value });
                onUpdateField("uid", e.target.value);
              }}
              type="text"
              placeholder="Without dots or commas"
            />
          </Form.Group>
        </div>
        <div className="flex-grow-1" style={{ flexBasis: 1 }}>
          <Image
            thumbnail
            className="img-fluid d-block mx-auto"
            style={{ height: 147, width: 147, objectFit: "cover" }}
            src={data.picture}
          />
        </div>
      </div>

      <div className="d-flex">
        <Form.Group className="me-1 flex-grow-1">
          <Form.Label> Phone number </Form.Label>
          <Form.Control
            value={data.phone}
            onChange={(e) => {
              setData({ ...data, phone: e.target.value });
              onUpdateField("phone", e.target.value);
            }}
            type="tel"
            placeholder="Without spaces"
          />
        </Form.Group>
        <Form.Group className="ms-1 flex-grow-1">
          <Form.Label> Address </Form.Label>
          <Form.Control
            value={data.address}
            onChange={(e) => {
              setData({ ...data, address: e.target.value });
              onUpdateField("address", e.target.value);
            }}
            type="text"
            placeholder="Like 'Sofia, Bulgaria'"
          />
        </Form.Group>
      </div>
    </Form>
  );
}
