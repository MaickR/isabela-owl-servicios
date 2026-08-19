/**
 * ==============================================================================
 * APLICACIÓN PRINCIPAL — Mundo Holístico USA / Isabela Owl
 * ES2026+ · Sin dependencias · Funciones puras donde es posible
 *
 * POR QUÉ delegación de eventos: un único listener por tipo de evento en
 * `document` evita docenas de handlers sueltos, simplifica el ciclo de vida
 * y mantiene el código DRY. Cualquier elemento interactivo nuevo solo
 * necesita el atributo [data-accion] correspondiente.
 * ==============================================================================
 */
import { animate, stagger } from 'https://cdn.jsdelivr.net/npm/animejs/+esm';

'use strict';

/* --------------------------------------------------------------------------
   CONSTANTES GLOBALES
   -------------------------------------------------------------------------- */

/** @constant {Readonly<Object>} CONFIGURACION - Ajustes globales de la interfaz. */
const CONFIGURACION = Object.freeze({
  UMBRAL_SCROLL_CABECERA: 24,
  DURACION_CONTADOR_MS: 1500,
  CLASE_VISIBLE: 'es-visible',
  CLASE_MENU_ABIERTO: 'cabecera--menu-abierto',
  CLASE_CABECERA_COMPACTA: 'cabecera--compacta',
  CLASE_FAQ_ABIERTO: 'es-abierto',
});

/** @constant {boolean} MOVIMIENTO_REDUCIDO - Respeta la preferencia del sistema (accesibilidad). */
const MOVIMIENTO_REDUCIDO = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/** @constant {number} ANCHO_DESKTOP - Punto donde desaparece el menú móvil. */
const ANCHO_DESKTOP = 1024;

/* --------------------------------------------------------------------------
   FUNCIONES PURAS
   -------------------------------------------------------------------------- */

/**
 * Calcula un valor interpolado con easing "easeOutCubic".
 * POR QUÉ pura: testeable y reutilizable sin efectos colaterales.
 * @param {number} progreso - Avance normalizado en el rango [0..1].
 * @returns {number} Valor suavizado en el rango [0..1].
 */
const calcularEasing = (progreso) => 1 - Math.pow(1 - progreso, 3);

/* --------------------------------------------------------------------------
   CONTADORES ANIMADOS (estadísticas del hero)
   -------------------------------------------------------------------------- */

/**
 * Anima el número de un contador desde 0 hasta su objetivo con easing.
 * @param {HTMLElement} elemento - Nodo con los atributos [data-valor] y [data-sufijo].
 * @returns {void}
 */
const animarContador = (elemento) => {
  const objetivo = Number.parseInt(elemento.dataset.valor ?? '0', 10);
  const sufijo = elemento.dataset.sufijo ?? '';
  // Fail fast: ante datos corruptos no se anima nada.
  if (Number.isNaN(objetivo)) { return; }
  if (MOVIMIENTO_REDUCIDO) {
    elemento.textContent = `${objetivo}${sufijo}`;
    return;
  }

  const instanteInicial = performance.now();
  const pasoTemporal = (ahora) => {
    const progreso = Math.min((ahora - instanteInicial) / CONFIGURACION.DURACION_CONTADOR_MS, 1);
    elemento.textContent = `${Math.round(calcularEasing(progreso) * objetivo)}${sufijo}`;
    if (progreso < 1) { requestAnimationFrame(pasoTemporal); }
  };
  requestAnimationFrame(pasoTemporal);
};

/**
 * Activa los contadores cuando su estadística entra en pantalla,
 * una sola vez por elemento.
 * @returns {void}
 */
const inicializarContadores = () => {
  const contadores = document.querySelectorAll('.contador');
  if (contadores.length === 0) { return; }
  if (MOVIMIENTO_REDUCIDO || !('IntersectionObserver' in window)) {
    contadores.forEach(animarContador);
    return;
  }
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) { return; }
      animarContador(entrada.target);
      observador.unobserve(entrada.target);
    });
  }, { threshold: 0.6 });
  contadores.forEach((contador) => observador.observe(contador));
};

/* --------------------------------------------------------------------------
   REVELADO PROGRESIVO (Intersection Observer)
   -------------------------------------------------------------------------- */

/**
 * Revela los elementos .js-revelar al entrar en el viewport, evitando
 * animar toda la página de golpe y mejorando el rendimiento percibido.
 * @returns {void}
 */
const inicializarRevelado = () => {
  const seccionesAnimables = document.querySelectorAll('section, footer.pie');
  if (seccionesAnimables.length === 0) { return; }

  const mostrarSinAnimacion = (seccion) => {
    const elementos = seccion.querySelectorAll('.js-revelar');
    elementos.forEach((elemento) => elemento.classList.add(CONFIGURACION.CLASE_VISIBLE));
  };

  if (MOVIMIENTO_REDUCIDO || !('IntersectionObserver' in window)) {
    seccionesAnimables.forEach(mostrarSinAnimacion);
    return;
  }

  const animarSeccion = (seccion) => {
    const elementos = Array.from(seccion.querySelectorAll('.js-revelar'));
    if (elementos.length === 0) { return; }

    animate(elementos, {
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 680,
      delay: stagger(90),
      easing: 'easeOutQuad',
      complete: () => {
        elementos.forEach((elemento) => {
          elemento.classList.add(CONFIGURACION.CLASE_VISIBLE);
          elemento.style.opacity = '';
          elemento.style.transform = '';
        });
      },
    });
  };

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) { return; }
      animarSeccion(entrada.target);
      observador.unobserve(entrada.target);
    });
  }, { threshold: 0.22, rootMargin: '0px 0px -8% 0px' });

  seccionesAnimables.forEach((seccion) => observador.observe(seccion));
};

