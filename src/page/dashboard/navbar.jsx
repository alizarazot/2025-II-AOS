import { Navbar, Nav, Container } from "react-bootstrap";
import {
  FaBars,
  FaEnvelope,
  FaBell,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

export const CustomNavbar = ({ toggleSidebar }) => {
  return (
    <Navbar bg="primary" variant="dark" className="px-3 py-3  fw-bold">
      <Navbar.Brand href="#" className="d-flex align-items-center ">
        <FaBars
          className="me-2"
          style={{ cursor: "pointer" }}
          onClick={toggleSidebar}
        />
        <div className="ms-3">DASHBOARD</div>
      </Navbar.Brand>

      <Container fluid className="justify-content-end">
        <Nav className="align-items-center">
          <Nav.Link href="#">Overview</Nav.Link>
          <Nav.Link href="#">Documentation</Nav.Link>
          <Nav.Link href="#">
            <FaEnvelope />
          </Nav.Link>
          <Nav.Link href="#">
            <FaBell />
          </Nav.Link>
          <Nav.Link href="#">
            <FaUser />
          </Nav.Link>
          <Nav.Link href="/">
            <FaSignOutAlt />
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};
