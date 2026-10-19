"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector) => document.querySelector(selector);

  // DEMOSTRACIÓN LOCAL:
  // No representa una contratación, pago ni sesión real.
  // Todos los datos de este expediente son ficticios.

  const casos = [
    {
      id: "NX-001",
      titulo: "Cuentas administrativas sin MFA",
      prioridad: "Alta",
      estado: "En implementación",
      clase: "warning",
      descripcion:
        "Se identificaron 8 cuentas privilegiadas que solo utilizaban contraseña.",
      solucion:
        "Se configuró autenticación multifactor en 6 cuentas y se separaron los accesos administrativos del uso cotidiano.",
      siguiente:
        "Configurar las 2 cuentas restantes y verificar los métodos de recuperación.",
      responsable: "Lucía Torres · Identidades",
      avance: 75,
      evidencia:
        "Registro de configuración de 6 cuentas revisado. Falta validar las cuentas de contingencia."
    },
    {
      id: "NX-002",
      titulo: "Copias de seguridad sin verificar",
      prioridad: "Alta",
      estado: "En verificación",
      clase: "info",
      descripcion:
        "Existían copias programadas, pero no había evidencia de pruebas de restauración.",
      solucion:
        "Se recuperó una muestra de archivos en un entorno aislado y se documentó el procedimiento.",
      siguiente:
        "Ejecutar una restauración completa del sistema de inventario y medir el tiempo de recuperación.",
      responsable: "Diego Ramos · Infraestructura",
      avance: 60,
      evidencia:
        "Prueba parcial completada. La recuperación integral todavía no está aprobada."
    },
    {
      id: "NX-003",
      titulo: "Permisos excesivos en carpetas",
      prioridad: "Media",
      estado: "Resuelto",
      clase: "success",
      descripcion:
        "Usuarios de distintas áreas podían modificar documentos financieros sin necesitar ese acceso.",
      solucion:
        "Se reorganizaron los permisos por función y se retiraron 12 asignaciones innecesarias.",
      siguiente:
        "Revisar los permisos mensualmente y al cambiar las funciones de un colaborador.",
      responsable: "Lucía Torres · Identidades",
      avance: 100,
      evidencia:
        "Matriz de permisos aprobada y pruebas de acceso realizadas con cuentas de cada área."
    },
    {
      id: "NX-004",
      titulo: "Correos de suplantación",
      prioridad: "Media",
      estado: "En capacitación",
      clase: "warning",
      descripcion:
        "El equipo reportó mensajes que imitaban solicitudes de proveedores para cambiar datos de pago.",
      solucion:
        "Se definió un canal de reporte y una verificación por un medio independiente antes de modificar cuentas bancarias.",
      siguiente:
        "Completar el taller y evaluar el reconocimiento de señales de suplantación.",
      responsable: "Valeria Medina · Cultura de seguridad",
      avance: 40,
      evidencia:
        "Guía de reporte publicada. Taller práctico pendiente para 18 colaboradores."
    }
  ];

  const actualizaciones = [
    {
      fecha: "2026-10-14",
      titulo: "Seis cuentas ya tienen MFA",
      detalle:
        "Se comprobó el segundo factor en 6 de las 8 cuentas administrativas. Las otras dos requieren coordinar una ventana de intervención.",
      autor: "Lucía Torres"
    },
    {
      fecha: "2026-10-13",
      titulo: "Restauración parcial completada",
      detalle:
        "Se recuperaron archivos de prueba en un entorno aislado. Este resultado no confirma todavía la recuperación del sistema completo.",
      autor: "Diego Ramos"
    },
    {
      fecha: "2026-10-12",
      titulo: "Hallazgo de permisos cerrado",
      detalle:
        "Los responsables de Finanzas validaron la matriz de accesos. Se retiraron 12 permisos innecesarios y se verificó el acceso por área.",
      autor: "Lucía Torres"
    },
    {
      fecha: "2026-10-09",
      titulo: "Plan de tratamiento aprobado",
      detalle:
        "Se acordaron responsables y acciones para los cuatro hallazgos. Se priorizaron las cuentas administrativas y los respaldos.",
      autor: "Valeria Medina"
    },
    {
      fecha: "2026-10-07",
      titulo: "Diagnóstico inicial finalizado",
      detalle:
        "Se revisaron cuentas, carpetas compartidas, respaldos y el procedimiento para atender correos sospechosos.",
      autor: "Equipo NOXIRA"
    },
    {
      fecha: "2026-10-05",
      titulo: "Inicio de la consultoría",
      detalle:
        "Se definió el alcance del proyecto de demostración para Andina Retail SAC y se registraron los responsables de cada área.",
      autor: "Equipo NOXIRA"
    }
  ];

  const fechaTexto = (valor) =>
    new Intl.DateTimeFormat("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(`${valor}T12:00:00`));

  // Encabezado y aviso permanente de demostración.
  $("#nombre-usuario").textContent = "equipo Andina";
  $("#estado-cuenta").textContent = "DEMO · Datos ficticios · Sin conexión a Supabase";
  $("#sin-plan").hidden = true;
  $("#aviso-demo").hidden = false;

  const resueltos = casos.filter(
    (caso) => caso.estado === "Resuelto"
  ).length;

  /* =========================================
     MI PLAN
     ========================================= */

  $("#contenido-plan").innerHTML = `
    <article class="plan-card plan-hero">
      <div class="card-header">
        <div>
          <span class="card-label">CONTRATACIÓN DE EJEMPLO · NX-DEMO-2026</span>
          <h3>Implementación GRC</h3>
          <p>
            Un proyecto para organizar los accesos, fortalecer la
            recuperación y mejorar la respuesta del equipo.
          </p>
        </div>
        <span class="badge badge-info">Activo · demostración</span>
      </div>

      <dl class="plan-meta">
        <div>
          <dt>Organización ficticia</dt>
          <dd>Andina Retail SAC</dd>
        </div>
        <div>
          <dt>Importe ilustrativo</dt>
          <dd>S/ 2,400 por proyecto</dd>
        </div>
        <div>
          <dt>Periodo propuesto</dt>
          <dd>5 oct. – 6 nov. de 2026</dd>
        </div>
      </dl>

      <a class="portal-button" href="#mi-consultoria">
        Revisar mi consultoría ↗
      </a>
    </article>

    <div class="metrics-grid">
      <article class="metric-card">
        <span>Hallazgos detectados</span>
        <strong>${casos.length.toString().padStart(2, "0")}</strong>
        <small>Dentro del alcance revisado</small>
      </article>
      <article class="metric-card">
        <span>Hallazgos resueltos</span>
        <strong>${resueltos.toString().padStart(2, "0")}</strong>
        <small>Con verificación documentada</small>
      </article>
      <article class="metric-card">
        <span>Acciones en curso</span>
        <strong>${casos.length - resueltos}</strong>
        <small>Implementación y validación</small>
      </article>
      <article class="metric-card">
        <span>Próxima revisión</span>
        <strong>16 OCT</strong>
        <small>10:00 · reunión ficticia</small>
      </article>
    </div>

    <div class="dashboard-grid">
      <article class="summary-card">
        <span class="card-label">ALCANCE DEL PLAN</span>
        <h3>Servicios incluidos</h3>
        <ul class="plan-features">
          <li>Diagnóstico de las prácticas de seguridad acordadas.</li>
          <li>Matriz de riesgos con responsables y prioridades.</li>
          <li>Revisión de cuentas y privilegios administrativos.</li>
          <li>Orientación para pruebas de recuperación.</li>
          <li>Taller de identificación y reporte de suplantación.</li>
          <li>Informe de cierre y recomendaciones de continuidad.</li>
        </ul>
      </article>

      <article class="summary-card">
        <span class="card-label">EQUIPO ASIGNADO · FICTICIO</span>
        <h3>Tu equipo de consultoría</h3>
        <div class="team-list">
          <div><span class="avatar">VM</span><p>
            <strong>Valeria Medina</strong>
            <small>Coordinación y cultura de seguridad</small>
          </p></div>
          <div><span class="avatar">LT</span><p>
            <strong>Lucía Torres</strong>
            <small>Identidades y control de acceso</small>
          </p></div>
          <div><span class="avatar">DR</span><p>
            <strong>Diego Ramos</strong>
            <small>Infraestructura y recuperación</small>
          </p></div>
        </div>
      </article>
    </div>

    <article class="summary-card">
      <span class="card-label">BIBLIOTECA DEL PROYECTO</span>
      <h3>Documentos y entregables</h3>
      <p>Abre cada ficha para consultar su resumen de demostración.</p>

      <div class="document-list">
        <details>
          <summary>01 · Diagnóstico inicial
            <span class="badge badge-success">Disponible</span>
          </summary>
          <p>
            Alcance: cuentas privilegiadas, permisos compartidos,
            respaldos y procedimientos ante suplantación.
            Resultado: cuatro hallazgos, dos de prioridad alta
            y dos de prioridad media.
          </p>
        </details>
        <details>
          <summary>02 · Matriz de riesgos
            <span class="badge badge-info">En seguimiento</span>
          </summary>
          <p>
            Los riesgos se relacionan con acceso indebido,
            indisponibilidad de información y fraude por correo.
            Cada hallazgo tiene un responsable y una acción de tratamiento.
          </p>
        </details>
        <details>
          <summary>03 · Informe de cierre
            <span class="badge badge-warning">Pendiente</span>
          </summary>
          <p>
            Se elaborará cuando se revisen las evidencias pendientes,
            se documenten los riesgos residuales y se acuerden
            las acciones de continuidad. Aún no está emitido.
          </p>
        </details>
      </div>
    </article>
  `;

  /* =========================================
     MI CONSULTORÍA
     ========================================= */

  $("#resumen-consultoria").innerHTML = `
    <article class="summary-card">
      <div class="card-header">
        <div>
          <span class="card-label">EXPEDIENTE FICTICIO · NX-DEMO-2026</span>
          <h3>Protección de accesos y continuidad operativa</h3>
        </div>
        <span class="badge badge-info">Implementación</span>
      </div>

      <p>
        Andina Retail SAC necesita mejorar la protección de sus
        cuentas y comprobar que puede recuperar información
        ante una interrupción. Este expediente reúne el diagnóstico,
        las acciones acordadas y las evidencias pendientes.
      </p>

      <dl class="plan-meta">
        <div><dt>Coordinadora</dt><dd>Valeria Medina</dd></div>
        <div><dt>Última actualización ficticia</dt><dd>14 de octubre de 2026</dd></div>
        <div><dt>Cierre de hallazgos</dt><dd>${resueltos} de ${casos.length} verificados</dd></div>
      </dl>

      <div class="next-action">
        <strong>Próxima acción del cliente</strong>
        <p>
          Confirmar la ventana de mantenimiento para las dos cuentas
          pendientes y designar al responsable de la prueba de recuperación.
        </p>
      </div>
    </article>
  `;

  const etapas = [
    ["Solicitud recibida", "completed", "Completada"],
    ["Diagnóstico", "completed", "Completado"],
    ["Implementación", "current", "Etapa actual"],
    ["Verificación", "", "Pendiente de completar"],
    ["Cierre", "", "Pendiente"]
  ];

  $("#etapas-consultoria").innerHTML = etapas.map(
    ([nombre, clase, estado]) => `
      <li class="${clase}" ${clase === "current" ? 'aria-current="step"' : ""}>
        ${nombre}
        <span class="stage-status">${estado}</span>
      </li>
    `
  ).join("");

  // Los porcentajes corresponden a cada acción del ejemplo,
  // no a una medición global del nivel de seguridad.
  $("#lista-hallazgos").innerHTML = casos.map((caso) => `
    <article class="finding-card">
      <div class="finding-top">
        <span class="case-id">${caso.id}</span>
        <span class="badge badge-${caso.clase}">${caso.estado}</span>
      </div>

      <h4>${caso.titulo}</h4>
      <p><strong>Prioridad:</strong> ${caso.prioridad}</p>
      <p>${caso.descripcion}</p>

      <div class="progress-label">
        <span>Avance ilustrativo de la acción</span>
        <strong>${caso.avance}%</strong>
      </div>
      <progress
        max="100"
        value="${caso.avance}"
        aria-label="Avance de la acción: ${caso.titulo}"
      >${caso.avance}%</progress>

      <details class="case-details">
        <summary>Ver solución y próximos pasos</summary>
        <p><strong>Trabajo realizado:</strong> ${caso.solucion}</p>
        <p><strong>Próximo paso:</strong> ${caso.siguiente}</p>
        <p><strong>Evidencia:</strong> ${caso.evidencia}</p>
        <p><strong>Responsable:</strong> ${caso.responsable}</p>
      </details>
    </article>
  `).join("");

  $("#historial-avances").innerHTML = actualizaciones.map(
    (actualizacion) => `
      <li>
        <time datetime="${actualizacion.fecha}">
          ${fechaTexto(actualizacion.fecha)}
        </time>
        <h4>${actualizacion.titulo}</h4>
        <p>${actualizacion.detalle}</p>
        <p class="update-author">Registrado por ${actualizacion.autor}</p>
      </li>
    `
  ).join("");

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

  // No simulamos un cierre de sesión de Supabase.
  salir.textContent = "Salir de la demostración";

  salir.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});