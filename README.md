# Isabela Tena | Programa Integral

Landing bilingue para el programa integral de transformacion de Isabela Tena,
publicada en ingles y espanol bajo la marca Mundo Holistico USA.

## Caracteristicas

- Pagina en ingles: `index.html`.
- Pagina en espanol: `index-es.html`.
- Diseno responsive mobile-first.
- Navegacion movil accesible y acordeon de preguntas frecuentes.
- Animaciones progresivas y contadores con soporte para
  `prefers-reduced-motion`.
- Enlaces contextuales de WhatsApp con el numero de contacto configurado.
- Metadatos SEO, Open Graph, Twitter Cards y datos estructurados JSON-LD.
- Favicon multiplataforma basado en el logo oficial de Mundo Holistico USA.

## Estructura

```text
isabela-owl/
|-- index.html
|-- index-es.html
|-- css/
|   `-- estilos.css
|-- js/
|   `-- aplicacion.js
|-- img/
|   |-- logo-Mundoholistico.png
|   |-- isabela-tena-alt.JPG
|   |-- isabela-tena-pic.JPG
|   |-- isabela-tena.JPG
|   `-- zoom.png
|-- favicon.ico
|-- favicon-16x16.png
|-- favicon-32x32.png
|-- favicon-180x180.png
|-- favicon-192x192.png
|-- favicon-512x512.png
`-- site.webmanifest
```

Las paginas principales comparten `css/estilos.css` y
`js/aplicacion.js`. Las imagenes se sirven desde `img/` y no dependen de un
proceso de compilacion.

## Ejecucion local

El sitio es estatico. Para evitar restricciones del navegador con modulos ES,
ejecuta un servidor local desde la raiz del proyecto:

```powershell
python -m http.server 8000
```

Despues abre:

- `http://localhost:8000/index.html`
- `http://localhost:8000/index-es.html`

Tambien puede utilizarse cualquier servidor estatico equivalente.

## Publicacion

El repositorio remoto configurado es:

```text
https://github.com/MaickR/isabela-owl-servicios.git
```

Para publicar cambios:

```powershell
git add .
git commit -m "Describe el cambio realizado"
git push origin main
```

## Convenciones

- Mantener el contenido visible de cada pagina en su idioma correspondiente.
- Conservar las clases BEM y la nomenclatura de codigo existente en espanol.
- Actualizar las dos paginas cuando el cambio afecte a la experiencia comun.
- No modificar los mensajes contextuales de WhatsApp al cambiar unicamente el
  numero de contacto.
- Mantener dimensiones explicitas y `alt` descriptivos en las imagenes.

## Tecnologias

- HTML5 semantico.
- CSS3 responsive con variables de diseno.
- JavaScript ES2026+ como modulo nativo.
- Anime.js cargado desde CDN para animaciones puntuales.
- Schema.org JSON-LD para informacion del servicio.
