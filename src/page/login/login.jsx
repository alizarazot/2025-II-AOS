export function Login() {
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
              <form>
                <div className="mb-3">
                    <label className="form-label"><i className="bi bi-person me-2"></i>Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    required
                    placeholder="Ingresa tu correo electrónico"
                  />
                </div>
                <div className="mb-3">
                    <label className="form-label"><i className="bi bi-lock me-2"></i>Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    required
                    placeholder="Ingresa tu contraseña"
                  />
                </div>
                <div className="mb-3 mt-3 text-center">
                  <a href="/reset.html" className="small text-decoration-none">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-2">
                  Iniciar sesión
                </button>
                <div className="text-center mt-2 mb-2">
                  <span>¿No tienes una cuenta? </span>
                  <a href="/register.html">Regístrate</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
