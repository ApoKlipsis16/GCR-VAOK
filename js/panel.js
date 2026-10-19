"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const $ = (selector) => document.querySelector(selector);


  // DATOS REALES DESDE SUPABASE

  if (!window.gcrDB) {
    $("#estado-cuenta").textContent = "Error: no se pudo conectar con Supabase.";
    return;
  }

  const { data: { user }, error: authError } =
    await window.gcrDB.auth.getUser();

  if (authError || !user) {
    window.location.replace("login.html");
    return;
  }

  try {
    const { data: perfil, error: perfilError } = await window.gcrDB
      .from("perfiles")
      .select("nombre, empresa, caso_id")
      .eq("id", user.id)
      .single();

    if (perfilError) throw perfilError;

    $("#nombre-usuario").textContent = perfil.nombre || "Usuario";
    $("#empresa-usuario").textContent = perfil.empresa || "Sin empresa registrada";
    $("#estado-cuenta").textContent = "Cuenta activa · Datos de Supabase";
    $("#sin-plan").hidden = false;
    $("#aviso-demo").hidden = false;

    $("#contenido-plan").innerHTML = `
      <article class="plan-card plan-hero">
        <span class="card-label">MI PERFIL</span>
        <h3>Bienvenido a NOXIRA GRC</h3>
        <p>Estos son los datos registrados en tu cuenta.</p>
        <dl class="plan-meta">
          <div><dt>Nombre completo</dt><dd id="perfil-nombre"></dd></div>
          <div><dt>Empresa</dt><dd id="perfil-empresa"></dd></div>
          <div><dt>Correo</dt><dd id="perfil-correo"></dd></div>
        </dl>
        <a class="portal-button" href="#mi-consultoria">Ver mi caso GRC ↗</a>
      </article>
    `;

    $("#perfil-nombre").textContent = perfil.nombre || "Usuario";
    $("#perfil-empresa").textContent = perfil.empresa || "Sin empresa registrada";
    $("#perfil-correo").textContent = user.email || "";

    if (!perfil.caso_id) {
      throw new Error("Tu cuenta aún no tiene un caso GRC asignado.");
    }

    // CASO GRC ASIGNADO AL USUARIO

    const { data: caso, error: casoError } = await window.gcrDB
      .from("casos_grc")
      .select("codigo, titulo, prioridad, descripcion, impacto, recomendacion")
      .eq("id", perfil.caso_id)
      .single();

    if (casoError) throw casoError;

    $("#resumen-consultoria").innerHTML = `
      <article class="summary-card">
        <span class="card-label" id="caso-codigo"></span>
        <h3 id="caso-titulo"></h3>
        <p><strong>Prioridad:</strong> <span id="caso-prioridad"></span></p>
      </article>
    `;

    $("#caso-codigo").textContent = `Caso educativo ${caso.codigo}`;
    $("#caso-titulo").textContent = caso.titulo;
    $("#caso-prioridad").textContent = caso.prioridad;

    $("#lista-hallazgos").innerHTML = `
      <article class="finding-card">
        <h4>Descripción del problema</h4>
        <p id="caso-descripcion"></p>
        <h4>Impacto posible</h4>
        <p id="caso-impacto"></p>
      </article>
    `;

    $("#caso-descripcion").textContent = caso.descripcion;
    $("#caso-impacto").textContent = caso.impacto;

    $("#etapas-consultoria").innerHTML = `
      <li class="completed">Registro completado</li>
      <li class="current">Caso GRC educativo asignado</li>
      <li>Revisión de controles recomendados</li>
    `;

    $("#historial-avances").innerHTML = `
      <li>
        <h4>Recomendación para este caso</h4>
        <p id="caso-recomendacion"></p>
      </li>
    `;

    $("#caso-recomendacion").textContent = caso.recomendacion;

  } catch (error) {
    console.error(error);
    $("#estado-cuenta").textContent =
      "No se pudieron cargar tus datos: " + error.message;
  }

  /* =========================================
     NAVEGACIÓN ENTRE LAS DOS SECCIONES
     ========================================= */

  const secciones = ["mi-plan", "mi-consultoria"];
  const botones = document.querySelectorAll(".menu-button");

  function mostrarSeccion(id, moverFoco = false) {
    const destino = secciones.includes(id) ? id : "mi-plan";

    secciones.forEach((seccion) => {
      document.getElementById(seccion).hidden = seccion !== destino;
    });

    botones.forEach((boton) => {
      const activo = boton.dataset.section === destino;

      boton.classList.toggle("active", activo);

      if (activo) {
        boton.setAttribute("aria-current", "true");
      } else {
        boton.removeAttribute("aria-current");
      }
    });

    if (moverFoco) {
      const titulo = document.querySelector(`#${destino} > h2`);
      titulo.setAttribute("tabindex", "-1");
      titulo.focus({ preventScroll: true });
      titulo.scrollIntoView({ block: "start" });
    }
  }

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = boton.dataset.section;
      if (!secciones.includes(id)) return;

      if (window.location.hash === `#${id}`) {
        mostrarSeccion(id, true);
      } else {
        window.location.hash = id;
      }
    });
  });

  window.addEventListener("hashchange", () => {
    mostrarSeccion(window.location.hash.slice(1), true);
  });

  mostrarSeccion(window.location.hash.slice(1));

  /* =========================================
     SALIR DE LA DEMOSTRACIÓN
     ========================================= */

const salir = $("#cerrar-sesion");

salir.addEventListener("click", async () => {
  salir.disabled = true;

  const { error } = await window.gcrDB.auth.signOut();

  if (error) {
    alert("No se pudo cerrar sesión: " + error.message);
    salir.disabled = false;
    return;
  }

  window.location.replace("login.html");
});
});
