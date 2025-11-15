# 2025-II-AOS - Inicio de Sesión con GitHub

## 🧾 Descripción

El uso de inicio de sesión con GitHub es una herramienta útil y accesible para desarrolladores y usuarios técnicos. GitHub es una de las plataformas más utilizadas en el desarrollo de software, con millones de usuarios activos. Su integración en aplicativos web facilita el acceso rápido y seguro sin necesidad de crear credenciales adicionales.

---

## 🧰 Tecnologías usadas

- JavaScript / React
- Firebase
- react-firebase-hooks
- GitHub OAuth Apps
- Firebase/auth
- Bootstrap
- SweetAlert2
- Vite
- Firestore

---

## 📋 Dependencias o paquetes necesarios para su uso

npm install firebase
npm install react-firebase-hooks
npm install bootstrap
npm install react-router-dom
npm install sweetalert2

---

## 🔧 Configuración de GitHub OAuth

### 1. Crear OAuth App en GitHub

1. Ingresar a https://github.com/settings/developers
2. Click en New OAuth App
3. Completar los campos:
   - **Application name**: Nombre de tu aplicación
   - **Homepage URL**: URL de la aplicación: http://localhost:5173
   - **Authorization callback URL**: URL de Firebase Auth: https://tu-proyecto.firebaseapp.com/__/auth/handler
4. Guardar el Client ID y genera un Client Secret

### 2. Configurar Firebase

1. Ve a la consola de Firebase (https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Ir a **Authentication** > **Sign-in method**
4. Habilita **GitHub** como proveedor
5. Ingresa el **Client ID** y **Client Secret** de GitHub
6. Copia la **URL de redireccionamiento** que Firebase te proporciona
7. Actualiza el **Authorization callback URL** en tu GitHub OAuth App con esta URL

---

## 🔄 Flujo de autenticación

1. Usuario hace click en "Continuar con GitHub"
2. Se abre popup de GitHub solicitando autorización
3. Usuario autoriza la aplicación
4. GitHub redirige con código de autorización
5. Firebase intercambia código por token de acceso
6. Se verifica si el correo ya existe en Firestore
7. Si existe cuenta con password, solicita vinculación
8. Si existe cuenta con otro social login, vincula automáticamente
9. Si es nuevo usuario, crea documento en Firestore
10. Redirige al dashboard

---
