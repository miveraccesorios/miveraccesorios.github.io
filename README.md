# Miver Accesorios · Sitio web

Catálogo online de Miver (collares, pulseras y chokers tejidos a mano).
Es una página **estática**: no tiene base de datos ni pagos integrados. Los clientes
arman su pedido y lo envían por **WhatsApp** con el detalle y el total ya escritos.

## Ver el sitio en la compu

```bash
./iniciar.sh
```

Después abrí <http://localhost:8080>. El script también muestra una dirección para
abrirlo **desde el celular** si está conectado a la misma red WiFi.

> También funciona haciendo doble clic en `index.html`, pero con el servidor se
> comporta igual que cuando esté publicado.

## ⚠ Antes de publicar: lo que hay que completar

| Qué | Dónde |
|---|---|
| **Número de WhatsApp** (mientras no esté, aparece un aviso amarillo arriba) | `js/config.js` → `whatsapp` |
| **Precios reales** (los actuales son de ejemplo) | `editor.html` o `js/productos.js` |
| Usuario de Instagram (opcional) | `js/config.js` → `instagram` |
| Medios de pago, forma de entrega y ubicación | `js/config.js` |
| Nombres y descripciones de productos (son sugeridos a partir de las fotos) | `editor.html` o `js/productos.js` |
| Textos de "Sobre Miver" y preguntas frecuentes | `index.html` |

Formato del número de WhatsApp (Argentina): `549` + código de área sin el 0 + número
sin el 15. Ejemplo: `(0341) 15 123-4567` → `5493411234567`.

## Cambiar precios, stock o productos

### Opción fácil: el editor

1. Abrí <http://localhost:8080/editor.html>.
2. Cambiá precios, estado (Disponible / A pedido / Agotado), destacados, etc.
   También hay un botón para **subir o bajar todos los precios un %**.
3. Tocá **Descargar productos.js** y reemplazá `js/productos.js` por el archivo descargado.
4. Recargá el sitio.

El editor guarda un borrador en el navegador, así que podés cerrarlo y seguir después.

### Opción manual

Editá `js/productos.js` con cualquier editor de texto. Cada producto tiene este formato:

```js
{
  id: "collar-esmeralda",        // va en el link, sin espacios ni tildes
  nombre: "Collar Esmeralda",
  categoria: "collares",         // collares | pulseras | chokers
  precio: 24000,                 // sin puntos ni $
  precioAntes: null,             // poné un precio mayor para mostrar "Oferta"
  descripcion: "…",
  detalles: ["Tejido a mano", "…"],
  fotos: ["esmeralda-1", "esmeralda-2"],  // archivos de assets/img, sin .jpg
  estado: "disponible",          // disponible | a-pedido | agotado
  destacado: true,               // aparece en la página de inicio
  nuevo: false,                  // etiqueta "Nuevo"
},
```

## Agregar fotos nuevas

Las fotos del iPhone (HEIC) o JPG pesadas hay que optimizarlas para la web:

1. Poné las fotos en una carpeta y renombralas con un nombre claro,
   por ejemplo `collar-luna-1.HEIC`, `collar-luna-2.jpg`.
2. Ejecutá:
   ```bash
   python3 tools/convertir_fotos.py "/ruta/a/la/carpeta" assets/img
   ```
   Se crean `collar-luna-1.jpg` (grande) y `collar-luna-1-chica.jpg` (para la grilla).
3. En el producto, usá `fotos: ["collar-luna-1", "collar-luna-2"]`.

Requiere `ffmpeg` (versión 7.1 o más nueva, para las fotos HEIC del iPhone) y Python con Pillow.

## Cómo funciona el pedido por WhatsApp

- El cliente toca **+** o **Agregar al pedido**. El pedido queda guardado en su navegador.
- En **Mi pedido** puede cambiar cantidades, poner su nombre, elegir entrega y dejar un comentario.
- **Enviar pedido por WhatsApp** abre el chat con un mensaje así:

  ```
  ¡Hola Miver! Quiero hacer este pedido:

  • 1 x Pulsera Ámbar — $ 12.000
  • 2 x Collar Noche — $ 48.000

  *Total: $ 60.000*

  Nombre: Juana
  Entrega: Retiro en persona
  Comentarios: Es para regalo
  ```

- En cada producto también está el botón **Consultar por WhatsApp**.

## Estructura

```
index.html        Inicio (portada, categorías, destacados, sobre Miver, cómo comprar, FAQ, contacto)
catalogo.html     Catálogo con filtros, búsqueda y orden
producto.html     Ficha de producto (producto.html?id=…)
editor.html       Editor de productos (uso interno)
404.html          Página de error para cuando esté publicado
css/estilos.css   Estilos (colores y tipografías arriba de todo, en :root)
js/config.js      WhatsApp, Instagram, pagos, entregas
js/productos.js   Categorías y productos
js/app.js         Lógica (pedido, WhatsApp, catálogo). No hace falta tocarlo
assets/img/       Fotos optimizadas
tools/            Script para convertir fotos
_originales/      Fotos originales (no se publican)
```

## Publicarlo en internet (gratis), cuando esté listo

Como es estático, se puede publicar gratis en cualquiera de estos:

- **Netlify** (lo más simple): entrar a <https://app.netlify.com/drop> y arrastrar la
  carpeta del proyecto (sin `_originales`). Da una dirección tipo `miver.netlify.app`.
- **Cloudflare Pages** o **GitHub Pages**: conectando un repositorio de GitHub; cada
  cambio que se sube se publica solo.

Después se puede comprar un dominio propio (ej. `miveraccesorios.com.ar` en NIC Argentina)
y apuntarlo al sitio.

Antes de publicar conviene sacar `editor.html` o dejarlo: no expone nada, solo
funciona en el navegador de quien lo usa y no modifica el sitio publicado.
