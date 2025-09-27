import Button from "react-bootstrap/Button";

export function Row({ data }) {
  return (
    <tr>
      <th scope="row">{data.id}</th>
      <td>
        <img
          src={data.picture}
          className="img-thumbnail mx-auto d-block"
          style={{ width: 64, height: 64, objectFit: "cover" }}
        ></img>
      </td>
      <td>{data.name}</td>
      <td>{data.uid}</td>
      <td>{data.phone}</td>
      <td>{data.address}</td>
      <td>
        <Button variant="secondary" className="me-2">
          Edit
        </Button>
        <Button variant="danger">Delete</Button>
      </td>
    </tr>
  );
}
