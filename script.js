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

// Itens fixos (base)
const baseItems = [
  // Aether Shift (assets)
  {
    id: "aether-shift-logo-sa",
    title: "Aether Shift — Logo (SA)",
    category: "Aether Shift",
    status: "Identidade",
    date: "2026",
    image: "assets/aether-shift-logo-sa.jpg",
    description: "Monograma principal (SA). Minimalismo premium e assinatura da marca.",
    bullets: [
      "Aplicação premium: bordado pequeno/peito/etiqueta/boné.",
      "Reconhecimento sem poluição visual."
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
    description: "Nome da marca para reforço oficial (campanha, embalagem, assinatura).",
    bullets: [
      "Reforça marca quando o símbolo não basta.",
      "Base de consistência para o digital."
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
    description: "Assinatura discreta: SA na frente + nome em pontos secundários.",
    bullets: [
      "Minimalista e reconhecível.",
      "Peça de presença no dia a dia."
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
    description: "Direção do Drop 01: clean com SA e variações com wordmark.",
    bullets: [
      "Peça-chave do drop (presença).",
      "Marca bem posicionada, sem exagero."
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
    description: "Visão de extensão/collab: reforço de identidade e desejo de marca.",
    bullets: [
      "Referência estética para o futuro.",
      "Cria desejo e consistência visual."
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
      "Boa para campanha, embalagem e página da marca.",
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
    description: "Camiseta base do Drop 01 com variações de assinatura (minimal/destaque).",
    bullets: [
      "Uniforme do construtor: simples e forte.",
      "Define a assinatura visual da marca."
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
    description: "Story piece: frente limpa, costas comunicam (narrativa do drop).",
    bullets: [
      "Perfeita para campanha/foto.",
      "Cria conversa e storytelling."
    ],
    links: [],
    custom: false
  },

  // Mizuryu (sem arte própria ainda)
  {
    id: "mizuryu-conceito",
    title: "Mizuryu — Dragão da Água (conceito)",
    category: "Mizuryu",
    status: "Conceito",
    date: "Futuro",
    image: svgPlaceholder("Mizuryu", "Time • disciplina • evolução"),
    description: "Projeto de time de vôlei conectado ao ecossistema: alto desempenho + identidade.",
    bullets: [
      "Dragão = poder, ambição e domínio.",
      "Água = adaptação, fluidez e movimento constante.",
      "Visão: marca e esporte se fortalecendo juntos."
    ],
    links: [
      { label: "Contato", url: "mailto:necklas.contact@gmail.com?subject=Mizuryu%20-%20Contato" }
    ],
    custom: false
  },

  // Tech (placeholder visual)
  {
    id: "portfolio-site",
    title: "Portfólio — Website",
    category: "Tech",
    status: "Ativo",
    date: "2026",
    image: svgPlaceholder("Portfólio", "HTML • CSS • JS"),
    description: "Este site: organização de marca/projetos + galeria interativa + timeline.",
    bullets: [
      "Responsivo e simples de manter.",
      "Filtros, modal e upload local.",
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

// Carrossel de roteiro: inicializar sob demanda (porque fica hidden)
let storyCarouselInitialized = false;

function renderGallery() {
  // Mostra/oculta o roteiro do Drop 01
  const aetherStoryWrap = document.getElementById("aetherStoryWrap");
  const shouldShowStory = state.filter === "Aether Shift";
  if (aetherStoryWrap) {
    aetherStoryWrap.hidden = !shouldShowStory;

    if (shouldShowStory && !storyCarouselInitialized) {
      const carouselRoot = aetherStoryWrap.querySelector("[data-carousel]");
      if (carouselRoot) initCarousel(carouselRoot);
      storyCarouselInitialized = true;
    }
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
  { date: "Agora", title: "Portfólio no ar (e evoluindo)", desc: "Manter atualizado e transformar projetos em entregas reais." },
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
// Atalhos: filtros + abrir modal
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
// Carousel (roteiro)
// =====================
function initCarousel(root){
  const track = root.querySelector("[data-carousel-track]");
  const prev = root.querySelector("[data-carousel-prev]");
  const next = root.querySelector("[data-carousel-next]");
  const dotsWrap = root.querySelector("[data-carousel-dots]");
  const statusEl = root.closest(".card")?.querySelector("[data-carousel-status]");
  if (!track) return;

  const cards = Array.from(track.children);

  function currentIndex(){
    const left = track.scrollLeft;
    let best = 0;
    let bestDist = Infinity;

    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - left);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });

    return best;
  }

  function scrollToIndex(i){
    const clamped = Math.max(0, Math.min(cards.length - 1, i));
    const card = cards[clamped];
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  }

  if (dotsWrap){
    dotsWrap.innerHTML = "";
    cards.forEach((_, i) => {
      const d = document.createElement("button");
      d.type = "button";
      d.className = "carousel-dot";
      d.setAttribute("aria-label", `Ir para o card ${i + 1}`);
      d.addEventListener("click", () => scrollToIndex(i));
      dotsWrap.appendChild(d);
    });
  }

  function updateUI(){
    const i = currentIndex();
    if (statusEl) statusEl.textContent = `${i + 1} / ${cards.length}`;

    if (dotsWrap){
      Array.from(dotsWrap.children).forEach((dot, idx) => {
        dot.classList.toggle("active", idx === i);
      });
    }

    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === cards.length - 1;
  }

  prev?.addEventListener("click", () => scrollToIndex(currentIndex() - 1));
  next?.addEventListener("click", () => scrollToIndex(currentIndex() + 1));

  let raf = null;
  track.addEventListener("scroll", () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updateUI);
  });

  window.addEventListener("resize", updateUI);
  updateUI();
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