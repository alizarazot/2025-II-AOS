import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";

export function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    confirmPassword: "",
    nationality: "",
    sexo: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [sexo, setSexo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      nombres,
      apellidos,
      email,
      password,
      confirmPassword,
      nationality,
      sexo,
    } = formData;

    //validaciones
    if (
      !nombres ||
      !apellidos ||
      !email ||
      !password ||
      !confirmPassword ||
      !nationality ||
      !sexo
    ) {
      return Swal.fire("Todos los campos son obligatorios");
    }
    if (password.length < 6) {
      return Swal.fire("La contraseña debe tener al menos 6 caracteres");
    }
    if (password !== confirmPassword) {
      return Swal.fire("Las contraseñas no son iguales");
    }
    try {
      const emaillower = email.toLowerCase();
      //crea usuario para el servicio de autenticacion de firebase
      const userMethod = await createUserWithEmailAndPassword(
        auth,
        emaillower,
        password,
      );
      const user = userMethod.user;

      //guardar datos en firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nombres,
        apellidos,
        correo: emaillower,
        nationality,
        sexo,
        estado: "pendiente",
        rol: "visitante",
        creado: new Date(),
        metodo: "password",
      });

      Swal.fire("Registrado", "usuario creado correctamente", "success");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        Swal.fire("El correo ya está en uso", "", "error");
      }
    }
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
                    name="nombres"
                    type="text"
                    className="form-control"
                    id="name"
                    required
                    placeholder="Ingresa tu nombre completo"
                    value={formData.nombres}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido completo</label>
                  <input
                    name="apellidos"
                    type="text"
                    className="form-control"
                    id="lastname"
                    required
                    placeholder="Ingresa tu apellido completo"
                    value={formData.apellidos}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    id="email"
                    required
                    placeholder="Ingresa tu correo electrónico"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <div className="input-group">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      required
                      placeholder="Crea una contraseña"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirmar contraseña</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    required
                    placeholder="Repite la contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nacionalidad</label>
                  <input
                    name="nationality"
                    type="text"
                    className="form-control"
                    id="nationality"
                    required
                    placeholder="Ingresa tu nacionalidad"
                    value={formData.nationality}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Sexo</label>
                  <select
                    name="sexo"
                    className="form-select"
                    id="sex"
                    value={formData.sexo}
                    onChange={(e) => {
                      setSexo(e.target.value);
                      handleChange(e);
                    }}
                    required
                  >
                    <option value="">Selecciona tu sexo</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
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
