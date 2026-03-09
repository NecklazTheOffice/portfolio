// =====================
// Base do site
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
    const target = e.target;
    if (target && target.tagName === "A") {
      menu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
}

// =====================
// Galeria + Upload + Modal
// =====================
const STORAGE_KEY = "necklas_gallery_items_v1";

const galleryEl = document.getElementById("gallery");
const filterBarEl = document.getElementById("filterBar");
const counterEl = document.getElementById("counter");

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

function loadCustomItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveCustomItems(customItems) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customItems));
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

const baseItems = [
  // Aether Shift (assets)
  {
    id: "aether-shift-logo-sa",
    title: "Aether Shift — Logo (SA)",
    category: "Aether Shift",
    status: "Identidade",
    date: "2026",
    image: "assets/aether-shift-logo-sa.jpg",
    description: "Monograma principal (SA). Ótimo para peças minimalistas sem texto.",
    bullets: [
      "Aplicação premium: bordado pequeno/peito/etiqueta/boné.",
      "Funciona muito bem em branco/preto sem poluir a peça."
    ],
    links: [],
    custom: false
  },
  {
    id: "aether-shift-wordmark",
    title: "Aether Shift — Wordmark",
    category: "Aether Shift",
    status: "Identidade",
    date: "2026",
    image: "assets/aether-shift-wordmark.jpg",
    description: "Nome da marca para usos onde o texto precisa aparecer com força.",
    bullets: [
      "Uso: embalagem, site, etiqueta, posts e campanhas.",
      "Combina com o símbolo (SA) para construir reconhecimento."
    ],
    links: [],
    custom: false
  },
  {
    id: "aether-shift-cap",
    title: "Aether Shift — Boné (mockup)",
    category: "Aether Shift",
    status: "Mockup",
    date: "2026",
    image: "assets/aether-shift-cap.jpg",
    description: "Mockup de aplicação do símbolo e do nome em boné.",
    bullets: [
      "Frente: SA (clean).",
      "Lateral/traseira: Aether Shift (reforço de marca)."
    ],
    links: [],
    custom: false
  },
  {
    id: "aether-shift-hoodie-mockups",
    title: "Aether Shift — Moletom (mockups)",
    category: "Aether Shift",
    status: "Mockup",
    date: "2026",
    image: "assets/aether-shift-hoodie-mockups.jpg",
    description: "Variações: clean (só símbolo) e versões com nome.",
    bullets: [
      "Clean = mais premium/minimal.",
      "Nome pequeno = branding sem poluir."
    ],
    links: [],
    custom: false
  },
  {
    id: "aether-shift-sneaker",
    title: "Aether Shift — Tênis (mockup)",
    category: "Aether Shift",
    status: "Mockup",
    date: "2026",
    image: "assets/aether-shift-sneaker.jpg",
    description: "Mockup de aplicação em calçado (visão de collab/edição especial).",
    bullets: [
      "Peça de desejo (bom para reforçar identidade).",
      "Serve como referência visual de direção estética."
    ],
    links: [],
    custom: false
  },
  {
    id: "aether-shift-tagline",
    title: "Aether Shift — Tagline",
    category: "Aether Shift",
    status: "Manifesto",
    date: "2026",
    image: "assets/aether-shift-tagline.jpg",
    description: "“Conectando expressão e autenticidade de forma intensa.”",
    bullets: [
      "Boa para página da marca, embalagem e campanha.",
      "Pode virar conceito do Drop 01."
    ],
    links: [],
    custom: false
  },
  {
    id: "aether-shift-tee-mockups",
    title: "Aether Shift — Camiseta (mockups)",
    category: "Aether Shift",
    status: "Mockup",
    date: "2026",
    image: "assets/aether-shift-tee-mockups.jpg",
    description: "Variações de posicionamento do símbolo e do nome na camiseta.",
    bullets: [
      "Símbolo grande = statement piece.",
      "Símbolo pequeno = premium/minimal."
    ],
    links: [],
    custom: false
  },
  {
    id: "aether-shift-backprint",
    title: "Aether Shift — Costas (mockup)",
    category: "Aether Shift",
    status: "Mockup",
    date: "2026",
    image: "assets/aether-shift-backprint.jpg",
    description: "Aplicação nas costas com wordmark e símbolo pequeno no topo.",
    bullets: [
      "Costas é ótima para storytelling/coleção.",
      "Frente fica limpa, atrás comunica."
    ],
    links: [],
    custom: false
  },

  // Tech (exemplo fixo)
  {
    id: "portfolio-site",
    title: "Portfólio — Website",
    category: "Tech",
    status: "Ativo",
    date: "2026",
    image: "assets/aether-shift-wordmark.jpg",
    description: "Este site: organização de projetos, galeria interativa, timeline e identidade.",
    bullets: [
      "Responsivo e simples de manter.",
      "Modal e filtros.",
      "Publicação via GitHub Pages."
    ],
    links: [
      { label: "GitHub", url: "https://github.com/NecklazTheOffice" }
    ],
    custom: false
  }
];

