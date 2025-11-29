import { useState, useEffect } from "react";
import { Container, Card, Button, Form, Modal } from "react-bootstrap";
import { auth, db, EmailAuthProvider } from "../firebase";
import {
  linkWithCredential,
  fetchSignInMethodsForEmail,
  reauthenticateWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export function AccountSettings() {
  const [user, setUser] = useState(null);
  const [authMethods, setAuthMethods] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      loadAuthMethods(currentUser.email);
    }
  }, []);

  const loadAuthMethods = async (email) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      setAuthMethods(methods);
    } catch (error) {
      console.error("Error al cargar métodos:", error);
    }
  };

  const handleAddPassword = async () => {
    if (password.length < 6) {
      return Swal.fire(
        "Error",
        "La contraseña debe tener al menos 6 caracteres",
        "error",
      );
    }

    if (password !== confirmPassword) {
      return Swal.fire("Error", "Las contraseñas no coinciden", "error");
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await linkWithCredential(user, credential);

      // Actualizar Firestore
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("correo", "==", user.email.toLowerCase()),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        let newMetodo = userData.metodo;

        if (typeof newMetodo === "string") {
          newMetodo = [newMetodo, "password"];
        } else if (Array.isArray(newMetodo)) {
          if (!newMetodo.includes("password")) {
            newMetodo = [...newMetodo, "password"];
          }
        }

        await updateDoc(userDoc.ref, { metodo: newMetodo });
      }

      setShowPasswordModal(false);
      setPassword("");
      setConfirmPassword("");
      await loadAuthMethods(user.email);

      Swal.fire(
        "¡Éxito!",
        "Contraseña agregada correctamente. Ahora puedes iniciar sesión con correo y contraseña.",
        "success",
      );
    } catch (error) {
      console.error("Error al vincular contraseña:", error);
      if (error.code === "auth/provider-already-linked") {
        Swal.fire("Error", "Ya tienes una contraseña configurada", "error");
      } else {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const getMethodName = (method) => {
    const methodMap = {
      password: "Correo y contraseña",
      "google.com": "Google",
      "github.com": "GitHub",
      "facebook.com": "Facebook",
    };
    return methodMap[method] || method;
  };

  const hasPassword = authMethods.includes("password");

  return (
    <Container className="py-4">
      <h2 className="mb-4">Configuración de cuenta</h2>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Información de la cuenta</Card.Title>
          {user && (
            <div>
              <p>
                <strong>Correo:</strong> {user.email}
              </p>
              <p>
                <strong>UID:</strong> {user.uid}
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Métodos de inicio de sesión</Card.Title>
          <p className="text-muted">Métodos vinculados a tu cuenta:</p>

          <ul className="list-group mb-3">
            {authMethods.length === 0 ? (
              <li className="list-group-item">Cargando...</li>
            ) : (
              authMethods.map((method) => (
                <li
                  key={method}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {getMethodName(method)}
                  <span className="badge bg-success">Activo</span>
                </li>
              ))
            )}
          </ul>

          {!hasPassword && (
            <Button
              variant="primary"
              onClick={() => setShowPasswordModal(true)}
            >
              Agregar contraseña
            </Button>
          )}
        </Card.Body>
      </Card>

      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nueva contraseña</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
              <Form.Text className="text-muted">Mínimo 6 caracteres</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar contraseña</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPasswordModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddPassword}>
            Agregar contraseña
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
