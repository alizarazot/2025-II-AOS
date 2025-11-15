import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import {
  FaBars,
  FaEnvelope,
  FaBell,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import { auth } from "../firebase";
import { auditoriaService } from "../services/auditoria-service";

export const CustomNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await auditoriaService.registrarSalida();
    await auth.signOut();
    navigate("/");
  };

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
          <div className="d-sm-flex d-none">
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
          </div>
          <Nav.Link onClick={handleSignOut}>
            <FaSignOutAlt />
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};