/* --------------------------------------------------------------------------
   MENÚ MÓVIL
   -------------------------------------------------------------------------- */

/**
 * Abre o cierra el menú móvil sincronizando ARIA y el bloqueo de scroll.
 * @param {boolean} [forzarCierre=false] - Cierra sin alternar (tecla Escape o clic en enlace).
 * @returns {void}
 */
const alternarMenuMovil = (forzarCierre = false) => {
  const cabecera = document.getElementById('cabecera');
  const panel = document.getElementById('panel-movil');
  const botonMenu = document.querySelector('[data-accion="alternar-menu"]');
  if (!cabecera || !panel || !botonMenu) { return; }

  const quedaraAbierto = forzarCierre ? false : !cabecera.classList.contains(CONFIGURACION.CLASE_MENU_ABIERTO);
  cabecera.classList.toggle(CONFIGURACION.CLASE_MENU_ABIERTO, quedaraAbierto);
  document.documentElement.classList.toggle('sin-desplazamiento', quedaraAbierto);
  botonMenu.setAttribute('aria-expanded', String(quedaraAbierto));
  botonMenu.setAttribute('aria-label', quedaraAbierto ? 'Close menu' : 'Open menu');
  panel.setAttribute('aria-hidden', String(!quedaraAbierto));

  // POR QUÉ mover el foco: patrón de diálogo accesible (WAI-ARIA).
  if (quedaraAbierto) {
    panel.querySelector('a')?.focus();
  } else {
    botonMenu.focus();
  }
};

/**
 * Devuelve si el menú móvil está abierto en este momento.
 * @returns {boolean}
 */
const menuMovilAbierto = () => {
  const cabecera = document.getElementById('cabecera');
  return cabecera?.classList.contains(CONFIGURACION.CLASE_MENU_ABIERTO) ?? false;
};

/**
 * Mantiene el foco dentro del panel móvil mientras está abierto.
 * @param {KeyboardEvent} evento - Evento de teclado.
 * @returns {void}
 */
const atraparFocoEnMenu = (evento) => {
  if (evento.key !== 'Tab' || !menuMovilAbierto()) { return; }

  const panel = document.getElementById('panel-movil');
  if (!panel) { return; }

  const elementosFoco = panel.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (elementosFoco.length === 0) { return; }

  const primerElemento = elementosFoco[0];
  const ultimoElemento = elementosFoco[elementosFoco.length - 1];
  const activo = document.activeElement;

  if (evento.shiftKey && activo === primerElemento) {
    evento.preventDefault();
    ultimoElemento.focus();
    return;
  }

  if (!evento.shiftKey && activo === ultimoElemento) {
    evento.preventDefault();
    primerElemento.focus();
  }
};

/**
 * Cierra el menú móvil cuando se hace clic fuera del panel.
 * @param {Element} objetivo - Elemento objetivo del clic.
 * @returns {void}
 */
const cerrarMenuSiClicFuera = (objetivo) => {
  if (!menuMovilAbierto()) { return; }
  const panel = document.getElementById('panel-movil');
  const botonMenu = document.querySelector('[data-accion="alternar-menu"]');
  if (!panel || !botonMenu) { return; }

  const clicDentroPanel = panel.contains(objetivo);
  const clicEnBoton = botonMenu.contains(objetivo);
  if (!clicDentroPanel && !clicEnBoton) {
    alternarMenuMovil(true);
  }
};

/**
 * Si la vista pasa a desktop, asegura estado cerrado del menú móvil.
 * @returns {void}
 */
const cerrarMenuEnDesktop = () => {
  if (window.innerWidth >= ANCHO_DESKTOP && menuMovilAbierto()) {
    alternarMenuMovil(true);
  }
};

/* --------------------------------------------------------------------------
   ACORDEÓN DEL FAQ
   -------------------------------------------------------------------------- */

/**
 * Alterna un ítem del FAQ. Solo uno permanece abierto a la vez para
 * mantener la página limpia y el foco del usuario en una sola respuesta.
 * @param {HTMLButtonElement} botonPregunta - Botón de la pregunta pulsada.
 * @returns {void}
 */
