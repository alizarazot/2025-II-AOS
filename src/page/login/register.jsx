import { useState } from "react";

export function Register() {
  // Hook para guardar el sexo seleccionado
  const [sexo, setSexo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // aquí puedes manejar todos los datos del formulario
    console.log("Sexo seleccionado:", sexo);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center pt-5 pb-5">
      <div className="row justify-content-center">
        <div>
          <div className="card shadow p-3" style={{ width: "370px" }}>
            <div className="card-body">
              <h4 className="text-center mb-4">Registro</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    required
                    placeholder="Ingresa tu nombre completo"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido completo</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastname"
                    required
                    placeholder="Ingresa tu apellido completo"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    required
                    placeholder="Ingresa tu correo electrónico"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    required
                    placeholder="Crea una contraseña"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirmar contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    required
                    placeholder="Repite la contraseña"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nacionalidad</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nationality"
                    required
                    placeholder="Ingresa tu nacionalidad"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Sexo</label>
                  <select
                    className="form-select"
                    id="sex"
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                    required
                  >
                    <option value="">Selecciona tu sexo</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Negativo">Negativo</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-2">
                  Registrarse
                </button>
                <div className="text-center mt-2 mb-2">
                  <span>¿Ya tienes una cuenta? </span>
                  <a href="/">Inicia sesión</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
