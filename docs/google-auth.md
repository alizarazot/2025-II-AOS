# Autenticación con Google

El sistema permite crear cuenta e iniciar sesión con Google sin necesidar de introducir contraseñas.

## Configuración

Se requiere crear un objeto `GoogleAuthProvider`, el cual se le envía como argumento a `signInWithPopup` para que el usuario valide su identidad. Una vez hecho esto, el objeto `auth` está con la información necesaria del usuario.

## Problemas encontrados.

La política de seguridad impide el enlace de cuentas no verificadas, lo que provoca que los demás métodos de inicio de sesión funcionen cuando Google está activo. Para más información consultar [esto](https://stackoverflow.com/questions/40766312/firebase-overwrites-signin-with-google-account).

<small>_Se está trabajando en una solución, pero aun no está lista..._</small>
