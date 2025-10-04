# 2025-II-AOS

## 🧾 Descripción

Este proyecto implementa una aplicación con arquitectura orientada a servicios (AOS), usando React, Firebase y otras herramientas modernas. La idea es separar lógica, componentes y servicios para tener un sistema más escalable, mantenible y modular.

---

## 🧰 Tecnologías usadas

- JavaScript / React
- Firebase
- react-firebase-hooks
- Bootstrap
- SweetAlert2
- Vite

---

## 🏗️ Estructura del proyecto

```
src
├── app.jsx # Contiene las rutas.
├── assets # Imágenes estáticas.
├── component # Componentes reutilizables.
│   ├── client-management/
│   ├── products-management/
│   └── providers-management/
│   ├── menu.jsx
│   ├── navbar.jsx
│   ├── overview.jsx
│   ├── protected-route.jsx
├── firebase.js # Configuración de Firebase.
├── main.jsx # Contiene punto de entrada principal.
└── page
    ├── dashboard/
    └── login/
        ├── login.jsx
        ├── register.jsx
        └── reset.jsx
```

## Dependencias o paquetes

npm install firebase
npm install react-firebase-hooks
npm install bootstrap
npm list react-router-dom
npm install sweetalert2
