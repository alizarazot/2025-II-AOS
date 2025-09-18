import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div class="container">
        <img
          class="image-login"
          src="https://i.pinimg.com/1200x/ba/8d/7a/ba8d7a6364bf8ce99756686cba83c695.jpg"
          alt=""
        />
        <div class="espacio"></div>
        <label for="Correo electronico"> Correo electronico</label>
        <input type="text" class="input-form" />
        <label for="Contraseña">Contraseña</label>
        <input type="password" class="input-form" />
        <div>
          <a href="reset.html">¿Olvidaste tu contraseña?</a>
        </div>
        <button class="btn-login">Iniciar sesion</button>
        <div class="link-register">
          ¿No tientes una cuenta? <a href="register.html">Registrate</a>
        </div>
      </div>
    </>
  );
}

export default App;