let customItems = loadCustomItems();

const state = {
  filter: "Todos",
  currentItemId: null
};

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
    });

    filterBarEl.appendChild(btn);
  });
}

function getFilteredItems() {
  const items = allItems();
  if (state.filter === "Todos") return items;
  return items.filter((i) => i.category === state.filter);
}

function renderGallery() {
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
    meta.innerHTML = `
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

  state.currentItemId = item.id;

  modalEl.classList.add("open");
  modalEl.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  if (modalImgEl) {
    modalImgEl.src = item.image;
    modalImgEl.alt = item.title;
  }

  if (modalMetaEl) {
    modalMetaEl.textContent = `${item.category} • ${item.status || "—"}${item.date ? " • " + item.date : ""}`;
  }

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

  // Admin: excluir apenas itens custom
  if (modalAdminEl) {
    modalAdminEl.innerHTML = "";
    if (item.custom) {
      const del = document.createElement("button");
      del.type = "button";
      del.className = "btn btn-ghost danger";
      del.textContent = "Excluir este item";
      del.addEventListener("click", () => {
        customItems = customItems.filter((x) => x.id !== item.id);
        saveCustomItems(customItems);
        closeModal();
        renderFilters();
        renderGallery();
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
  state.currentItemId = null;
}

function setupModalEvents() {
  if (!modalEl) return;

  modalEl.addEventListener("click", (e) => {
    const target = e.target;
    if (!target) return;
    if (target.hasAttribute("data-close")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalEl.classList.contains("open")) {
      closeModal();
    }
  });
}

async function onAddFormSubmit(e) {
  e.preventDefault();
  if (!addFormEl) return;

  const formData = new FormData(addFormEl);

  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "Outros").trim();
  const status = String(formData.get("status") || "").trim() || "Adicionado";
  const date = String(formData.get("date") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const bulletsRaw = String(formData.get("bullets") || "");
  const file = formData.get("image");

  if (!title || !description) return;
  if (!(file instanceof File)) return;

  const bullets = bulletsRaw
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

  const dataUrl = await fileToDataUrl(file);
  const id = `${slugify(category)}-${slugify(title)}-${Date.now()}`;

  customItems.unshift({
    id,
    title,
    category,
    status,
    date,
    image: dataUrl,
    description,
    bullets,
    links: [],
    custom: true
  });

  saveCustomItems(customItems);
  addFormEl.reset();

  renderFilters();
  renderGallery();
}

function exportJSON() {
  const data = {
    exportedAt: new Date().toISOString(),
    items: customItems
  };

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
  saveCustomItems(customItems);

  renderFilters();
  renderGallery();
}

// =====================
// Timeline
// =====================
const timelineEl = document.getElementById("timelineList");

const timeline = [
  { date: "Agora", title: "Portfólio no ar (e evoluindo)", desc: "Publicar, manter atualizado e adicionar projetos reais." },
  { date: "Próximas semanas", title: "Mini-projetos JS consistentes", desc: "Criar e publicar repositórios (to-do, jogo, gerador de senha)." },
  { date: "Curto prazo", title: "Aether Shift — Drop 01", desc: "Organizar mockups, validar peças e preparar execução." },
  { date: "Médio prazo", title: "Projeto digital próprio", desc: "Ferramenta/app/plataforma que resolva um problema real." },
  { date: "Longo prazo", title: "Marca forte + equipe de vôlei", desc: "Construir estrutura para patrocinar/sustentar um time e liderar o projeto." }
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
// Ações: filtro rápido + abrir modal pelos botões do Drop
// =====================
document.addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof Element)) return;

  const el = target.closest("[data-filter], [data-open-item]");
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
  }
});

// =====================
// Waitlist (abre e-mail pronto)
// =====================
const waitlistForm = document.getElementById("waitlistForm");
if (waitlistForm) {
  waitlistForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(waitlistForm);
    const name = String(fd.get("name") || "").trim();
    const contact = String(fd.get("contact") || "").trim();
    const product = String(fd.get("product") || "").trim();
    const size = String(fd.get("size") || "").trim();
    const message = String(fd.get("message") || "").trim();

    const subject = `Aether Shift - Lista de interesse (Drop 01) - ${product}`;
    const bodyLines = [
      "Quero entrar na lista do Drop 01.",
      "",
      `Nome: ${name}`,
      `Contato: ${contact}`,
      `Peça: ${product}`,
      size ? `Tamanho: ${size}` : null,
      message ? "" : null,
      message ? `Mensagem: ${message}` : null,
      "",
      "Enviado pelo portfólio."
    ].filter(Boolean);

    const mailto =
      `mailto:necklas.contact@gmail.com` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    window.location.href = mailto;
  });
}

// =====================
// Init
// =====================
if (addFormEl) addFormEl.addEventListener("submit", onAddFormSubmit);
if (exportBtn) exportBtn.addEventListener("click", exportJSON);
if (clearBtn) clearBtn.addEventListener("click", clearCustomItems);

renderFilters();
renderGallery();
setupModalEvents();
renderTimeline();