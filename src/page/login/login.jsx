import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { auth, signInWithEmailAndPassword } from "../../firebase";

import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

export function Login() {
  const navigate = useNavigate();

  function handleLogin(formData) {
    const email = formData.get("email");
    const password = formData.get("password");
    signInWithEmailAndPassword(auth, email, password)
      .then((_) => {
        navigate("/dashboard");
      })
      .catch((error) => {
        // TODO: Use the other library.
        window.alert(error.message);
      });
  }

  const [isLoading, setIsLoading] = useState(true);
  auth.onAuthStateChanged((user) => {
    if (user) {
      navigate("/dashboard");
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

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="row justify-content-center ">
        <div>
          <div className="card shadow p-3" style={{ width: "370px" }}>
            <div className="card-body">
              <div className="text-center mb-4">
                <img
                  src="src/img/icon-login.png"
                  alt="login"
                  className="img-fluid rounded-circle w-25 mt-3 mb-3"
                />
              </div>
              <form action={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-person me-2"></i>Correo electrónico
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    required
                    placeholder="Ingresa tu correo electrónico"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-lock me-2"></i>Contraseña
                  </label>
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    required
                    placeholder="Ingresa tu contraseña"
                  />
                </div>
                <div className="mb-3 mt-3 text-center">
                  <a href="/reset" className="small text-decoration-none">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-2">
                  Iniciar sesión
                </button>
                <div className="text-center mt-2 mb-2">
                  <span>¿No tienes una cuenta? </span>
                  <a href="/register">Regístrate</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
