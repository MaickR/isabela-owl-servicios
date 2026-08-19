<div align="center">

# Isabela Tena · Programa de Transformación Integral Owl

**Landing bilingüe de alto impacto para el programa de transformación de Isabela Tena**
Mundo Holístico USA · Hipnoterapia, regresión y meditación Kriya

[![HTML5](https://img.shields.io/badge/HTML5-semántico-E34F26?style=flat-square&logo=html5&logoColor=white)](index.html)
[![CSS3](https://img.shields.io/badge/CSS3-BEM%20mobile--first-1572B6?style=flat-square&logo=css3&logoColor=white)](css/estilos.css)
[![JavaScript](https://img.shields.io/badge/JS-ES2026%2B%20vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](js/aplicacion.js)
[![Bilingüe](https://img.shields.io/badge/i18n-ES%20%7C%20EN-35203f?style=flat-square)](index-es.html)
[![Estado](https://img.shields.io/badge/estado-producción-b98d3e?style=flat-square)](https://isabela-services.netlify.app/)

[🇺🇸 English](index.html) · [🇪🇸 Español](index-es.html) · [Demo en vivo](https://isabela-services.netlify.app/)

</div>

---

## Descripción

Landing page de conversión para el **Programa de Transformación Integral Owl** — un proceso 1:1 de 5 sesiones y ~25 horas guiado por Isabela Tena. Diseño editorial minimalista y elegante, optimizado para convertir visitas en consultas directas por WhatsApp.

Totalmente bilingüe (inglés y español), responsive de 375px a 2560px y sin proceso de build.

## Características

- **Diseño editorial** — hero de alto impacto con fotografía integrada, tipografía serif (Fraunces) y paleta sobria morado/crema/dorado.
- **Bilingüe nativo** — paridad completa entre `index.html` (EN) e `index-es.html` (ES) con selector de idioma.
- **Conversión por WhatsApp** — CTAs contextuales con mensajes predefinidos y número configurado.
- **Accesible** — WCAG 2.1 AA: foco visible, ARIA sincronizado, skip link y `prefers-reduced-motion`.
- **SEO técnico** — Open Graph, Twitter Cards, JSON-LD (Schema.org `Service`), hreflang ES/EN, sitemap.xml y robots.txt.
- **Rendimiento** — imágenes con dimensiones explícitas, `loading="lazy"`, `fetchpriority` y favicon multiplataforma.
- **Mobile-first** — menú hamburguesa a pantalla completa, grid fluido y animaciones progresivas.

## Estructura

```text
├── index.html              # Versión en inglés
├── index-es.html           # Versión en español
├── css/
│   └── estilos.css         # Sistema de diseño (BEM + variables :root)
├── js/
│   └── aplicacion.js       # Interacciones (ES2026+, delegación de eventos)
├── img/                    # Fotografías y logo (optimizadas)
├── assets/                 # Imagen Open Graph (1200×630)
├── _archivo/               # Versiones e imágenes retiradas (fuera de producción)
├── favicon.ico / *.png     # Favicon 16→512px + Apple/Android
├── site.webmanifest        # Soporte PWA básico
├── robots.txt              # Rastreo permitido; excluye _archivo/
└── sitemap.xml             # Sitemap bilingüe con hreflang
```

Sin build ni dependencias locales — solo HTML, CSS y JS estáticos.

## Ejecución local

```powershell
python -m http.server 8000
```

Abre `http://localhost:8000/index.html` (EN) o `http://localhost:8000/index-es.html` (ES).

## Publicación

```powershell
git add .
git commit -m "Describe el cambio realizado"
git push origin main
```

Repositorio: `https://github.com/MaickR/isabela-owl-servicios.git`
Demo: `https://isabela-services.netlify.app/`

## Convenciones

- Contenido visible en el idioma de cada página; código y clases CSS en español (BEM).
- Cambios compartidos se aplican siempre a **ambas** versiones (EN y ES).
- Al actualizar el número de contacto, **no** modificar los mensajes contextuales de WhatsApp.
- Imágenes siempre con `width`, `height` y `alt` descriptivos.

## Stack

| Capa | Tecnología |
|---|---|
| Marcado | HTML5 semántico |
| Estilos | CSS3 · variables `:root` · BEM · mobile-first |
| Interacción | JavaScript ES2026+ vanilla (módulo nativo) |
| Animaciones | Anime.js (CDN) + IntersectionObserver |
| SEO | Schema.org JSON-LD · Open Graph · Twitter Cards |

---

<div align="center">

**© 2026 Mundo Holístico USA** — Isabela Tena
Todos los derechos reservados.

</div>
