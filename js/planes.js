"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const opciones = [
    {
      selector: ".plan-card:nth-child(1) .plan-button",
      id: "diagnostico-inicial",
      nombre: "Diagnóstico inicial",
      tipo: "plan"
    },
    {
      selector: ".plan-card:nth-child(2) .plan-button",
      id: "implementacion-grc",
      nombre: "Implementación GRC",
      tipo: "plan"
    },
    {
      selector: ".plan-card:nth-child(3) .plan-button",
      id: "acompanamiento-continuo",
      nombre: "Acompañamiento continuo",
      tipo: "plan"
    },
    {
      selector: ".service-card:nth-child(1) a",
      id: "preparacion-auditorias",
      nombre: "Preparación de auditorías",
      tipo: "servicio"
    },
    {
      selector: ".service-card:nth-child(2) a",
      id: "riesgo-terceros",
      nombre: "Riesgo de terceros",
      tipo: "servicio"
    },
    {
      selector: ".service-card:nth-child(3) a",
      id: "concientizacion-cultura",
      nombre: "Concientización y cultura",
      tipo: "servicio"
    }
  ];

  opciones.forEach((opcion) => {
    const enlace = document.querySelector(opcion.selector);

    if (!enlace) return;

    // Mantiene el destino en login y añade la selección.
    // También funciona al abrir el enlace en otra pestaña.
    const destino = new URL("login.html", window.location.href);

    destino.searchParams.set("seleccion", opcion.id);
    destino.searchParams.set("tipo", opcion.tipo);

    enlace.href = destino.href;

    enlace.addEventListener("click", () => {
      const seleccion = {
        id: opcion.id,
        nombre: opcion.nombre,
        tipo: opcion.tipo
      };

      try {
        sessionStorage.setItem(
          "noxiraSeleccion",
          JSON.stringify(seleccion)
        );
      } catch {
        // Si el navegador bloquea el almacenamiento,
        // la selección sigue disponible en la URL.
      }

      // El enlace continúa hacia login normalmente.
      // No registra una contratación ni realiza cobros.
    });
  });
});