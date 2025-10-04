import { useState } from "react";

import Form from "react-bootstrap/Form";

export function ClientManagementForm({ templateData, onUpdateField }) {
  const [data, setData] = useState(templateData);

  return (
    <Form>
      <div className="d-flex">
        <div>
          <Form.Group>
            <Form.Label> Name </Form.Label>
            <Form.Control
              value={data.name}
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
                onUpdateField("name", e.target.value);
              }}
              type="text"
              placeholder="John Doe"
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
              placeholder="345324235"
            />
          </Form.Group>
        </div>
        <h1>nr</h1>
      </div>

      <div className="d-flex">
        <Form.Group>
          <Form.Label> Phone number </Form.Label>
          <Form.Control
            value={data.phone}
            onChange={(e) => {
              setData({ ...data, phone: e.target.value });
              onUpdateField("phone", e.target.value);
            }}
            type="tel"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label> Address </Form.Label>
          <Form.Control
            value={data.address}
            onChange={(e) => {
              setData({ ...data, address: e.target.value });
              onUpdateField("address", e.target.value);
            }}
            type="text"
            placeholder="Sofia, Bulgaria"
          />
        </Form.Group>
      </div>
    </Form>
  );
}
