// =====================
// Base
// =====================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Menu mobile
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
if (menuBtn && menu) {
  menuBtn.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });
  menu.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.tagName === "A") {
      menu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
}

// =====================
// Helpers
// =====================
function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function moneyBRL(n) {
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
  } catch {
    return `R$ ${Number(n).toFixed(2)}`;
  }
}

function svgPlaceholder(title, subtitle = "Sem imagem") {
  const safeTitle = String(title).replace(/[<>&"]/g, "");
  const safeSub = String(subtitle).replace(/[<>&"]/g, "");
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#7c5cff" stop-opacity="0.65"/>
        <stop offset="1" stop-color="#22c55e" stop-opacity="0.35"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="#0b1220"/>
    <rect x="40" y="40" width="1120" height="670" rx="36" fill="url(#g)" opacity="0.35"/>
    <text x="90" y="340" fill="rgba(255,255,255,0.92)" font-size="64" font-family="Arial, sans-serif" font-weight="700">
      ${safeTitle}
    </text>
    <text x="90" y="410" fill="rgba(255,255,255,0.70)" font-size="30" font-family="Arial, sans-serif">
      ${safeSub}
    </text>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

// =====================
// Gallery PRO + Upload + Modal + Favorites + URL state
// =====================
const STORAGE_KEY = "necklas_gallery_items_v2";
const FAV_KEY = "necklas_favs_v1";

const galleryEl = document.getElementById("gallery");
const filterBarEl = document.getElementById("filterBar");
const counterEl = document.getElementById("counter");
const searchInputEl = document.getElementById("searchInput");
const sortSelectEl = document.getElementById("sortSelect");
const favoritesToggleEl = document.getElementById("favoritesToggle");

const addFormEl = document.getElementById("addForm");
const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn");

// Modal
const modalEl = document.getElementById("modal");
const modalImgEl = document.getElementById("modalImg");
const modalMetaEl = document.getElementById("modalMeta");
const modalTitleEl = document.getElementById("modalTitle");
const modalDescEl = document.getElementById("modalDesc");
const modalListEl = document.getElementById("modalList");
const modalLinksEl = document.getElementById("modalLinks");
const modalAdminEl = document.getElementById("modalAdmin");

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let favorites = new Set(loadJSON(FAV_KEY, []));
function saveFavs() { saveJSON(FAV_KEY, [...favorites]); }
function isFav(id) { return favorites.has(id); }
function toggleFav(id) {
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  saveFavs();
}

let customItems = loadJSON(STORAGE_KEY, []);
if (!Array.isArray(customItems)) customItems = [];

const baseItems = [
  // Aether Shift
  {
    id: "aether-shift-logo-sa",
    title: "Aether Shift — Logo (SA)",
    category: "Aether Shift",
    status: "Identidade",
    date: "2026",
    createdAt: 10,
    image: "assets/aether-shift-logo-sa.jpg",
    description: "Monograma principal (SA). Minimalismo premium e assinatura da marca.",
    bullets: ["Aplicação premium: bordado pequeno/peito/etiqueta/boné.", "Reconhecimento sem poluição visual."],
    links: [],
    custom: false
  },
  {
    id: "aether-shift-wordmark",
    title: "Aether Shift — Wordmark",
    category: "Aether Shift",
    status: "Identidade",
    date: "2026",
    createdAt: 9,
    image: "assets/aether-shift-wordmark.jpg",
    description: "Nome da marca para reforço oficial (campanha, embalagem, assinatura).",
    bullets: ["Reforça marca quando o símbolo não basta.", "Base de consistência para o digital."],
    links: [],
    custom: false
  },
  {
    id: "aether-shift-cap",
    title: "Aether Shift — Boné (mockup)",
    category: "Aether Shift",
    status: "Mockup",
    date: "2026",
    createdAt: 8,
    image: "assets/aether-shift-cap.jpg",
    description: "Assinatura discreta: SA na frente + nome em pontos secundários.",
    bullets: ["Minimalista e reconhecível.", "Peça de presença no dia a dia."],
    links: [],
    custom: false
  },
  {
    id: "aether-shift-hoodie-mockups",
    title: "Aether Shift — Moletom (mockups)",
    category: "Aether Shift",
    status: "Mockup",
    date: "2026",
    createdAt: 7,
    image: "assets/aether-shift-hoodie-mockups.jpg",
    description: "Direção do Drop 01: clean com SA e variações com wordmark.",
    bullets: ["Peça-chave do drop (presença).", "Marca bem posicionada, sem exagero."],
    links: [],
    custom: false
  },
  {
    id: "aether-shift-tee-mockups",
    title: "Aether Shift — Camiseta (mockups)",
    category: "Aether Shift",
    status: "Mockup",
    date: "2026",
    createdAt: 6,
    image: "assets/aether-shift-tee-mockups.jpg",
    description: "Camiseta base do Drop 01 com variações de assinatura (minimal/destaque).",
    bullets: ["Uniforme do construtor: simples e forte.", "Define a assinatura visual da marca."],
    links: [],
    custom: false
  },
  {
    id: "aether-shift-backprint",
    title: "Aether Shift — Costas (mockup)",
    category: "Aether Shift",
    status: "Mockup",
    date: "2026",
    createdAt: 5,
    image: "assets/aether-shift-backprint.jpg",
    description: "Story piece: frente limpa, costas comunicam (narrativa do drop).",
    bullets: ["Perfeita para campanha/foto.", "Cria conversa e storytelling."],
    links: [],
    custom: false
  },

  // Mizuryu (placeholder)
  {
    id: "mizuryu-conceito",
    title: "Mizuryu — Dragão da Água (conceito)",
    category: "Mizuryu",
    status: "Conceito",
    date: "Futuro",
    createdAt: 4,
    image: svgPlaceholder("Mizuryu", "Time • disciplina • evolução"),
    description: "Projeto de time de vôlei conectado ao ecossistema: alto desempenho + identidade.",
    bullets: ["Dragão = poder, ambição e domínio.", "Água = adaptação, fluidez e movimento constante."],
    links: [{ label: "Contato", url: "mailto:necklas.contact@gmail.com?subject=Mizuryu%20-%20Contato" }],
    custom: false
  },

  // Tech (placeholder)
  {
    id: "portfolio-site",
    title: "Portfólio — Website",
    category: "Tech",
    status: "Ativo",
    date: "2026",
    createdAt: 3,
    image: svgPlaceholder("Portfólio", "HTML • CSS • JS"),
    description: "Este site: galeria interativa + modal + upload + carrinho simulado + brand kit.",
    bullets: ["Responsivo e simples de manter.", "Publicação via GitHub Pages."],
    links: [{ label: "GitHub", url: "https://github.com/NecklazTheOffice" }],
    custom: false
  }
];

const state = {
  filter: "Todos",
  search: "",
  sort: "featured",
  favoritesOnly: false
};

function applyUrlState() {
  const url = new URL(location.href);
  const f = url.searchParams.get("filter");
  const q = url.searchParams.get("q");
  const sort = url.searchParams.get("sort");
  const fav = url.searchParams.get("fav");

  if (f) state.filter = f;
  if (q) state.search = q;
  if (sort) state.sort = sort;
  if (fav === "1") state.favoritesOnly = true;

  if (searchInputEl) searchInputEl.value = state.search;
  if (sortSelectEl) sortSelectEl.value = state.sort;
  if (favoritesToggleEl) favoritesToggleEl.setAttribute("aria-pressed", String(state.favoritesOnly));
}

function syncUrl() {
  const url = new URL(location.href);

  if (state.filter && state.filter !== "Todos") url.searchParams.set("filter", state.filter);
  else url.searchParams.delete("filter");

  if (state.search) url.searchParams.set("q", state.search);
  else url.searchParams.delete("q");

  if (state.sort && state.sort !== "featured") url.searchParams.set("sort", state.sort);
  else url.searchParams.delete("sort");

  if (state.favoritesOnly) url.searchParams.set("fav", "1");
  else url.searchParams.delete("fav");

  history.replaceState(null, "", url);
}

function allItems() {
  return [...baseItems, ...customItems];
}

function getCategories() {
  const cats = Array.from(new Set(allItems().map((i) => i.category)));
  return ["Todos", ...cats];
}

function renderFilters() {
  if (!filterBarEl) return;
  const categories = getCategories();
  filterBarEl.innerHTML = "";

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.type = "button";
    btn.textContent = cat;
    btn.setAttribute("aria-pressed", String(cat === state.filter));

    btn.addEventListener("click", () => {
      state.filter = cat;
      renderFilters();
      renderGallery();
      syncUrl();
    });

    filterBarEl.appendChild(btn);
  });
}

function matchesSearch(item, query) {
  const q = query.toLowerCase();
  return [item.title, item.description, item.category, item.status, item.date]
    .some((v) => String(v || "").toLowerCase().includes(q));
}

function getFilteredItems() {
  let items = allItems();

  if (state.filter !== "Todos") items = items.filter((i) => i.category === state.filter);
  if (state.favoritesOnly) items = items.filter((i) => isFav(i.id));
  if (state.search) items = items.filter((i) => matchesSearch(i, state.search));

  if (state.sort === "newest") items = [...items].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  if (state.sort === "titleAsc") items = [...items].sort((a, b) => a.title.localeCompare(b.title));
  if (state.sort === "titleDesc") items = [...items].sort((a, b) => b.title.localeCompare(a.title));

  return items;
}

function renderGallery() {
  // Show/hide Aether lookbook inside Explore
  const wrap = document.getElementById("aetherStoryWrap");
  if (wrap) {
    wrap.hidden = state.filter !== "Aether Shift";
    if (!wrap.hidden) initCoverflowsInside(wrap);
  }

  if (!galleryEl) return;
  const filtered = getFilteredItems();
  galleryEl.innerHTML = "";
  if (counterEl) counterEl.textContent = `${filtered.length} item(ns)`;

  filtered.forEach((item) => {
    const btn = document.createElement("button");
    btn.className = "gallery-card";
    btn.type = "button";
    btn.setAttribute("aria-label", `Abrir detalhes: ${item.title}`);

    const img = document.createElement("img");
    img.className = "gallery-thumb";
    img.src = item.image;
    img.alt = item.title;

    const title = document.createElement("h3");
    title.className = "gallery-title";
    title.textContent = item.title;

    const meta = document.createElement("div");
    meta.className = "gallery-meta";
    const favPill = isFav(item.id) ? `<span class="pill pill-fav">★</span>` : "";
    meta.innerHTML = `
      ${favPill}
      <span class="pill">${item.category}</span>
      <span class="pill">${item.status || "—"}</span>
    `;

    const desc = document.createElement("p");
    desc.className = "muted";
    desc.style.margin = "0";
    desc.textContent = item.description || "";

    btn.appendChild(img);
    btn.appendChild(title);
    btn.appendChild(meta);
    btn.appendChild(desc);

    btn.addEventListener("click", () => openModal(item.id));
    galleryEl.appendChild(btn);
  });
}

function openModal(itemId) {
  if (!modalEl) return;
  const item = allItems().find((i) => i.id === itemId);
  if (!item) return;

  modalEl.classList.add("open");
  modalEl.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  if (modalImgEl) { modalImgEl.src = item.image; modalImgEl.alt = item.title; }
  if (modalMetaEl) modalMetaEl.textContent = `${item.category} • ${item.status || "—"}${item.date ? " • " + item.date : ""}`;
  if (modalTitleEl) modalTitleEl.textContent = item.title;
  if (modalDescEl) modalDescEl.textContent = item.description || "";

  if (modalListEl) {
    modalListEl.innerHTML = "";
    (item.bullets || []).forEach((b) => {
      const li = document.createElement("li");
      li.textContent = b;
      modalListEl.appendChild(li);
    });
  }

  if (modalLinksEl) {
    modalLinksEl.innerHTML = "";

    const favBtn = document.createElement("button");
    favBtn.type = "button";
    favBtn.className = "modal-link-btn";
    const setText = () => favBtn.textContent = isFav(item.id) ? "Remover dos favoritos" : "Salvar nos favoritos";
    setText();

    favBtn.addEventListener("click", () => {
      toggleFav(item.id);
      setText();
      renderGallery();
      syncUrl();
    });
    modalLinksEl.appendChild(favBtn);

    (item.links || []).forEach((l) => {
      const a = document.createElement("a");
      a.className = "modal-link-btn";
      a.href = l.url;
      a.target = l.url.startsWith("http") ? "_blank" : "_self";
      a.rel = "noreferrer";
      a.textContent = l.label;
      modalLinksEl.appendChild(a);
    });
  }

  if (modalAdminEl) {
    modalAdminEl.innerHTML = "";
    if (item.custom) {
      const del = document.createElement("button");
      del.type = "button";
      del.className = "btn btn-ghost danger";
      del.textContent = "Excluir este item";
      del.addEventListener("click", () => {
        customItems = customItems.filter((x) => x.id !== item.id);
        saveJSON(STORAGE_KEY, customItems);
        closeModal();
        renderFilters();
        renderGallery();
        syncUrl();
      });
      modalAdminEl.appendChild(del);
    }
  }
}

function closeModal() {
  if (!modalEl) return;
  modalEl.classList.remove("open");
  modalEl.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function setupModalEvents() {
  if (!modalEl) return;

  modalEl.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.hasAttribute("data-close")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalEl.classList.contains("open")) closeModal();
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = reject;
    r.onload = () => resolve(String(r.result));
    r.readAsDataURL(file);
  });
}

async function onAddFormSubmit(e) {
  e.preventDefault();
  if (!addFormEl) return;

  const fd = new FormData(addFormEl);
  const title = String(fd.get("title") || "").trim();
  const category = String(fd.get("category") || "Outros").trim();
  const status = String(fd.get("status") || "").trim() || "Adicionado";
  const date = String(fd.get("date") || "").trim();
  const description = String(fd.get("description") || "").trim();
  const bulletsRaw = String(fd.get("bullets") || "");
  const file = fd.get("image");

  if (!title || !description) return;
  if (!(file instanceof File)) return;

  const bullets = bulletsRaw.split("\n").map(s => s.trim()).filter(Boolean);
  const dataUrl = await fileToDataUrl(file);
  const id = `${slugify(category)}-${slugify(title)}-${Date.now()}`;

  customItems.unshift({
    id, title, category, status, date,
    createdAt: Date.now(),
    image: dataUrl,
    description,
    bullets,
    links: [],
    custom: true
  });

  saveJSON(STORAGE_KEY, customItems);
  addFormEl.reset();

  renderFilters();
  renderGallery();
  syncUrl();
}

function exportJSON() {
  const data = { exportedAt: new Date().toISOString(), items: customItems };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "necklas-galeria-export.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function clearCustomItems() {
  const ok = confirm("Isso vai apagar do navegador todos os itens adicionados (upload). Continuar?");
  if (!ok) return;
  customItems = [];
  saveJSON(STORAGE_KEY, customItems);
  renderFilters();
  renderGallery();
  syncUrl();
}

// Inputs PRO
searchInputEl?.addEventListener("input", () => {
  state.search = String(searchInputEl.value || "").trim();
  renderGallery();
  syncUrl();
});
sortSelectEl?.addEventListener("change", () => {
  state.sort = String(sortSelectEl.value || "featured");
  renderGallery();
  syncUrl();
});
favoritesToggleEl?.addEventListener("click", () => {
  state.favoritesOnly = !state.favoritesOnly;
  favoritesToggleEl.setAttribute("aria-pressed", String(state.favoritesOnly));
  renderGallery();
  syncUrl();
});

// Atalhos: filtro e open modal
document.addEventListener("click", (e) => {
  const el = e.target instanceof Element ? e.target.closest("[data-filter], [data-open-item]") : null;
  if (!el) return;

  const openId = el.getAttribute("data-open-item");
  if (openId) {
    openModal(openId);
    return;
  }

  const filter = el.getAttribute("data-filter");
  if (filter) {
    state.filter = filter;
    renderFilters();
    renderGallery();
    syncUrl();
  }
});

// =====================
// Timeline
// =====================
const timelineEl = document.getElementById("timelineList");
const timeline = [
  { date: "Agora", title: "Portfólio no ar (e evoluindo)", desc: "Manter atualizado e transformar ideias em entregas reais." },
  { date: "Próximas semanas", title: "Mini-projetos JS consistentes", desc: "Criar e publicar repositórios (to-do, jogo, gerador de senha)." },
  { date: "Curto prazo", title: "Aether Shift — Drop 01", desc: "Validar direção, fechar detalhes e estruturar execução." },
  { date: "Curto/Médio prazo", title: "Mizuryu — identidade e estrutura", desc: "Definir proposta do time, identidade e evolução do projeto." },
  { date: "Médio prazo", title: "Projeto digital próprio", desc: "Ferramenta/app/plataforma que resolva um problema real." },
  { date: "Longo prazo", title: "Marca forte + equipe sustentada", desc: "Aether Shift e Mizuryu fortalecendo um ao outro." }
];

function renderTimeline() {
  if (!timelineEl) return;
  timelineEl.innerHTML = "";
  timeline.forEach((t) => {
    const item = document.createElement("div");
    item.className = "t-item";
    item.innerHTML = `
      <div class="t-top">
        <h3 class="t-title">${t.title}</h3>
        <span class="t-date">${t.date}</span>
      </div>
      <p class="t-desc">${t.desc}</p>
    `;
    timelineEl.appendChild(item);
  });
}

// =====================
// Coverflow (autoplay toggle premium) - múltiplas instâncias
// =====================
const coverflowInitSet = new WeakSet();

function initCoverflowsInside(root) {
  root.querySelectorAll("[data-coverflow]").forEach(initCoverflow);
}

function initCoverflow(root) {
  if (coverflowInitSet.has(root)) return;
  coverflowInitSet.add(root);

  const viewport = root.querySelector("[data-cf-viewport]");
  const items = Array.from(viewport?.querySelectorAll(".coverflow-item") || []);
  const prev = root.closest(".card, section, body")?.querySelector("[data-cf-prev]");
  const next = root.closest(".card, section, body")?.querySelector("[data-cf-next]");
  const dotsWrap = root.querySelector("[data-cf-dots]");
  const toggleBtn = root.closest(".card, section, body")?.querySelector("[data-cf-toggle]");

  const key = root.getAttribute("data-cf-key") || "default";
  const AUTO_KEY = `necklas_coverflow_auto_${key}_v1`;

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const fromStorage = localStorage.getItem(AUTO_KEY);
  let autoEnabled =
    fromStorage !== null ? fromStorage === "1" : (root.getAttribute("data-autoplay") === "true");

  if (prefersReduced) autoEnabled = false;
  if (!viewport || items.length === 0) return;

  let index = 0;
  let timer = null;

  const mod = (n, m) => ((n % m) + m) % m;

  function shortestOffset(i) {
    const n = items.length;
    let off = i - index;
    off = mod(off, n);
    if (off > n / 2) off -= n;
    return off;
  }

  function render() {
    items.forEach((el, i) => {
      const off = shortestOffset(i);
      const abs = Math.abs(off);

      const scale = Math.max(0.78, 1 - abs * 0.12);
      const op = Math.max(0.18, 1 - abs * 0.20);
      const blur = Math.min(2.2, abs * 0.7);
      const z = 50 - abs;

      el.style.setProperty("--offset", off);
      el.style.setProperty("--scale", scale);
      el.style.setProperty("--op", op);
      el.style.setProperty("--blur", `${blur}px`);
      el.style.setProperty("--z", z);

      el.classList.toggle("is-active", i === index);
    });

    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle("active", i === index));
    }

    if (toggleBtn) {
      toggleBtn.setAttribute("aria-pressed", String(autoEnabled));
      toggleBtn.disabled = prefersReduced;

      const stateEl = toggleBtn.querySelector("[data-cf-state]");
      if (stateEl) stateEl.textContent = autoEnabled ? "On" : "Off";
      if (prefersReduced && stateEl) stateEl.textContent = "Off";
    }
  }

  function go(delta) {
    index = mod(index + delta, items.length);
    render();
  }

  // dots
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    items.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "coverflow-dot";
      b.addEventListener("click", () => {
        index = i;
        render();
      });
      dotsWrap.appendChild(b);
    });
  }

  // setas
  prev?.addEventListener("click", () => go(-1));
  next?.addEventListener("click", () => go(1));

  // clique: 1º centraliza, 2º abre modal
  items.forEach((el, i) => {
    el.addEventListener("click", (e) => {
      if (i !== index) {
        e.preventDefault();
        e.stopPropagation();
        index = i;
        render();
        return;
      }
      const openId = el.getAttribute("data-open-item");
      if (openId) {
        e.preventDefault();
        e.stopPropagation();
        openModal(openId);
      }
    });
  });

  // drag/swipe
  let startX = 0;
  let dragging = false;

  viewport.addEventListener("pointerdown", (e) => {
    dragging = true;
    startX = e.clientX;
    viewport.setPointerCapture?.(e.pointerId);
    stopAuto();
  });

  viewport.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 55) {
      go(dx > 0 ? -1 : 1);
      startX = e.clientX;
    }
  });

  viewport.addEventListener("pointerup", () => {
    dragging = false;
    startAuto();
  });
  viewport.addEventListener("pointercancel", () => {
    dragging = false;
    startAuto();
  });

  function startAuto() {
    if (!autoEnabled) return;
    if (timer) return;
    timer = setInterval(() => go(1), 2800);
  }

  function stopAuto() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }

  toggleBtn?.addEventListener("click", () => {
    if (prefersReduced) return;
    autoEnabled = !autoEnabled;
    localStorage.setItem(AUTO_KEY, autoEnabled ? "1" : "0");
    if (autoEnabled) startAuto();
    else stopAuto();
    render();
  });

  root.addEventListener("mouseenter", stopAuto);
  root.addEventListener("mouseleave", startAuto);

  render();
  startAuto();
}

