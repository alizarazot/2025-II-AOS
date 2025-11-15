import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

import { auth } from "../firebase";
import { auditoriaService } from "../services/auditoria-service";

export function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login", { replace: true });
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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
