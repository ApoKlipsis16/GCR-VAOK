"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contacto-form");

  if (!form) return;

  const nombre = document.getElementById("nombre");
  const email = document.getElementById("email");
  const telefono = document.getElementById("telefono");
  const interes = document.getElementById("interes");
  const mensaje = document.getElementById("mensaje");
  const privacidad = document.getElementById("privacidad");

  const contador = document.getElementById("mensaje-count");
  const estado = document.getElementById("form-status");

  const campos = [
    nombre,
    email,
    telefono,
    interes,
    mensaje,
    privacidad
  ].filter(Boolean);

  const camposRevisados = new Set();
  let intentoEnviar = false;

  // Usamos mensajes propios en lugar de los avisos del navegador.
  // Las restricciones del HTML siguen disponibles mediante validity.
  form.noValidate = true;

  /* =========================================
     MENSAJES DE ERROR
     ========================================= */

  function mostrarError(campo, texto) {
    const contenedor = document.getElementById(
      `${campo.id}-error`
    );

    if (contenedor) {
      contenedor.textContent = texto;
    }

    if (texto) {
      campo.setAttribute("aria-invalid", "true");
    } else {
      campo.removeAttribute("aria-invalid");
    }

    return texto === "";
  }

  function limpiarEstado() {
    if (!estado) return;

    estado.textContent = "";
    estado.classList.remove("error", "success");
  }

  /* =========================================
     VALIDACIONES
     ========================================= */

  function validarCampo(campo) {
    const valor = campo.value.trim();
    let error = "";

    switch (campo.id) {
      case "nombre":
        if (!valor) {
          error = "Escribe tu nombre completo.";
        }
        break;

      case "email":
        if (!valor) {
          error = "Escribe tu correo de trabajo.";
        } else if (campo.validity.typeMismatch) {
          error = "Escribe un correo válido, por ejemplo: nombre@empresa.com.";
        }
        break;

      case "telefono":
        // Es opcional. Permite prefijos internacionales
        // y separadores habituales, sin exigir un país.
        if (valor) {
          const caracteresValidos = /^\+?[\d\s().-]+$/;
          const digitos = valor.replace(/\D/g, "");

          if (
            !caracteresValidos.test(valor) ||
            digitos.length < 7 ||
            digitos.length > 15
          ) {
            error =
              "Ingresa entre 7 y 15 dígitos. Puedes incluir el prefijo +51.";
          }
        }
        break;

      case "interes":
        if (!valor) {
          error = "Selecciona el servicio que te interesa.";
        }
        break;

      case "mensaje":
        if (!valor) {
          error = "Cuéntanos brevemente qué necesitas.";
        } else if (
          campo.maxLength >= 0 &&
          campo.value.length > campo.maxLength
        ) {
          error = `El mensaje no puede superar los ${campo.maxLength} caracteres.`;
        }
        break;

      case "privacidad":
        if (!campo.checked) {
          error = "Debes aceptar el uso de tus datos para responder la consulta.";
        }
        break;
    }

    return mostrarError(campo, error);
  }

  /* =========================================
     CONTADOR DEL MENSAJE
     ========================================= */

  function actualizarContador() {
    if (!mensaje || !contador) return;

    contador.textContent =
      `${mensaje.value.length} de ${mensaje.maxLength} caracteres`;
  }

  if (mensaje) {
    mensaje.addEventListener("input", actualizarContador);
  }

  actualizarContador();

  /* =========================================
     REVISIÓN AL EDITAR
     ========================================= */

  campos.forEach((campo) => {
    campo.addEventListener("blur", () => {
      camposRevisados.add(campo);
      validarCampo(campo);
    });

    const evento =
      campo.tagName === "SELECT" || campo.type === "checkbox"
        ? "change"
        : "input";

    campo.addEventListener(evento, () => {
      limpiarEstado();

      if (intentoEnviar || camposRevisados.has(campo)) {
        validarCampo(campo);
      }
    });
  });

  /* =========================================
     ENVÍO DEL FORMULARIO
     ========================================= */

  form.addEventListener("submit", (evento) => {
    // Evita navegar con los datos personales en la URL.
    evento.preventDefault();

    intentoEnviar = true;
    limpiarEstado();

    let primerCampoInvalido = null;

    campos.forEach((campo) => {
      const valido = validarCampo(campo);

      if (!valido && !primerCampoInvalido) {
        primerCampoInvalido = campo;
      }
    });

    if (primerCampoInvalido) {
      if (estado) {
        estado.textContent =
          "Revisa los campos señalados antes de continuar.";
        estado.classList.add("error");
      }

      primerCampoInvalido.focus();
      return;
    }

    // Aquí se incorporará la petición al servidor
    // cuando exista un servicio real de recepción.
    // No se borran los campos ni se simula un envío.
    if (estado) {
      estado.textContent =
        "Los campos están completos, pero el formulario aún no está " +
        "conectado a un servicio de envío. Tu consulta no se ha enviado. " +
        "Puedes usar el enlace de correo que aparece en esta página.";
    }
  });

  /* =========================================
     RESTABLECIMIENTO
     ========================================= */

  form.addEventListener("reset", () => {
    intentoEnviar = false;
    camposRevisados.clear();
    limpiarEstado();

    campos.forEach((campo) => {
      mostrarError(campo, "");
    });

    // Espera a que el navegador restablezca los valores.
    requestAnimationFrame(actualizarContador);
  });
});