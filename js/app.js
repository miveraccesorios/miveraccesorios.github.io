/* =========================================================
   MIVER · lógica del sitio
   - Arma encabezado, pie, panel de pedido y botón de WhatsApp
   - Pedido guardado en el navegador (localStorage)
   - Renderiza inicio, catálogo y ficha de producto
   No hace falta tocar este archivo para cambiar productos o precios:
   eso está en js/productos.js y js/config.js
   ========================================================= */
(function () {
  "use strict";

  const CONFIG = window.MIVER_CONFIG || {};
  const PRODUCTOS = window.MIVER_PRODUCTOS || [];
  const CATEGORIAS = window.MIVER_CATEGORIAS || [];
  const CLAVE_PEDIDO = "miver-pedido-v1";
  const CLAVE_DATOS = "miver-datos-cliente-v1";
  const WA_SIN_CONFIGURAR = !CONFIG.whatsapp || /^549?0+$/.test(CONFIG.whatsapp);

  /* ---------- Íconos ---------- */
  const ICONOS = {
    bolsa:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20.5L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    cerrar:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    izq: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
    der: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
    lupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>',
    destello:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1.5c.55 5.3 2.2 8.45 10.5 10.5C14.2 14.05 12.55 17.2 12 22.5 11.45 17.2 9.8 14.05 1.5 12 9.8 9.95 11.45 6.8 12 1.5Z"/></svg>',
    instagram:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/></svg>',
    whatsapp:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01Zm-7.01 15.24h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.22-8.23 8.22Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z"/></svg>',
    mano: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21c4.5 0 7-3 7-7.5V8.5a1.5 1.5 0 0 0-3 0V12"/><path d="M16 11V5.5a1.5 1.5 0 0 0-3 0V11"/><path d="M13 10.5V4a1.5 1.5 0 0 0-3 0v7"/><path d="M10 11V6.5a1.5 1.5 0 0 0-3 0V15l-1.6-1.9a1.6 1.6 0 0 0-2.5 2l2.9 3.6A6 6 0 0 0 10.4 21H12"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12Z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01" stroke-width="2.2"/></svg>',
    paquete:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z"/><path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9"/></svg>',
  };

  /* ---------- Utilidades ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const formateador = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: CONFIG.moneda || "ARS",
    maximumFractionDigits: 0,
  });
  const precio = (n) => formateador.format(n || 0);
  // Con precioDoble, cada par de unidades se cobra a ese precio (ej: 2 chokers)
  const subtotal = (p, cantidad) =>
    p.precioDoble ? Math.floor(cantidad / 2) * p.precioDoble + (cantidad % 2) * p.precio : p.precio * cantidad;
  const precioTexto = (p) => (p.precioDoble ? `${precio(p.precio)} / ${precio(p.precioDoble)}` : precio(p.precio));

  function esc(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  const img = (nombre, chica) => `assets/img/${nombre}${chica ? "-chica" : ""}.jpg`;
  const srcset = (nombre) => `${img(nombre, true)} 700w, ${img(nombre)} 1600w`;
  const urlProducto = (p) => `producto.html?id=${encodeURIComponent(p.id)}`;
  const buscarProducto = (id) => PRODUCTOS.find((p) => p.id === id);
  const nombreCategoria = (id) => (CATEGORIAS.find((c) => c.id === id) || {}).nombre || id;

  function linkWhatsApp(mensaje) {
    return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  }

  function leer(clave, porDefecto) {
    try {
      const v = localStorage.getItem(clave);
      return v ? JSON.parse(v) : porDefecto;
    } catch (e) {
      return porDefecto;
    }
  }

  function guardar(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch (e) {
      /* navegador sin almacenamiento: el pedido vive solo en esta pestaña */
    }
  }

  /* ---------- Pedido (carrito) ---------- */
  const Pedido = {
    items: leer(CLAVE_PEDIDO, []).filter((i) => buscarProducto(i.id)),
    oyentes: [],

    guardar() {
      guardar(CLAVE_PEDIDO, this.items);
      this.oyentes.forEach((fn) => fn());
    },
    agregar(id, cantidad = 1) {
      const p = buscarProducto(id);
      if (!p || p.estado === "agotado") return false;
      const item = this.items.find((i) => i.id === id);
      if (item) item.cantidad += cantidad;
      else this.items.push({ id, cantidad });
      this.guardar();
      return true;
    },
    cambiar(id, cantidad) {
      const item = this.items.find((i) => i.id === id);
      if (!item) return;
      item.cantidad = Math.max(0, cantidad);
      if (item.cantidad === 0) this.items = this.items.filter((i) => i.id !== id);
      this.guardar();
    },
    quitar(id) {
      this.items = this.items.filter((i) => i.id !== id);
      this.guardar();
    },
    vaciar() {
      this.items = [];
      this.guardar();
    },
    cantidadTotal() {
      return this.items.reduce((s, i) => s + i.cantidad, 0);
    },
    total() {
      return this.items.reduce((s, i) => s + subtotal(buscarProducto(i.id), i.cantidad), 0);
    },
    alCambiar(fn) {
      this.oyentes.push(fn);
    },
  };

  // Sincroniza el pedido si está abierto en otra pestaña
  window.addEventListener("storage", (e) => {
    if (e.key === CLAVE_PEDIDO) {
      Pedido.items = leer(CLAVE_PEDIDO, []).filter((i) => buscarProducto(i.id));
      Pedido.oyentes.forEach((fn) => fn());
    }
  });

  function mensajePedido(datos) {
    const lineas = [`¡Hola ${CONFIG.nombre}! Quiero hacer este pedido:`, ""];
    Pedido.items.forEach((i) => {
      const p = buscarProducto(i.id);
      const extra = p.estado === "a-pedido" ? " (a pedido)" : "";
      lineas.push(`• ${i.cantidad} x ${p.nombre}${extra} — ${precio(subtotal(p, i.cantidad))}`);
    });
    lineas.push("", `*Total: ${precio(Pedido.total())}*`, "");
    if (datos.nombre) lineas.push(`Nombre: ${datos.nombre}`);
    if (datos.entrega) lineas.push(`Entrega: ${datos.entrega}`);
    if (datos.comentarios) lineas.push(`Comentarios: ${datos.comentarios}`);
    return lineas.join("\n").trim();
  }

  const mensajeConsulta = (p) =>
    `¡Hola ${CONFIG.nombre}! Quería consultar por *${p.nombre}* (${precioTexto(p)}).\n${location.href.startsWith("http") ? location.href : ""}`.trim();

  /* ---------- Estructura común ---------- */
  function logoHTML(etiqueta = "a") {
    const href = etiqueta === "a" ? ' href="index.html"' : "";
    return `<${etiqueta} class="logo"${href} aria-label="${esc(CONFIG.nombre)} ${esc(CONFIG.bajada)} - inicio">
      <span class="logo__nombre" aria-hidden="true">M<span class="logo__i">ı${ICONOS.destello}</span>ver</span>
      <span class="logo__bajada" aria-hidden="true">${esc(CONFIG.bajada)}</span>
    </${etiqueta}>`;
  }

  function montarEstructura() {
    const pagina = document.body.dataset.pagina;
    const actual = (p) => (p === pagina ? ' aria-current="page"' : "");
    const links = `
      <a href="index.html"${actual("inicio")}>Inicio</a>
      <a href="catalogo.html"${actual("catalogo")}>Catálogo</a>
      <a href="index.html#como-comprar">Cómo comprar</a>
      <a href="index.html#contacto">Contacto</a>`;

    const aviso = WA_SIN_CONFIGURAR
      ? `<div class="aviso-config" role="note">Falta configurar el número de WhatsApp en <code>js/config.js</code> (este aviso desaparece al hacerlo).</div>`
      : "";

    document.body.insertAdjacentHTML(
      "afterbegin",
      `<a class="visualmente-oculto" href="#principal">Saltar al contenido</a>
      ${aviso}
      <header class="header" id="header">
        <div class="contenedor header__fila">
          <button class="icono-btn menu-btn" id="btn-menu" aria-label="Abrir menú" aria-expanded="false" aria-controls="menu-movil">${ICONOS.menu}</button>
          <nav class="nav" aria-label="Principal">${links}</nav>
          ${logoHTML()}
          <div class="header__acciones">
            <a class="icono-btn" href="catalogo.html" aria-label="Buscar en el catálogo">${ICONOS.lupa}</a>
            <button class="icono-btn" id="btn-pedido" aria-label="Ver mi pedido" aria-controls="pedido">
              ${ICONOS.bolsa}<span class="contador" id="contador" hidden>0</span>
            </button>
          </div>
        </div>
        <nav class="menu-movil" id="menu-movil" aria-label="Menú móvil">${links}</nav>
      </header>`
    );

    const redes = [];
    if (!WA_SIN_CONFIGURAR) redes.push(`<li><a href="${linkWhatsApp(`¡Hola ${CONFIG.nombre}!`)}" target="_blank" rel="noopener">WhatsApp</a></li>`);
    if (CONFIG.instagram) redes.push(`<li><a href="https://instagram.com/${esc(CONFIG.instagram)}" target="_blank" rel="noopener">Instagram @${esc(CONFIG.instagram)}</a></li>`);

    document.body.insertAdjacentHTML(
      "beforeend",
      `<footer class="footer">
        <div class="contenedor">
          <div class="footer__fila">
            <div>
              ${logoHTML("div")}
              <p>Accesorios tejidos a mano, pieza por pieza. Pedidos y consultas por WhatsApp.</p>
            </div>
            <div>
              <h4>Tienda</h4>
              <ul>
                ${CATEGORIAS.map((c) => `<li><a href="catalogo.html?categoria=${c.id}">${esc(c.nombre)}</a></li>`).join("")}
              </ul>
            </div>
            <div>
              <h4>Ayuda</h4>
              <ul>
                <li><a href="index.html#como-comprar">Cómo comprar</a></li>
                <li><a href="index.html#preguntas">Preguntas frecuentes</a></li>
                ${redes.join("")}
              </ul>
            </div>
          </div>
          <div class="footer__legal">
            <span>© ${new Date().getFullYear()} ${esc(CONFIG.nombre)} ${esc(CONFIG.bajada)}${CONFIG.ubicacion ? " · " + esc(CONFIG.ubicacion) : ""}</span>
            <span>Precios en pesos argentinos. Sujetos a cambios sin previo aviso.</span>
          </div>
        </div>
      </footer>

      <a class="wa-flotante" href="${linkWhatsApp(`¡Hola ${CONFIG.nombre}! Quería hacer una consulta.`)}" target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp">${ICONOS.whatsapp}</a>

      <div class="velo" id="velo"></div>
      <aside class="pedido" id="pedido" role="dialog" aria-modal="true" aria-labelledby="pedido-titulo" aria-hidden="true">
        <div class="pedido__cabecera">
          <h2 id="pedido-titulo">Mi pedido</h2>
          <button class="icono-btn" id="btn-cerrar-pedido" aria-label="Cerrar">${ICONOS.cerrar}</button>
        </div>
        <div class="pedido__cuerpo" id="pedido-cuerpo"></div>
        <div class="pedido__pie" id="pedido-pie"></div>
      </aside>

      <div class="toast" id="toast" role="status" aria-live="polite"></div>`
    );

    // Menú móvil
    const btnMenu = $("#btn-menu");
    const menu = $("#menu-movil");
    btnMenu.addEventListener("click", () => {
      const abierto = menu.classList.toggle("abierto");
      btnMenu.setAttribute("aria-expanded", abierto);
      btnMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
      btnMenu.innerHTML = abierto ? ICONOS.cerrar : ICONOS.menu;
    });
    $$("a", menu).forEach((a) =>
      a.addEventListener("click", () => {
        menu.classList.remove("abierto");
        btnMenu.setAttribute("aria-expanded", "false");
        btnMenu.innerHTML = ICONOS.menu;
      })
    );

    // Borde del header al hacer scroll
    const header = $("#header");
    const alScroll = () => header.classList.toggle("con-borde", window.scrollY > 8);
    window.addEventListener("scroll", alScroll, { passive: true });
    alScroll();

    $("#btn-pedido").addEventListener("click", abrirPedido);
    $("#btn-cerrar-pedido").addEventListener("click", cerrarPedido);
    $("#velo").addEventListener("click", cerrarPedido);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && $("#pedido").classList.contains("abierto")) cerrarPedido();
    });

    // Delegación: cualquier botón con data-agregar suma al pedido
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-agregar]");
      if (!btn) return;
      e.preventDefault();
      const id = btn.dataset.agregar;
      const cantidad = parseInt(btn.dataset.cantidad || "1", 10);
      if (Pedido.agregar(id, cantidad)) mostrarToast(buscarProducto(id), cantidad);
    });

    Pedido.alCambiar(renderPedido);
    renderPedido();
  }

  /* ---------- Panel del pedido ---------- */
  let ultimoFoco = null;

  function abrirPedido() {
    ultimoFoco = document.activeElement;
    const panel = $("#pedido");
    panel.classList.add("abierto");
    panel.setAttribute("aria-hidden", "false");
    $("#velo").classList.add("visible");
    document.body.classList.add("sin-scroll");
    ocultarToast();
    setTimeout(() => $("#btn-cerrar-pedido").focus(), 50);
  }

  function cerrarPedido() {
    const panel = $("#pedido");
    panel.classList.remove("abierto");
    panel.setAttribute("aria-hidden", "true");
    $("#velo").classList.remove("visible");
    document.body.classList.remove("sin-scroll");
    if (ultimoFoco) ultimoFoco.focus();
  }

  // Mantiene el foco del teclado dentro del panel mientras está abierto
  document.addEventListener("keydown", (e) => {
    const panel = $("#pedido");
    if (e.key !== "Tab" || !panel || !panel.classList.contains("abierto")) return;
    const focos = $$('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])', panel).filter((el) => !el.disabled);
    if (!focos.length) return;
    const primero = focos[0];
    const ultimo = focos[focos.length - 1];
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  });

  function renderPedido() {
    const cantidad = Pedido.cantidadTotal();
    const contador = $("#contador");
    if (contador) {
      const antes = contador.textContent;
      contador.textContent = cantidad;
      contador.hidden = cantidad === 0;
      if (antes !== String(cantidad) && cantidad > 0) {
        contador.classList.remove("salta");
        void contador.offsetWidth;
        contador.classList.add("salta");
      }
    }

    const cuerpo = $("#pedido-cuerpo");
    const pie = $("#pedido-pie");
    if (!cuerpo) return;

    if (!Pedido.items.length) {
      cuerpo.innerHTML = `<div class="pedido__vacio">
        ${ICONOS.bolsa}
        <p>Todavía no agregaste nada a tu pedido.</p>
        <a class="btn" href="catalogo.html">Ver catálogo</a>
      </div>`;
      pie.innerHTML = "";
      pie.hidden = true;
      return;
    }

    pie.hidden = false;
    const datos = leer(CLAVE_DATOS, {});
    const opciones = (CONFIG.opcionesEntrega || [])
      .map((o) => `<option${datos.entrega === o ? " selected" : ""}>${esc(o)}</option>`)
      .join("");

    cuerpo.innerHTML = `
      <ul style="list-style:none;margin:0;padding:0">
        ${Pedido.items
          .map((i) => {
            const p = buscarProducto(i.id);
            return `<li class="item">
              <a href="${urlProducto(p)}"><img src="${img(p.fotos[0], true)}" alt="" loading="lazy"></a>
              <div>
                <a class="item__nombre" href="${urlProducto(p)}">${esc(p.nombre)}</a>
                <div class="item__precio">${precioTexto(p)}${p.estado === "a-pedido" ? " · a pedido" : ""}</div>
                <div class="cantidad" role="group" aria-label="Cantidad de ${esc(p.nombre)}">
                  <button type="button" data-menos="${p.id}" aria-label="Restar uno">−</button>
                  <span aria-live="polite">${i.cantidad}</span>
                  <button type="button" data-mas="${p.id}" aria-label="Sumar uno">+</button>
                </div>
              </div>
              <div>
                <div class="item__subtotal">${precio(subtotal(p, i.cantidad))}</div>
                <button type="button" class="item__quitar" data-quitar="${p.id}">Quitar</button>
              </div>
            </li>`;
          })
          .join("")}
      </ul>
      <div class="pedido__datos">
        <div class="campo">
          <label for="dato-nombre">Tu nombre</label>
          <input id="dato-nombre" name="nombre" autocomplete="name" value="${esc(datos.nombre || "")}" placeholder="Opcional">
        </div>
        <div class="campo">
          <label for="dato-entrega">Entrega</label>
          <select id="dato-entrega" name="entrega">${opciones}</select>
        </div>
        <div class="campo">
          <label for="dato-comentarios">Comentarios</label>
          <textarea id="dato-comentarios" name="comentarios" placeholder="Ej: es para regalo, zona de entrega, color alternativo…">${esc(datos.comentarios || "")}</textarea>
        </div>
      </div>`;

    pie.innerHTML = `
      <div class="pedido__total"><span>Total</span><strong>${precio(Pedido.total())}</strong></div>
      <p class="pedido__nota">Al enviar se abre WhatsApp con tu pedido listo. Ahí coordinamos pago y entrega.</p>
      <a class="btn btn--wa btn--bloque" id="btn-enviar" href="#" target="_blank" rel="noopener">${ICONOS.whatsapp} Enviar pedido por WhatsApp</a>
      <button type="button" class="pedido__vaciar" id="btn-vaciar">Vaciar pedido</button>`;

    const leerDatos = () => ({
      nombre: $("#dato-nombre").value.trim(),
      entrega: $("#dato-entrega").value,
      comentarios: $("#dato-comentarios").value.trim(),
    });
    const actualizarLink = () => {
      const d = leerDatos();
      guardar(CLAVE_DATOS, d);
      $("#btn-enviar").href = linkWhatsApp(mensajePedido(d));
    };
    $$("#dato-nombre, #dato-entrega, #dato-comentarios").forEach((el) => el.addEventListener("input", actualizarLink));
    actualizarLink();

    $$("[data-menos]", cuerpo).forEach((b) =>
      b.addEventListener("click", () => {
        const item = Pedido.items.find((i) => i.id === b.dataset.menos);
        Pedido.cambiar(item.id, item.cantidad - 1);
        enfocar(`[data-menos="${item.id}"]`);
      })
    );
    $$("[data-mas]", cuerpo).forEach((b) =>
      b.addEventListener("click", () => {
        const item = Pedido.items.find((i) => i.id === b.dataset.mas);
        Pedido.cambiar(item.id, item.cantidad + 1);
        enfocar(`[data-mas="${item.id}"]`);
      })
    );
    $$("[data-quitar]", cuerpo).forEach((b) => b.addEventListener("click", () => Pedido.quitar(b.dataset.quitar)));
    $("#btn-vaciar").addEventListener("click", () => {
      if (confirm("¿Vaciar todo el pedido?")) Pedido.vaciar();
    });
    $("#btn-enviar").addEventListener("click", (e) => {
      if (WA_SIN_CONFIGURAR) {
        e.preventDefault();
        alert("Todavía no está configurado el número de WhatsApp (js/config.js).\n\nEste es el mensaje que se enviaría:\n\n" + mensajePedido(leerDatos()));
      }
    });
  }

  // Después de re-renderizar, devuelve el foco al botón equivalente (si existe)
  function enfocar(selector) {
    const el = $(selector, $("#pedido-cuerpo"));
    if (el) el.focus();
    else $("#btn-cerrar-pedido").focus();
  }

  /* ---------- Toast ---------- */
  let temporizadorToast;

  function mostrarToast(p, cantidad) {
    const t = $("#toast");
    t.innerHTML = `<img src="${img(p.fotos[0], true)}" alt="">
      <span>${cantidad > 1 ? cantidad + " × " : ""}${esc(p.nombre)} se agregó a tu pedido</span>
      <button type="button">Ver pedido</button>`;
    $("button", t).addEventListener("click", abrirPedido);
    t.classList.add("visible");
    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(ocultarToast, 3500);
  }

  function ocultarToast() {
    const t = $("#toast");
    if (t) t.classList.remove("visible");
  }

  /* ---------- Tarjeta de producto ---------- */
  function etiquetasHTML(p) {
    const e = [];
    if (p.estado === "agotado") e.push('<span class="etiqueta etiqueta--agotado">Agotado</span>');
    else if (p.estado === "a-pedido") e.push('<span class="etiqueta etiqueta--pedido">A pedido</span>');
    if (p.nuevo) e.push('<span class="etiqueta etiqueta--nuevo">Nuevo</span>');
    if (p.precioAntes && p.precioAntes > p.precio) e.push('<span class="etiqueta etiqueta--oferta">Oferta</span>');
    return e.length ? `<div class="etiquetas">${e.join("")}</div>` : "";
  }

  function precioHTML(p) {
    const antes = p.precioAntes && p.precioAntes > p.precio ? `<s>${precio(p.precioAntes)}</s>` : "";
    return `<span class="precio">${precioTexto(p)}${antes}</span>`;
  }

  function tarjetaHTML(p) {
    const segunda = p.fotos[1]
      ? `<img class="img-alt" src="${img(p.fotos[1], true)}" alt="" loading="lazy" aria-hidden="true">`
      : "";
    const boton =
      p.estado === "agotado"
        ? ""
        : `<button class="tarjeta__agregar" type="button" data-agregar="${p.id}" aria-label="Agregar ${esc(p.nombre)} al pedido">${ICONOS.mas}</button>`;
    return `<article class="tarjeta${p.estado === "agotado" ? " agotado" : ""}">
      <div class="tarjeta__imagen">
        ${etiquetasHTML(p)}
        <img src="${img(p.fotos[0], true)}" srcset="${srcset(p.fotos[0])}" sizes="(max-width: 700px) 50vw, 25vw" alt="${esc(p.nombre)}" loading="lazy">
        ${segunda}
        ${boton}
      </div>
      <div class="tarjeta__info">
        <div class="tarjeta__categoria">${esc(nombreCategoria(p.categoria))}</div>
        <h3 class="tarjeta__nombre"><a href="${urlProducto(p)}">${esc(p.nombre)}</a></h3>
        ${precioHTML(p)}
      </div>
    </article>`;
  }

  /* ---------- Página: inicio ---------- */
  function paginaInicio() {
    const cats = $("#categorias");
    if (cats) {
      cats.innerHTML = CATEGORIAS.map((c) => {
        const n = PRODUCTOS.filter((p) => p.categoria === c.id).length;
        return `<a class="categoria aparece" href="catalogo.html?categoria=${c.id}">
          <img src="${img(c.foto, true)}" alt="" loading="lazy">
          <span class="categoria__nombre"><strong>${esc(c.nombre)}</strong><span>${n} ${n === 1 ? "modelo" : "modelos"}</span></span>
        </a>`;
      }).join("");
    }

    const dest = $("#destacados");
    if (dest) {
      let lista = PRODUCTOS.filter((p) => p.destacado);
      if (lista.length < 4) lista = lista.concat(PRODUCTOS.filter((p) => !p.destacado)).slice(0, 4);
      dest.innerHTML = lista.slice(0, 8).map(tarjetaHTML).join("");
    }

    // Textos que vienen de la configuración
    $$("[data-config]").forEach((el) => {
      const v = CONFIG[el.dataset.config];
      if (v) el.textContent = v;
    });
    $$("[data-icono]").forEach((el) => (el.outerHTML = ICONOS[el.dataset.icono] || ""));
    $$("[data-wa]").forEach((a) => {
      a.href = linkWhatsApp(a.dataset.wa || `¡Hola ${CONFIG.nombre}!`);
      a.target = "_blank";
      a.rel = "noopener";
    });
    $$("[data-instagram]").forEach((a) => {
      if (CONFIG.instagram) a.href = `https://instagram.com/${CONFIG.instagram}`;
      else a.remove();
    });
  }

  /* ---------- Página: catálogo ---------- */
  function paginaCatalogo() {
    const params = new URLSearchParams(location.search);
    const estado = {
      categoria: CATEGORIAS.some((c) => c.id === params.get("categoria")) ? params.get("categoria") : "todos",
      orden: params.get("orden") || "destacados",
      busqueda: params.get("q") || "",
    };

    const chips = $("#chips");
    const grilla = $("#grilla");
    const info = $("#resultado-info");
    const inputBusqueda = $("#busqueda");
    const selectOrden = $("#orden");
    inputBusqueda.value = estado.busqueda;
    selectOrden.value = estado.orden;

    function renderChips() {
      const opciones = [{ id: "todos", nombre: "Todos" }].concat(CATEGORIAS);
      chips.innerHTML = opciones
        .map((c) => {
          const n = c.id === "todos" ? PRODUCTOS.length : PRODUCTOS.filter((p) => p.categoria === c.id).length;
          return `<button class="chip" type="button" data-cat="${c.id}" aria-pressed="${estado.categoria === c.id}">${esc(c.nombre)}<small>${n}</small></button>`;
        })
        .join("");
    }

    const normalizar = (s) =>
      String(s)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    function render() {
      let lista = PRODUCTOS.slice();
      if (estado.categoria !== "todos") lista = lista.filter((p) => p.categoria === estado.categoria);
      if (estado.busqueda) {
        const q = normalizar(estado.busqueda);
        lista = lista.filter((p) =>
          normalizar([p.nombre, p.descripcion, nombreCategoria(p.categoria), (p.detalles || []).join(" ")].join(" ")).includes(q)
        );
      }
      const pesoEstado = (p) => (p.estado === "agotado" ? 1 : 0);
      const ordenes = {
        destacados: (a, b) => pesoEstado(a) - pesoEstado(b) || (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0) || (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0),
        "precio-asc": (a, b) => a.precio - b.precio,
        "precio-desc": (a, b) => b.precio - a.precio,
        nombre: (a, b) => a.nombre.localeCompare(b.nombre, "es"),
      };
      lista.sort(ordenes[estado.orden] || ordenes.destacados);

      info.textContent = `${lista.length} ${lista.length === 1 ? "producto" : "productos"}`;
      grilla.innerHTML = lista.length
        ? lista.map(tarjetaHTML).join("")
        : `<div class="sin-resultados" style="grid-column:1/-1">
            <h3>No encontramos productos</h3>
            <p>Probá con otra búsqueda o escribinos: hacemos piezas a pedido.</p>
            <a class="btn btn--borde" href="${linkWhatsApp(`¡Hola ${CONFIG.nombre}! Estoy buscando: ${estado.busqueda}`)}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
          </div>`;

      const titulo = $("#titulo-catalogo");
      if (titulo) titulo.textContent = estado.categoria === "todos" ? "Catálogo" : nombreCategoria(estado.categoria);

      // Mantener la URL actualizada (para compartir el link filtrado)
      const p = new URLSearchParams();
      if (estado.categoria !== "todos") p.set("categoria", estado.categoria);
      if (estado.orden !== "destacados") p.set("orden", estado.orden);
      if (estado.busqueda) p.set("q", estado.busqueda);
      const nueva = `${location.pathname}${p.toString() ? "?" + p : ""}`;
      try {
        history.replaceState(null, "", nueva);
      } catch (e) {
        /* algunos navegadores bloquean replaceState en file:// */
      }
    }

    chips.addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]");
      if (!b) return;
      estado.categoria = b.dataset.cat;
      renderChips();
      render();
    });
    selectOrden.addEventListener("change", () => {
      estado.orden = selectOrden.value;
      render();
    });
    let espera;
    inputBusqueda.addEventListener("input", () => {
      clearTimeout(espera);
      espera = setTimeout(() => {
        estado.busqueda = inputBusqueda.value.trim();
        render();
      }, 150);
    });

    renderChips();
    render();
  }

  /* ---------- Página: producto ---------- */
  // Canónica y datos estructurados (schema.org) para que Google muestre precio y stock
  function datosParaBuscadores(p) {
    const base = "https://miver.com.ar/";
    const canonica = document.createElement("link");
    canonica.rel = "canonical";
    canonica.href = base + urlProducto(p);
    document.head.appendChild(canonica);

    const disponibilidad = {
      disponible: "https://schema.org/InStock",
      "a-pedido": "https://schema.org/PreOrder",
      agotado: "https://schema.org/OutOfStock",
    };
    const datos = document.createElement("script");
    datos.type = "application/ld+json";
    datos.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.nombre,
      description: p.descripcion,
      image: p.fotos.map((f) => base + img(f)),
      category: nombreCategoria(p.categoria),
      brand: { "@type": "Brand", name: `${CONFIG.nombre} ${CONFIG.bajada}` },
      offers: {
        "@type": "Offer",
        url: base + urlProducto(p),
        price: p.precio,
        priceCurrency: CONFIG.moneda || "ARS",
        availability: disponibilidad[p.estado] || disponibilidad.disponible,
      },
    });
    document.head.appendChild(datos);
  }

  function paginaProducto() {
    const cont = $("#producto");
    const id = new URLSearchParams(location.search).get("id");
    const p = buscarProducto(id);

    if (!p) {
      document.title = `Producto no encontrado · ${CONFIG.nombre}`;
      cont.innerHTML = `<div class="no-encontrado">
        <h1>No encontramos este producto</h1>
        <p>Puede que ya no esté disponible. Mirá el resto del catálogo.</p>
        <a class="btn" href="catalogo.html">Ir al catálogo</a>
      </div>`;
      return;
    }

    document.title = `${p.nombre} · ${CONFIG.nombre} ${CONFIG.bajada}`;
    const meta = $('meta[name="description"]');
    if (meta) meta.content = p.descripcion;
    datosParaBuscadores(p);

    const estados = {
      disponible: "Disponible",
      "a-pedido": "A pedido · consultá la demora",
      agotado: "Agotado por ahora",
    };
    const varias = p.fotos.length > 1;
    let fotoActual = 0;
    let cantidad = 1;

    const compra =
      p.estado === "agotado"
        ? `<a class="btn btn--wa btn--bloque" href="${linkWhatsApp(`¡Hola ${CONFIG.nombre}! ¿Van a volver a tener *${p.nombre}*?`)}" target="_blank" rel="noopener">${ICONOS.whatsapp} Avisame cuando vuelva</a>`
        : `<div class="producto__compra">
            <div class="cantidad cantidad--grande" role="group" aria-label="Cantidad">
              <button type="button" id="cant-menos" aria-label="Restar uno">−</button>
              <span id="cant-valor" aria-live="polite">1</span>
              <button type="button" id="cant-mas" aria-label="Sumar uno">+</button>
            </div>
            <button class="btn" type="button" id="btn-agregar" data-agregar="${p.id}" data-cantidad="1">${ICONOS.bolsa} Agregar al pedido</button>
          </div>
          <a class="btn btn--borde btn--bloque" href="${linkWhatsApp(mensajeConsulta(p))}" target="_blank" rel="noopener">${ICONOS.whatsapp} Consultar por WhatsApp</a>`;

    cont.innerHTML = `
      <nav class="migas" aria-label="Ruta">
        <a href="index.html">Inicio</a><span aria-hidden="true">/</span>
        <a href="catalogo.html?categoria=${p.categoria}">${esc(nombreCategoria(p.categoria))}</a><span aria-hidden="true">/</span>
        <span aria-current="page">${esc(p.nombre)}</span>
      </nav>
      <div class="producto">
        <div class="galeria${varias ? "" : " galeria--una"}">
          ${
            varias
              ? `<div class="galeria__miniaturas">${p.fotos
                  .map((f, i) => `<button type="button" data-foto="${i}" aria-label="Ver foto ${i + 1}"${i === 0 ? ' aria-current="true"' : ""}><img src="${img(f, true)}" alt=""></button>`)
                  .join("")}</div>`
              : ""
          }
          <div>
            <div style="position:relative">
              <button class="galeria__principal" type="button" id="foto-principal" aria-label="Ampliar foto">
                ${etiquetasHTML(p)}
                <img src="${img(p.fotos[0])}" alt="${esc(p.nombre)}">
              </button>
              ${varias ? `<button class="galeria__flecha galeria__flecha--izq" type="button" data-paso="-1" aria-label="Foto anterior">${ICONOS.izq}</button><button class="galeria__flecha galeria__flecha--der" type="button" data-paso="1" aria-label="Foto siguiente">${ICONOS.der}</button>` : ""}
            </div>
            ${varias ? `<div class="galeria__puntos">${p.fotos.map((_, i) => `<button type="button" data-foto="${i}" aria-label="Foto ${i + 1}"${i === 0 ? ' aria-current="true"' : ""}></button>`).join("")}</div>` : ""}
          </div>
        </div>
        <div class="producto__info">
          <span class="antetitulo">${esc(nombreCategoria(p.categoria))}</span>
          <h1>${esc(p.nombre)}</h1>
          <div class="producto__precio">${precioHTML(p)}</div>
          ${p.notaPrecio ? `<p class="producto__nota-precio">${esc(p.notaPrecio)}</p>` : ""}
          <div class="producto__estado producto__estado--${p.estado}">${estados[p.estado] || ""}</div>
          <p class="producto__descripcion">${esc(p.descripcion)}</p>
          ${(p.detalles || []).length ? `<ul class="producto__detalles">${p.detalles.map((d) => `<li>${ICONOS.destello}${esc(d)}</li>`).join("")}</ul>` : ""}
          ${compra}
          <div class="producto__ayuda">
            <p><strong>¿Cómo compro?</strong> Agregá lo que te guste a tu pedido y envialo por WhatsApp. Ahí coordinamos pago y entrega.</p>
            ${CONFIG.mediosDePago ? `<p><strong>Pago:</strong> ${esc(CONFIG.mediosDePago)}</p>` : ""}
            ${CONFIG.entregas ? `<p><strong>Entrega:</strong> ${esc(CONFIG.entregas)}</p>` : ""}
          </div>
        </div>
      </div>
      <div class="visor" id="visor" role="dialog" aria-modal="true" aria-label="Foto ampliada">
        <button class="icono-btn visor__cerrar" type="button" id="visor-cerrar" aria-label="Cerrar">${ICONOS.cerrar}</button>
        ${varias ? `<button class="galeria__flecha galeria__flecha--izq" type="button" data-paso="-1" aria-label="Foto anterior">${ICONOS.izq}</button>` : ""}
        <img id="visor-img" src="" alt="${esc(p.nombre)}">
        ${varias ? `<button class="galeria__flecha galeria__flecha--der" type="button" data-paso="1" aria-label="Foto siguiente">${ICONOS.der}</button>` : ""}
      </div>`;

    // Galería
    const principal = $("#foto-principal img");
    const visor = $("#visor");
    function irA(i) {
      fotoActual = (i + p.fotos.length) % p.fotos.length;
      principal.src = img(p.fotos[fotoActual]);
      $("#visor-img").src = img(p.fotos[fotoActual]);
      $$("[data-foto]", cont).forEach((b) => b.setAttribute("aria-current", String(Number(b.dataset.foto) === fotoActual)));
    }
    $$("[data-foto]", cont).forEach((b) => b.addEventListener("click", () => irA(Number(b.dataset.foto))));
    $$("[data-paso]", cont).forEach((b) => b.addEventListener("click", () => irA(fotoActual + Number(b.dataset.paso))));

    // Deslizar con el dedo en celulares
    let inicioX = null;
    let seDeslizo = false;
    const zonaSwipe = $("#foto-principal");
    zonaSwipe.addEventListener("touchstart", (e) => (inicioX = e.touches[0].clientX), { passive: true });
    zonaSwipe.addEventListener("touchend", (e) => {
      if (inicioX === null || !varias) return;
      const dx = e.changedTouches[0].clientX - inicioX;
      if (Math.abs(dx) > 40) {
        irA(fotoActual + (dx < 0 ? 1 : -1));
        seDeslizo = true;
        setTimeout(() => (seDeslizo = false), 400);
      }
      inicioX = null;
    });

    // Visor ampliado
    zonaSwipe.addEventListener("click", () => {
      if (seDeslizo) return;
      $("#visor-img").src = img(p.fotos[fotoActual]);
      visor.classList.add("abierto");
      document.body.classList.add("sin-scroll");
      $("#visor-cerrar").focus();
    });
    const cerrarVisor = () => {
      visor.classList.remove("abierto");
      document.body.classList.remove("sin-scroll");
      zonaSwipe.focus();
    };
    $("#visor-cerrar").addEventListener("click", cerrarVisor);
    visor.addEventListener("click", (e) => {
      if (e.target === visor) cerrarVisor();
    });
    document.addEventListener("keydown", (e) => {
      if (!visor.classList.contains("abierto")) return;
      if (e.key === "Escape") cerrarVisor();
      if (e.key === "ArrowRight") irA(fotoActual + 1);
      if (e.key === "ArrowLeft") irA(fotoActual - 1);
    });

    // Cantidad
    if (p.estado !== "agotado") {
      const btnAgregar = $("#btn-agregar");
      const actualizar = () => {
        $("#cant-valor").textContent = cantidad;
        btnAgregar.dataset.cantidad = cantidad;
      };
      $("#cant-menos").addEventListener("click", () => {
        cantidad = Math.max(1, cantidad - 1);
        actualizar();
      });
      $("#cant-mas").addEventListener("click", () => {
        cantidad = Math.min(20, cantidad + 1);
        actualizar();
      });
    }

    // Relacionados: misma categoría primero, después el resto
    const rel = PRODUCTOS.filter((x) => x.id !== p.id && x.categoria === p.categoria)
      .concat(PRODUCTOS.filter((x) => x.id !== p.id && x.categoria !== p.categoria && x.destacado))
      .slice(0, 4);
    const contRel = $("#relacionados");
    if (contRel && rel.length) contRel.innerHTML = rel.map(tarjetaHTML).join("");
    else if (contRel) contRel.closest("section").remove();
  }

  /* ---------- Animaciones de aparición ---------- */
  function animarAparicion() {
    const elementos = $$(".aparece");
    if (!("IntersectionObserver" in window)) {
      elementos.forEach((el) => el.classList.add("visible"));
      return;
    }
    const obs = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("visible");
            obs.unobserve(en.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    elementos.forEach((el) => obs.observe(el));
  }

  /* ---------- Arranque ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    montarEstructura();
    const pagina = document.body.dataset.pagina;
    if (pagina === "inicio") paginaInicio();
    if (pagina === "catalogo") paginaCatalogo();
    if (pagina === "producto") paginaProducto();
    animarAparicion();
    if (WA_SIN_CONFIGURAR) console.warn("[Miver] Configurá el número de WhatsApp en js/config.js");
  });

  // Expuesto para depurar desde la consola del navegador
  window.MiverPedido = Pedido;
})();
