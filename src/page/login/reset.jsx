import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export function Reset() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
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
                  />
                </div>
                <div className="mb-3 text-center text-muted small">
                  Te enviaremos un enlace para restablecer tu contraseña
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-3">
                  Enviar enlace de recuperación
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
  );
}
