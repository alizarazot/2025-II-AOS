import "./style.css";

export function Login() {
  return (
    <>
      <div className="login-container">
        <img
          className="image-login"
          src="https://i.pinimg.com/1200x/ba/8d/7a/ba8d7a6364bf8ce99756686cba83c695.jpg"
          alt=""
        />
        <div className="espacio"></div>
        <label htmlFor="Correo electronico"> Correo electronico</label>
        <input type="text" className="input-form" />
        <label htmlFor="Contraseña">Contraseña</label>
        <input type="password" className="input-form" />
        <div>
          <a href="/reset.html">¿Olvidaste tu contraseña?</a>
        </div>
        <button className="btn-login">Iniciar sesion</button>
        <div className="link-register">
          ¿No tientes una cuenta? <a href="/register.html">Registrate</a>
        </div>
      </div>
    </>
  );
}