const alternarAcordeonFaq = (botonPregunta) => {
  const itemFaq = botonPregunta.closest('.faq__item');
  if (!itemFaq) { return; }
  const quedaraAbierto = !itemFaq.classList.contains(CONFIGURACION.CLASE_FAQ_ABIERTO);

  document.querySelectorAll(`.faq__item.${CONFIGURACION.CLASE_FAQ_ABIERTO}`).forEach((item) => {
    item.classList.remove(CONFIGURACION.CLASE_FAQ_ABIERTO);
    item.querySelector('.faq__pregunta')?.setAttribute('aria-expanded', 'false');
  });

  itemFaq.classList.toggle(CONFIGURACION.CLASE_FAQ_ABIERTO, quedaraAbierto);
  botonPregunta.setAttribute('aria-expanded', String(quedaraAbierto));
};

/* --------------------------------------------------------------------------
   DELEGACIÓN CENTRAL DE EVENTOS
   -------------------------------------------------------------------------- */

/**
 * Delegación central de clics: menú móvil y acordeón del FAQ.
 * @param {MouseEvent} evento - Evento nativo de clic.
 * @returns {void}
 */
const manejarClickDelegado = (evento) => {
  const objetivo = evento.target;
  if (!(objetivo instanceof Element)) { return; }

  const conAccion = objetivo.closest('[data-accion]');
  if (conAccion?.dataset.accion === 'alternar-menu') { alternarMenuMovil(); return; }
  if (conAccion?.dataset.accion === 'cerrar-menu') { alternarMenuMovil(true); return; }

  // POR QUÉ: el panel móvil es pantalla completa (fixed inset:0), por lo que
  // "tocar fuera" en realidad cae SIEMPRE dentro del panel. Se interpreta como
  // toque de cierre cualquier clic que no caiga sobre un enlace o botón.
  const panel = document.getElementById('panel-movil');
  if (menuMovilAbierto() && panel && panel.contains(objetivo) && !objetivo.closest('a, button')) {
    alternarMenuMovil(true);
    return;
  }

  const botonPregunta = objetivo.closest('.faq__pregunta');
  if (botonPregunta) { alternarAcordeonFaq(botonPregunta); }

  cerrarMenuSiClicFuera(objetivo);
};

/**
 * Cierra el menú móvil con la tecla Escape (patrón de diálogo accesible).
 * @param {KeyboardEvent} evento - Evento de teclado.
 * @returns {void}
 */
const manejarTeclaEscape = (evento) => {
  if (evento.key !== 'Escape') { return; }
  const cabecera = document.getElementById('cabecera');
  if (cabecera?.classList.contains(CONFIGURACION.CLASE_MENU_ABIERTO)) { alternarMenuMovil(true); }
};

/**
 * Maneja el foco atrapado cuando el panel móvil está abierto.
 * @param {KeyboardEvent} evento - Evento de teclado.
 * @returns {void}
 */
const manejarNavegacionConTab = (evento) => {
  atraparFocoEnMenu(evento);
};

/* --------------------------------------------------------------------------
   CABECERA COMPACTA AL HACER SCROLL
   -------------------------------------------------------------------------- */

/**
 * Compacta la cabecera al hacer scroll, con throttling vía rAF para
 * no ejecutar trabajo de más en cada evento de scroll.
 * @returns {void}
 */
const inicializarCabecera = () => {
  const cabecera = document.getElementById('cabecera');
  if (!cabecera) { return; }
  let tickPendiente = false;
  window.addEventListener('scroll', () => {
    if (tickPendiente) { return; }
    tickPendiente = true;
    requestAnimationFrame(() => {
      cabecera.classList.toggle(CONFIGURACION.CLASE_CABECERA_COMPACTA, window.scrollY > CONFIGURACION.UMBRAL_SCROLL_CABECERA);
      tickPendiente = false;
    });
  }, { passive: true });
};

/* --------------------------------------------------------------------------
   TITULAR DEL HERO
   -------------------------------------------------------------------------- */

/**
 * Dispara la máscara de líneas del titular tras el primer pintado.
 * POR QUÉ doble rAF: garantiza que el estado inicial (líneas ocultas)
 * ya está aplicado antes de disparar la transición.
 * @returns {void}
 */
const inicializarTitular = () => {
  const heroe = document.querySelector('.heroe');
  if (!heroe) { return; }
  requestAnimationFrame(() => requestAnimationFrame(() => heroe.classList.add('heroe--listo')));
};

/* --------------------------------------------------------------------------
   UTILIDADES
   -------------------------------------------------------------------------- */

/**
 * Sincroniza el año del pie con el reloj del dispositivo,
 * para que el copyright nunca quede desactualizado.
 * @returns {void}
 */
const asignarAnioActual = () => {
  const nodoAnio = document.getElementById('anio-actual');
  if (nodoAnio) { nodoAnio.textContent = String(new Date().getFullYear()); }
};

/* --------------------------------------------------------------------------
   ARRANQUE
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  inicializarCabecera();
  inicializarTitular();
  inicializarRevelado();
  inicializarContadores();
  asignarAnioActual();

  // Cierra el menú móvil si el usuario rota el dispositivo o cambia a desktop.
  window.addEventListener('resize', cerrarMenuEnDesktop, { passive: true });
});

document.addEventListener('click', manejarClickDelegado);
document.addEventListener('keydown', manejarTeclaEscape);
document.addEventListener('keydown', manejarNavegacionConTab);
