# 2025-II-AOS

## 🧾 Descripción

El uso de inicio de sesión con FaceBook es una herramienta útil y accesible para todos los usuarios, esto se debe a que el 37% de la población hace uso de estas credenciales, por ende se hace necesaria su integración en los aplicativos web actuales, para su implementación es requerido el uso de develop.facebook.com el cual muestra herramientras para agregar exitosamente a la app, como la modificación de la URI, personas que puedan acceder (en fase temprana, cuando la app web no ha sido publicada solo pueden acceder: administradores, tester, desarrolles y usuario de analytics) y diversos casos de uso. 

---

## 🧰 Tecnologías usadas

- JavaScript / React
- Firebase
- react-firebase-hooks
- Facebook
- Firebase/auth
- Bootstrap
- SweetAlert2
- Vite

---

## Dependencias o paquetes necesarios para su uso

npm install firebase
npm install react-firebase-hooks
npm install bootstrap
npm list react-router-dom
npm install sweetalert2

# Configuración de Facebook Login

## 1. Crear la App en Facebook Developers
1. Entra a **https://developers.facebook.com/**
2. Ve a **Mis Apps** > **Crear App**
3. Selecciona **Consumer** (o la categoría que necesites)
4. Ingresa el **nombre de tu aplicación**
5. Agrega el producto **Facebook Login**
6. Completa los datos básicos:
   - **App Domains:** dominio donde correrá tu app  
     URL: `http://localhost:5173`
   - **Privacy Policy URL:** una URL válida (puede ser temporal)
7. En **Facebook Login > Configuración**, agrega:
   - **URI de redirección:**  
     ```
     https://tu-proyecto.firebaseapp.com/__/auth/handler
     ```
8. Guarda tu **App ID** y **App Secret**

---

## 2. Configurar Firebase
1. Entra a la **Consola de Firebase**:  
   https://console.firebase.google.com
2. Selecciona tu proyecto
3. Ve a **Authentication > Sign-in method**
4. Habilita **Facebook** como proveedor
5. Ingresa:
   - **App ID**  
   - **App Secret**
6. Copia la **URL de redirección** que Firebase muestre
7. Regresa a Facebook Developers y actualiza la **Redirect URI** si es necesario

---
