export function Forget() {
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
                Nueva Contraseña
              </h4>
              <form>
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
                  />
                </div>
                <div className="mb-3 text-center text-muted small">
                  <i className="bi bi-info-circle me-2"></i>
                  La contraseña debe tener al menos 6 caracteres
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-3">
                  Restablecer Contraseña
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
  );
}
