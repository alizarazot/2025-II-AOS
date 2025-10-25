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
  facebookProvider,
  linkWithCredential,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  db,
} from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

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

  function handleGoogleLogin() {}

  function handleGithubLogin() {
    signInWithPopup(auth, githubProvider)
      .then((result) => {
        // Usuario autenticado con éxito
        navigate("/dashboard");
      })
      .catch((error) => {
        // Ignorar si el usuario cerró el popup
        if (error.code === "auth/popup-closed-by-user") {
          return;
        }

        // Manejar el caso de cuenta existente con diferente credencial
        if (error.code === "auth/account-exists-with-different-credential") {
          const email = error.customData.email;
          const credential = error.credential;

          // Guardar información para vincular después
          setLinkAccountData({
            email: email,
            credential: credential,
          });
        } else {
          setErrorMessage(error.message);
        }
      });
  }

  async function handleFacebookLogin() {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const email = result.user.email?.toLowerCase();
      const userId = result.user.uid;

      if (!email) {
        navigate("/dashboard");
        return;
      }

      // Buscar en Firestore si existe un usuario con este correo
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("correo", "==", email));
      const querySnapshot = await getDocs(q);

      // Si encontramos un documento con este correo
      if (!querySnapshot.empty) {
        const existingUserDoc = querySnapshot.docs[0];
        const userData = existingUserDoc.data();

        // Verificar si el método es password
        if (userData.metodo === "password") {
          // Conflicto detectado: usuario registrado con password intentando entrar con Facebook
          // Obtener el token ANTES de cerrar sesión
          const idToken = await result.user.getIdToken();

          // Cerrar sesión inmediatamente
          await auth.signOut();

          // Crear credencial de Facebook manualmente
          const credential = FacebookAuthProvider.credential(idToken);

          setLinkAccountData({
            email,
            credential,
            providerId: "facebook.com",
            existingMethods: ["password"],
            primaryMethod: "password",
            needsLinking: true,
          });

          setErrorMessage(
            "Ya tienes una cuenta con este correo usando contraseña. Ingresa tu contraseña para vincular Facebook a tu cuenta.",
          );
          return;
        }
      } else {
        // Usuario nuevo con Facebook, crear documento en Firestore
        await setDoc(doc(db, "users", userId), {
          uid: userId,
          nombres: result.user.displayName?.split(" ")[0] || "",
          apellidos:
            result.user.displayName?.split(" ").slice(1).join(" ") || "",
          correo: email,
          nationality: "",
          sexo: "",
          estado: "pendiente",
          rol: "visitante",
          creado: new Date(),
          metodo: "facebook",
        });
      }

      // Si llegamos aquí, no hay conflicto o ya está vinculado
      navigate("/dashboard");
    } catch (error) {
      // Ignorar si el usuario cerró el popup
      if (error.code === "auth/popup-closed-by-user") {
        return;
      }

      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData?.email;
        const credential = FacebookAuthProvider.credentialFromError(error);

        if (!email || !credential) {
          setErrorMessage(
            "No se pudo vincular la cuenta de Facebook. Intenta iniciar sesión con tu correo y contraseña.",
          );
          return;
        }

        const normalizedEmail = email.toLowerCase();

        try {
          const methods = await fetchSignInMethodsForEmail(
            auth,
            normalizedEmail,
          );
          const primaryMethod = methods?.[0] ?? "password";

          setLinkAccountData({
            email: normalizedEmail,
            credential,
            providerId: credential.providerId || "facebook.com",
            existingMethods: methods,
            primaryMethod,
          });
        } catch (methodError) {
          setErrorMessage(
            "No pudimos comprobar los métodos de acceso. Intenta iniciar sesión con tu contraseña.",
          );
        }
      } else {
        setErrorMessage(error.message);
      }
    }
  }

  async function handleLinkAccounts(password) {
    if (!linkAccountData) return;

    try {
      // Iniciar sesión con email/password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        linkAccountData.email,
        password,
      );

      // Vincular con el proveedor pendiente (GitHub/Facebook/Google, etc.)
      if (!linkAccountData.credential) {
        throw new Error(
          "No se pudo obtener la credencial para vincular la cuenta.",
        );
      }

      await linkWithCredential(userCredential.user, linkAccountData.credential);

      // Actualizar Firestore para registrar que ahora tiene múltiples métodos
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("correo", "==", linkAccountData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDocRef = doc(db, "users", querySnapshot.docs[0].id);
        const currentData = querySnapshot.docs[0].data();
        const currentMetodo = currentData.metodo;

        // Actualizar a lista de métodos si es necesario
        let newMetodo = currentMetodo;
        if (typeof currentMetodo === "string") {
          newMetodo = [currentMetodo, linkAccountData.providerId];
        } else if (Array.isArray(currentMetodo)) {
          if (!currentMetodo.includes(linkAccountData.providerId)) {
            newMetodo = [...currentMetodo, linkAccountData.providerId];
          }
        }

        await setDoc(userDocRef, { metodo: newMetodo }, { merge: true });
      }

      // Vinculación exitosa
      setLinkAccountData(null);
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.message);
      setLinkAccountData(null);
    }
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
                    onClick={handleGoogleLogin}
                    className="btn mb-2 w-100 text-white"
                    style={{ backgroundColor: "#de5246" }}
                  >
                    Iniciar sesión con Google
                  </button>

                  <button
                    type="button"
                    onClick={handleGithubLogin}
                    className="btn btn-dark w-100 mb-2"
                  >
                    <i className="bi bi-github me-2"></i>
                    Iniciar sesión con GitHub
                  </button>

                  <button
                    type="button"
                    onClick={handleFacebookLogin}
                    className="btn w-100 mb-2"
                    style={{
                      backgroundColor: "#1877F2",
                      color: "white",
                      border: "none",
                    }}
                  >
                    <i className="bi bi-facebook me-2"></i>
                    Iniciar sesión con Facebook
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