// =====================
// Carrinho (simulado)
// =====================
const CART_KEY = "necklas_cart_v1";
let cart = loadJSON(CART_KEY, []);
if (!Array.isArray(cart)) cart = [];

const cartBtn = document.getElementById("cartBtn");
const cartCountEl = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartClearBtn = document.getElementById("cartClearBtn");
const cartEmailBtn = document.getElementById("cartEmailBtn");

function saveCart() { saveJSON(CART_KEY, cart); }

function cartCount() {
  return cart.reduce((acc, it) => acc + it.qty, 0);
}

function cartTotal() {
  return cart.reduce((acc, it) => acc + it.qty * it.price, 0);
}

function updateCartUI() {
  if (cartCountEl) cartCountEl.textContent = String(cartCount());
  if (!cartItemsEl || !cartTotalEl) return;

  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="muted">Seu carrinho está vazio.</p>`;
    cartTotalEl.textContent = moneyBRL(0);
    return;
  }

  cart.forEach((it) => {
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <img src="${it.image}" alt="${it.name}" />
      <div>
        <div class="cart-row-top">
          <strong>${it.name}</strong>
          <span class="pill">${it.size}</span>
        </div>
        <div class="muted">${moneyBRL(it.price)}</div>

        <div class="cart-row-controls">
          <button class="carousel-btn" type="button" data-cart-dec="${it.key}">-</button>
          <span class="muted">Qtd: <strong>${it.qty}</strong></span>
          <button class="carousel-btn" type="button" data-cart-inc="${it.key}">+</button>
          <button class="carousel-btn" type="button" data-cart-rm="${it.key}">Remover</button>
        </div>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });

  cartTotalEl.textContent = moneyBRL(cartTotal());
}

function openCart() {
  if (!cartDrawer) return;
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  if (!cartDrawer) return;
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function addToCart({ id, name, price, image, size }) {
  const key = `${id}|${size}`;
  const existing = cart.find((x) => x.key === key);
  if (existing) existing.qty += 1;
  else cart.unshift({ key, id, name, price, image, size, qty: 1 });

  saveCart();
  updateCartUI();
  openCart();
}

document.addEventListener("click", (e) => {
  const el = e.target instanceof Element ? e.target.closest("[data-add-to-cart]") : null;
  if (!el) return;

  const id = el.getAttribute("data-id");
  const name = el.getAttribute("data-name");
  const price = Number(el.getAttribute("data-price") || "0");
  const image = el.getAttribute("data-image") || svgPlaceholder("Produto");
  if (!id || !name) return;

  const sizeSel = document.querySelector(`[data-size-for="${id}"]`);
  const size = (sizeSel && sizeSel.value) ? sizeSel.value : "Único";

  addToCart({ id, name, price, image, size });
});

cartBtn?.addEventListener("click", openCart);

cartDrawer?.addEventListener("click", (e) => {
  const t = e.target;
  if (!(t instanceof Element)) return;

  if (t.hasAttribute("data-cart-close")) closeCart();

  const inc = t.closest("[data-cart-inc]")?.getAttribute("data-cart-inc");
  const dec = t.closest("[data-cart-dec]")?.getAttribute("data-cart-dec");
  const rm = t.closest("[data-cart-rm]")?.getAttribute("data-cart-rm");

  if (inc) {
    const it = cart.find((x) => x.key === inc);
    if (it) it.qty += 1;
    saveCart(); updateCartUI();
  }

  if (dec) {
    const it = cart.find((x) => x.key === dec);
    if (it) it.qty = Math.max(1, it.qty - 1);
    saveCart(); updateCartUI();
  }

  if (rm) {
    cart = cart.filter((x) => x.key !== rm);
    saveCart(); updateCartUI();
  }
});

cartClearBtn?.addEventListener("click", () => {
  const ok = confirm("Limpar carrinho?");
  if (!ok) return;
  cart = [];
  saveCart();
  updateCartUI();
});

cartEmailBtn?.addEventListener("click", () => {
  if (cart.length === 0) return;

  const lines = [
    "Pedido (simulado) — Aether Shift",
    "",
    ...cart.map((it) => `- ${it.name} | Tam: ${it.size} | Qtd: ${it.qty} | ${moneyBRL(it.price)}`),
    "",
    `Total: ${moneyBRL(cartTotal())}`,
    "",
    "Obs: este pedido foi gerado pelo portfólio (checkout em breve)."
  ];

  const subject = "Aether Shift — Pedido (simulado)";
  const mailto =
    `mailto:necklas.contact@gmail.com` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(lines.join("\n"))}`;

  window.location.href = mailto;
});

// =====================
// Contato (Formspree via fetch)
// =====================
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!contactStatus) return;

    contactStatus.textContent = "Enviando...";
    try {
      const res = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        contactStatus.textContent = "Mensagem enviada. Vou responder em breve.";
        contactForm.reset();
      } else {
        contactStatus.textContent = "Não foi possível enviar agora. Tente novamente ou use o e-mail.";
      }
    } catch {
      contactStatus.textContent = "Falha de conexão. Tente novamente ou use o e-mail.";
    }
  });
}

// =====================
// Init
// =====================
applyUrlState();
renderFilters();
renderGallery();
setupModalEvents();
renderTimeline();
syncUrl();
updateCartUI();
initCoverflowsInside(document);