import { useState } from "react";
import { useNavigate } from "react-router";

import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

import { auth } from "../firebase";

export function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  auth.onAuthStateChanged((user) => {
    if (!user) {
      navigate("/login");
    } else {
      setIsLoading(false);
    }
  });

  if (isLoading) {
    return (
      <Container
        fluid
        className="d-grid justify-content-center align-items-center vh-100"
      >
        <Spinner />
      </Container>
    );
  }

  return children;
}
