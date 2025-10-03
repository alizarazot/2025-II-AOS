import Form from "react-bootstrap/Form";

export function ClientManagementForm({ onUpdateField }) {
  return (
    <Form>
      <div className="d-flex">
        <div>
          <Form.Group>
            <Form.Label> Name </Form.Label>
            <Form.Control
              onChange={(e) => {
                onUpdateField("name", e.target.value);
              }}
              type="text"
              placeholder="John Doe"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label> Document </Form.Label>
            <Form.Control
              onChange={(e) => {
                onUpdateField("document", e.target.value);
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
            onChange={(e) => {
              onUpdateField("phone", e.target.value);
            }}
            type="tel"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label> Address </Form.Label>
          <Form.Control
            onChange={(e) => {
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
