import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { auth, sendPasswordResetEmail } from "../../firebase";

export function Reset() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const actionCodeSettings = {
      url: window.location.origin + "/forget",
      handleCodeInApp: true,
    };

    console.log("Enviando email a:", email);
    console.log("URL de redirección:", actionCodeSettings.url);

    sendPasswordResetEmail(auth, email, actionCodeSettings)
      .then(() => {
        console.log("Email enviado exitosamente");
        setSuccessMessage(
          "¡Correo enviado! Revisa tu bandeja de entrada y carpeta de spam para el enlace de recuperación.",
        );
        setEmail("");
        setIsLoading(false);
        setTimeout(() => {
          navigate("/");
        }, 4000);
      })
      .catch((error) => {
        console.error("Error al enviar email:", error);
        console.error("Código de error:", error.code);
        console.error("Mensaje:", error.message);
        setIsLoading(false);
        if (error.code === "auth/user-not-found") {
          setErrorMessage("No existe una cuenta con este correo electrónico.");
        } else if (error.code === "auth/invalid-email") {
          setErrorMessage("El correo electrónico no es válido.");
        } else if (error.code === "auth/missing-email") {
          setErrorMessage("Por favor ingresa un correo electrónico.");
        } else {
          setErrorMessage(`Error: ${error.message}. Código: ${error.code}`);
        }
      });
  };

  return (
    <>
      <div className="container d-flex align-items-center justify-content-center vh-100">
        <div className="row justify-content-center">
          <div>
            <div className="card shadow p-3" style={{ width: "370px" }}>
              <div className="card-body">
                <div className="text-center mb-4">
                  <img
                    src="src/assets/icon-login.png"
                    alt="reset password"
                    className="img-fluid rounded-circle w-25 mt-3 mb-3"
                  />
                </div>
                <h4 className="text-center mb-4 text-primary">
                  Recuperar Contraseña
                </h4>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-envelope me-2"></i>
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      required
                      placeholder="Ingresa tu correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3 text-center text-muted small">
                    Te enviaremos un enlace para restablecer tu contraseña
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Enviando...
                      </>
                    ) : (
                      "Enviar enlace de recuperación"
                    )}
                  </button>
                  <div className="text-center">
                    <Link to="/" className="text-decoration-none">
                      Volver al inicio de sesión
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalError
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
      <ModalSuccess
        message={successMessage}
        onClose={() => setSuccessMessage(null)}
      />
    </>
  );
}

function ModalError({ message, onClose }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(message != null);
  }, [message]);

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
        onClose();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-exclamation-triangle-fill text-danger me-2"></i>
          Error
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShow(false);
            onClose();
          }}
        >
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function ModalSuccess({ message, onClose }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(message != null);
  }, [message]);

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
        onClose();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-check-circle-fill text-success me-2"></i>
          Éxito
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            setShow(false);
            onClose();
          }}
        >
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
