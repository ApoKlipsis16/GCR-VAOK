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

  form.addEventListener("submit", async (evento) => {
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

    // GUARDAR CONSULTA EN SUPABASE

    const boton = document.getElementById("submit-btn");
    boton.disabled = true;
    boton.classList.add("loading");

    if (estado) {
      estado.textContent = "Enviando consulta...";
    }

    try {
      if (!window.gcrDB) {
        throw new Error("No se pudo conectar con Supabase.");
      }

      const { data, error: errorSesion } =
        await window.gcrDB.auth.getSession();

      if (errorSesion) throw errorSesion;

      const usuarioId = data.session?.user?.id ?? null;

      const { error } = await window.gcrDB
        .from("mensajes_contacto")
        .insert({
          usuario_id: usuarioId,
          nombre: nombre.value.trim(),
          correo: email.value.trim(),
          empresa: document.getElementById("empresa").value.trim(),
          telefono: telefono.value.trim(),
          interes: interes.value,
          asunto: "Consulta desde la web",
          tamano: document.getElementById("tamano").value,
          mensaje: mensaje.value.trim()
        });

     if (error) throw error;

// Redirigir únicamente cuando Supabase confirma el registro.
window.location.href = "solicitud-enviada.html";
    } catch (error) {
      console.error("Error al enviar consulta:", error);

      if (estado) {
        estado.textContent =
          "No se pudo enviar: " + error.message;
        estado.classList.add("error");
      }

    } finally {
      boton.disabled = false;
      boton.classList.remove("loading");
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
