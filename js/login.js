// 1. SELECCIONAR LOS ELEMENTOS DEL FORMULARIO
const formulario = document.getElementById("login-form");
const correo = document.getElementById("email");
const contrasena = document.getElementById("password");
const botonMostrar = document.getElementById("toggle-pass");
const recordar = document.getElementById("remember");
const recuperar = document.getElementById("forgot-link");

const errorCorreo = document.getElementById("email-error");
const errorContrasena = document.getElementById("password-error");
const mensaje = document.getElementById("form-status");

// Conectar cada campo con su mensaje de error.
correo.setAttribute("aria-describedby", "email-error");
contrasena.setAttribute("aria-describedby", "password-error");


// 2. MOSTRAR U OCULTAR LA CONTRASEÑA
botonMostrar.addEventListener("click", function () {
  const mostrar = contrasena.type === "password";

  contrasena.type = mostrar ? "text" : "password";
  botonMostrar.textContent = mostrar ? "Ocultar" : "Mostrar";

  botonMostrar.setAttribute("aria-pressed", String(mostrar));
  botonMostrar.setAttribute(
    "aria-label",
    mostrar ? "Ocultar contraseña" : "Mostrar contraseña"
  );
});


// 3. RECUPERAR EL CORREO GUARDADO
// Solo se guarda el correo, nunca la contraseña.
try {
  const correoGuardado = localStorage.getItem("noxira-correo");

  if (correoGuardado) {
    correo.value = correoGuardado;
    recordar.checked = true;
  }
} catch (error) {
  // El formulario sigue funcionando si el navegador bloquea el almacenamiento.
}


// 4. BORRAR EL CORREO GUARDADO AL DESMARCAR LA CASILLA
recordar.addEventListener("change", function () {
  if (!recordar.checked) {
    try {
      localStorage.removeItem("noxira-correo");
    } catch (error) {
      mensaje.textContent = "No se pudo borrar el correo guardado.";
    }
  }
});


// 5. REVISAR LOS DATOS AL PRESIONAR INICIAR SESIÓN
formulario.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  correo.value = correo.value.trim();

  errorCorreo.textContent = "";
  errorContrasena.textContent = "";
  mensaje.textContent = "";

  correo.setAttribute("aria-invalid", "false");
  contrasena.setAttribute("aria-invalid", "false");

  let primerError = null;

  // Comprobar que el correo esté completo y tenga formato válido.
  if (correo.value === "") {
    errorCorreo.textContent = "Escribe tu correo electrónico.";
    primerError = correo;
  } else if (!correo.validity.valid) {
    errorCorreo.textContent = "Escribe un correo válido, como nombre@gmail.com.";
    primerError = correo;
  }

  if (errorCorreo.textContent !== "") {
    correo.setAttribute("aria-invalid", "true");
  }

  // Comprobar la longitud exigida por este formulario.
  if (contrasena.value.length < 8) {
    errorContrasena.textContent = "La contraseña debe tener al menos 8 caracteres.";
    contrasena.setAttribute("aria-invalid", "true");

    if (!primerError) {
      primerError = contrasena;
    }
  }

  // Llevar el cursor al primer campo que necesita corregirse.
  if (primerError) {
    primerError.focus();
    return;
  }

  // Guardar el correo únicamente si el usuario lo solicita.
  let aviso = "";

  try {
    if (recordar.checked) {
      localStorage.setItem("noxira-correo", correo.value);
    } else {
      localStorage.removeItem("noxira-correo");
    }
  } catch (error) {
    aviso = " No se pudo actualizar el correo guardado.";
  }

  mensaje.textContent =
   
if (!window.gcrDB) {
  mensaje.textContent = "No se pudo conectar con Supabase.";
  return;
}

const boton = document.getElementById("submit-btn");

boton.disabled = true;
boton.classList.add("loading");
mensaje.textContent = "Iniciando sesión...";

try {
  const { data, error } = await window.gcrDB.auth.signInWithPassword({
    email: correo.value,
    password: contrasena.value
  });

  if (error) throw error;

  if (data.session) {
    window.location.href = "panel.html";
  } else {
    mensaje.textContent = "No se pudo iniciar sesión.";
  }

} catch (error) {
  if (error.message === "Invalid login credentials") {
    mensaje.textContent = "Correo o contraseña incorrectos.";
  } else if (error.message === "Email not confirmed") {
    mensaje.textContent = "Primero confirma tu correo electrónico.";
  } else {
    mensaje.textContent = "Error: " + error.message;
  }
} finally {
  boton.disabled = false;
  boton.classList.remove("loading");
}

});


// 6. QUITAR LOS ERRORES CUANDO EL USUARIO EDITA
correo.addEventListener("input", function () {
  errorCorreo.textContent = "";
  correo.setAttribute("aria-invalid", "false");
  mensaje.textContent = "";
});

contrasena.addEventListener("input", function () {
  errorContrasena.textContent = "";
  contrasena.setAttribute("aria-invalid", "false");
  mensaje.textContent = "";
});


// 7. INFORMAR SOBRE LA RECUPERACIÓN DE CONTRASEÑA
recuperar.addEventListener("click", function (evento) {
  evento.preventDefault();

  mensaje.textContent =
    "La recuperación de contraseña aún no está disponible en esta demostración.";
});
