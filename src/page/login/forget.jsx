import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import {
  auth,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "../../firebase";

export function Forget() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isValidating, setIsValidating] = useState(true);
  const [oobCode, setOobCode] = useState(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const code = searchParams.get("oobCode");

    if (!code) {
      setErrorMessage(
        "Enlace inválido o expirado. Por favor solicita un nuevo enlace de recuperación.",
      );
      setIsValidating(false);
      return;
    }

    // Verificar que el código sea válido solo una vez
    verifyPasswordResetCode(auth, code)
      .then((userEmail) => {
        setOobCode(code);
        setEmail(userEmail);
        setIsValidating(false);
      })
      .catch((error) => {
        setErrorMessage(
          "El enlace ha expirado o es inválido. Por favor solicita un nuevo enlace de recuperación.",
        );
        setIsValidating(false);
      });
  }, []); // Array vacío para ejecutar solo una vez al montar

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que las contraseñas no estén vacías
    if (!password || !confirmPassword) {
      setErrorMessage("Por favor completa ambos campos de contraseña.");
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setErrorMessage(
        "Las contraseñas no coinciden. Por favor verifica e intenta nuevamente.",
      );
      return;
    }

    // Validar longitud mínima
    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    // Restablecer la contraseña
    confirmPasswordReset(auth, oobCode, password)
      .then(() => {
        setIsLoading(false);
        setSuccessMessage(
          "¡Contraseña actualizada exitosamente! Serás redirigido al inicio de sesión.",
        );
        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage(
          "Error al restablecer la contraseña. Por favor intenta nuevamente.",
        );
      });
  };

  if (isValidating) {
    return (
      <div className="container d-flex align-items-center justify-content-center vh-100">
        <div className="text-center">
          <Spinner animation="border" role="status" className="text-primary">
            <span className="visually-hidden">Verificando...</span>
          </Spinner>
          <p className="mt-3 text-muted">Verificando enlace...</p>
        </div>
      </div>
    );
  }

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
                  Nueva Contraseña
                </h4>
                {email && (
                  <div className="text-center mb-3 text-muted small">
                    <i className="bi bi-envelope me-2"></i>
                    {email}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-lock me-2"></i>
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      required
                      placeholder="Ingresa tu nueva contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={!oobCode || isLoading}
                      minLength={6}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-lock-fill me-2"></i>
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      required
                      placeholder="Repite tu nueva contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={!oobCode || isLoading}
                      minLength={6}
                    />
                  </div>
                  <div className="mb-3 text-center text-muted small">
                    <i className="bi bi-info-circle me-2"></i>
                    La contraseña debe tener al menos 6 caracteres
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3"
                    disabled={!oobCode || isLoading}
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
                        Restableciendo...
                      </>
                    ) : (
                      "Restablecer Contraseña"
                    )}
                  </button>
                  <div className="text-center">
                    <a href="/" className="text-decoration-none">
                      Volver al inicio de sesión
                    </a>
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
