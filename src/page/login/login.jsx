import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import {
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  githubProvider,
  linkWithCredential,

} from "../../firebase";

export function Login() {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);
  const [linkAccountData, setLinkAccountData] = useState(null);
  
  function handleLogin(formData) {
    const email = formData.get("email");
    const password = formData.get("password");
    signInWithEmailAndPassword(auth, email, password)
      .then((_) => {
        navigate("/dashboard");
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }

  function handleGithubLogin() {
    signInWithPopup(auth, githubProvider)
      .then((result) => {
        // Usuario autenticado con éxito
        navigate("/dashboard");
      })
      .catch((error) => {
        // Manejar el caso de cuenta existente con diferente credencial
        if (error.code === "auth/account-exists-with-different-credential") {
          const email = error.customData.email;
          const credential = error.credential;
          
          // Guardar información para vincular después
          setLinkAccountData({
            email: email,
            credential: credential
          });
        } else {
          setErrorMessage(error.message);
        }
      });
  }

  function handleLinkAccounts(password) {
    if (!linkAccountData) return;
    
    // Iniciar sesión con email/password
    signInWithEmailAndPassword(auth, linkAccountData.email, password)
      .then((userCredential) => {
        // Vincular con GitHub
        return linkWithCredential(userCredential.user, linkAccountData.credential);
      })
      .then(() => {
        // Vinculación exitosa
        setLinkAccountData(null);
        navigate("/dashboard");
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setLinkAccountData(null);
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
    <>
      <div className="container d-flex align-items-center justify-content-center vh-100">
        <div className="row justify-content-center ">
          <div>
            <div className="card shadow p-3" style={{ width: "370px" }}>
              <div className="card-body">
                <div className="text-center mb-4">
                  <img
                    src="src/assets/icon-login.png"
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
                  
                  <div className="text-center my-3">
                    <span className="text-muted">o</span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleGithubLogin}
                    className="btn btn-dark w-100 mb-2"
                  >
                    <i className="bi bi-github me-2"></i>
                    Iniciar sesión con GitHub
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
      <ModalError
        message={errorMessage}
        clear={(_) => {
          setErrorMessage(null);
        }}
      ></ModalError>
      <ModalLinkAccount
        data={linkAccountData}
        onLink={handleLinkAccounts}
        onCancel={() => setLinkAccountData(null)}
      ></ModalLinkAccount>
      ;
    </>
  );
}

function ModalError({ message, clear }) {
  const [show, setShow] = useState(true);
  useEffect((_) => {
    setShow(message != null);
  });

  return (
    <>
      <Modal
        show={show}
        onHide={(_) => {
          setShow(false);
          clear();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={(_) => {
              setShow(false);
              clear();
            }}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function ModalLinkAccount({ data, onLink, onCancel }) {
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    setShow(data != null);
    setPassword("");
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLink(password);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
          onCancel();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Vincular cuentas</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <p>
              Ya existe una cuenta con el correo <strong>{data?.email}</strong>.
            </p>
            <p>
              Para vincular tu cuenta de GitHub con tu cuenta existente, ingresa
              tu contraseña:
            </p>
            <div className="mb-3">
              <label className="form-label">
                <i className="bi bi-lock me-2"></i>Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                required
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShow(false);
                onCancel();
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Vincular cuentas
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
