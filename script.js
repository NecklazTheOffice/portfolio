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

// Helpers
function slugify(str) {
  return String(str).toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
}
function safeJSONParse(raw, fallback) { try { return JSON.parse(raw) ?? fallback; } catch { return fallback; } }
function loadJSON(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  return safeJSONParse(raw, fallback);
}
function saveJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = reject;
    r.onload = () => resolve(String(r.result));
    r.readAsDataURL(file);
  });
}

function svgPlaceholder(title, subtitle = "Sem imagem") {
  const safeTitle = String(title).replace(/[<>&"]/g, "");
  const safeSub = String(subtitle).replace(/[<>&"]/g, "");
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7c5cff" stop-opacity="0.65"/>
      <stop offset="1" stop-color="#22c55e" stop-opacity="0.35"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="#0b1220"/>
    <rect x="40" y="40" width="1120" height="670" rx="36" fill="url(#g)" opacity="0.35"/>
    <text x="90" y="340" fill="rgba(255,255,255,0.92)" font-size="64" font-family="Arial" font-weight="700">${safeTitle}</text>
    <text x="90" y="410" fill="rgba(255,255,255,0.70)" font-size="30" font-family="Arial">${safeSub}</text>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

// Theme
(() => {
  const themeBtn = document.getElementById("themeToggle");
  const themeStateEl = document.getElementById("themeState");
  const THEME_KEY = "necklas_theme_v3";
  const mqLight = window.matchMedia?.("(prefers-color-scheme: light)");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", theme === "light" ? "#f6f7fb" : "#0b1220");
    if (themeStateEl) themeStateEl.textContent = theme === "light" ? "Claro" : "Escuro";
  }

  function getTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return mqLight?.matches ? "light" : "dark";
  }

  applyTheme(getTheme());

  themeBtn?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  mqLight?.addEventListener?.("change", () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return;
    applyTheme(getTheme());
  });
})();

// Favorites + Gallery PRO
const STORAGE_KEY = "necklas_gallery_items_v4";
const FAV_KEY = "necklas_favs_v3";

let favorites = new Set(loadJSON(FAV_KEY, []));
function saveFavs() { saveJSON(FAV_KEY, [...favorites]); }
function isFav(id) { return favorites.has(id); }
function toggleFav(id) { favorites.has(id) ? favorites.delete(id) : favorites.add(id); saveFavs(); }

let customItems = loadJSON(STORAGE_KEY, []);
if (!Array.isArray(customItems)) customItems = [];

const baseItems = [
  {
    id:"webfinanc",
    title:"WebFinanc — Gerenciador de despesas",
    category:"Tech",
    status:"Beta (testes)",
    date:"2026",
    createdAt: 200,
    image: "assets/webfinanc.jpg",
    description:"Site para gerenciamento de despesas, finanças e organização. Público em fase de testes.",
    bullets:[
      "Gerenciamento de despesas e organização financeira.",
      "Disponível ao público (beta)."
    ],
    links:[
      {label:"Acessar", url:"https://webfinanc.netlify.app/"},
      {label:"GitHub", url:"https://github.com/NecklazTheOffice"}
    ],
    custom:false
  },
  {
    id:"discord-rpg-bot",
    title:"Bot de RPG — Discord",
    category:"Tech",
    status:"Em andamento (público)",
    date:"2026",
    createdAt: 199,
    image: "assets/bot.jpg",
    description:"Bot com estrutura nova e novas mecânicas. Em andamento, disponível ao público por enquanto.",
    bullets:[
      "Estrutura nova para crescer com consistência.",
      "Mecânicas em evolução."
    ],
    links:[
      {
        label:"Adicionar no Discord",
        url:"https://discord.com/oauth2/authorize?client_id=1480627344074080427&permissions=84992&integration_type=0&scope=bot+applications.commands"
      },
      {label:"GitHub", url:"https://github.com/NecklazTheOffice"}
    ],
    custom:false
  },

  { id:"aether-shift-tee-mockups", title:"Aether Shift — Camiseta (mockups)", category:"Aether Shift", status:"Mockup", date:"2026", createdAt: 10,
    image:"assets/aether-shift-tee-mockups.jpg",
    description:"Camiseta base do Drop 01 com variações (minimal/destaque).",
    bullets:["Uniforme do construtor.","Define assinatura visual."],
    links:[], custom:false
  },
  { id:"aether-shift-hoodie-mockups", title:"Aether Shift — Moletom (mockups)", category:"Aether Shift", status:"Mockup", date:"2026", createdAt: 9,
    image:"assets/aether-shift-hoodie-mockups.jpg",
    description:"Direção do Drop 01: clean com SA e wordmark estratégico.",
    bullets:["Peça-chave do drop.","Marca sem exagero."],
    links:[], custom:false
  },
  { id:"aether-shift-cap", title:"Aether Shift — Boné (mockup)", category:"Aether Shift", status:"Mockup", date:"2026", createdAt: 8,
    image:"assets/aether-shift-cap.jpg",
    description:"Assinatura discreta: SA na frente + nome em pontos secundários.",
    bullets:["Minimalista e reconhecível."],
    links:[], custom:false
  },
  { id:"aether-shift-backprint", title:"Aether Shift — Costas (mockup)", category:"Aether Shift", status:"Mockup", date:"2026", createdAt: 7,
    image:"assets/aether-shift-backprint.jpg",
    description:"Story piece: frente limpa, costas comunicam.",
    bullets:["Narrativa visual do drop."],
    links:[], custom:false
  },

  { id:"mizuryu-conceito", title:"Mizuryu — conceito", category:"Mizuryu", status:"Conceito", date:"Futuro", createdAt: 6,
    image: "assets/mizuryu.jpg",
    description:"Projeto de time de vôlei conectado ao ecossistema.",
    bullets:["Dragão = poder.","Água = adaptação."],
    links:[], custom:false
  },
];

const state = { filter:"Todos", search:"", sort:"featured", favoritesOnly:false };

const galleryEl = document.getElementById("gallery");
const filterBarEl = document.getElementById("filterBar");
const counterEl = document.getElementById("counter");
const searchInputEl = document.getElementById("searchInput");
const sortSelectEl = document.getElementById("sortSelect");
const favoritesToggleEl = document.getElementById("favoritesToggle");

const addFormEl = document.getElementById("addForm");
const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn");

const modalEl = document.getElementById("modal");
const modalImgEl = document.getElementById("modalImg");
const modalMetaEl = document.getElementById("modalMeta");
const modalTitleEl = document.getElementById("modalTitle");
const modalDescEl = document.getElementById("modalDesc");
const modalListEl = document.getElementById("modalList");
const modalLinksEl = document.getElementById("modalLinks");
const modalAdminEl = document.getElementById("modalAdmin");

function applyUrlState(){
  const url = new URL(location.href);
  const f = url.searchParams.get("filter");
  const q = url.searchParams.get("q");
  const s = url.searchParams.get("sort");
  const fav = url.searchParams.get("fav");
  if (f) state.filter = f;
  if (q) state.search = q;
  if (s) state.sort = s;
  if (fav === "1") state.favoritesOnly = true;
  if (searchInputEl) searchInputEl.value = state.search;
  if (sortSelectEl) sortSelectEl.value = state.sort;
  if (favoritesToggleEl) favoritesToggleEl.setAttribute("aria-pressed", String(state.favoritesOnly));
}
function syncUrl(){
  const url = new URL(location.href);
  state.filter !== "Todos" ? url.searchParams.set("filter", state.filter) : url.searchParams.delete("filter");
  state.search ? url.searchParams.set("q", state.search) : url.searchParams.delete("q");
  state.sort !== "featured" ? url.searchParams.set("sort", state.sort) : url.searchParams.delete("sort");
  state.favoritesOnly ? url.searchParams.set("fav","1") : url.searchParams.delete("fav");
  history.replaceState(null,"",url);
}

function allItems(){ return [...baseItems, ...customItems]; }

function getCategories(){
  const cats = Array.from(new Set(allItems().map(i => i.category)));
  return ["Todos", ...cats];
}

function renderFilters(){
  if (!filterBarEl) return;
  filterBarEl.innerHTML = "";
  getCategories().forEach((cat) => {
    const b = document.createElement("button");
    b.className = "filter-btn";
    b.type = "button";
    b.textContent = cat;
    b.setAttribute("aria-pressed", String(cat === state.filter));
    b.addEventListener("click", () => {
      state.filter = cat;
      renderFilters();
      renderGallery();
      syncUrl();
    });
    filterBarEl.appendChild(b);
  });
}

function matchesSearch(item, query){
  const q = query.toLowerCase();
  return [item.title,item.description,item.category,item.status,item.date]
    .some(v => String(v||"").toLowerCase().includes(q));
}

function getFilteredItems(){
  let items = allItems();
  if (state.filter !== "Todos") items = items.filter(i => i.category === state.filter);
  if (state.favoritesOnly) items = items.filter(i => isFav(i.id));
  if (state.search) items = items.filter(i => matchesSearch(i, state.search));

  if (state.sort === "newest") items = [...items].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
  if (state.sort === "titleAsc") items = [...items].sort((a,b)=>a.title.localeCompare(b.title));
  if (state.sort === "titleDesc") items = [...items].sort((a,b)=>b.title.localeCompare(a.title));
  return items;
}

function renderGallery(){
  if (!galleryEl) return;
  const items = getFilteredItems();
  galleryEl.innerHTML = "";
  if (counterEl) counterEl.textContent = `${items.length} item(ns)`;

  items.forEach((item) => {
    const btn = document.createElement("button");
    btn.className = "gallery-card";
    btn.type = "button";

    const img = document.createElement("img");
    img.className = "gallery-thumb";
    img.src = item.image || svgPlaceholder(item.title);
    img.alt = item.title;

    const title = document.createElement("h3");
    title.className = "gallery-title";
    title.textContent = item.title;

    const meta = document.createElement("div");
    meta.className = "gallery-meta";
    meta.innerHTML = `
      ${isFav(item.id) ? `<span class="pill pill-fav">★</span>` : ""}
      <span class="pill">${item.category}</span>
      <span class="pill">${item.status || "—"}</span>
    `;

    const desc = document.createElement("p");
    desc.className = "muted";
    desc.style.margin = "0";
    desc.textContent = item.description || "";

    btn.append(img,title,meta,desc);
    btn.addEventListener("click", () => openModal(item.id));
    galleryEl.appendChild(btn);
  });
}

function openModal(id){
  if (!modalEl) return;
  const item = allItems().find(i => i.id === id);
  if (!item) return;

  modalEl.classList.add("open");
  modalEl.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";

  if (modalImgEl) { modalImgEl.src = item.image || svgPlaceholder(item.title); modalImgEl.alt = item.title; }
  if (modalMetaEl) modalMetaEl.textContent = `${item.category} • ${item.status||"—"}${item.date ? " • " + item.date : ""}`;
  if (modalTitleEl) modalTitleEl.textContent = item.title;
  if (modalDescEl) modalDescEl.textContent = item.description || "";

  if (modalListEl){
    modalListEl.innerHTML = "";
    (item.bullets||[]).forEach(b=>{
      const li=document.createElement("li"); li.textContent=b; modalListEl.appendChild(li);
    });
  }

  if (modalLinksEl){
    modalLinksEl.innerHTML = "";

    const favBtn = document.createElement("button");
    favBtn.type="button";
    favBtn.className="modal-link-btn";
    const setTxt = ()=> favBtn.textContent = isFav(item.id) ? "Remover dos favoritos" : "Salvar nos favoritos";
    setTxt();
    favBtn.addEventListener("click", ()=>{
      toggleFav(item.id); setTxt(); renderGallery(); syncUrl();
    });
    modalLinksEl.appendChild(favBtn);

    (item.links||[]).forEach(l=>{
      const a=document.createElement("a");
      a.className="modal-link-btn";
      a.href=l.url;
      a.target = l.url.startsWith("http") ? "_blank" : "_self";
      a.rel="noreferrer";
      a.textContent=l.label;
      modalLinksEl.appendChild(a);
    });
  }

  if (modalAdminEl){
    modalAdminEl.innerHTML = "";
    if (item.custom){
      const del=document.createElement("button");
      del.type="button";
      del.className="btn btn-ghost danger";
      del.textContent="Excluir este item";
      del.addEventListener("click", ()=>{
        customItems = customItems.filter(x=>x.id!==item.id);
        saveJSON(STORAGE_KEY, customItems);
        closeModal();
        renderFilters(); renderGallery(); syncUrl();
      });
      modalAdminEl.appendChild(del);
    }
  }
}

function closeModal(){
  if (!modalEl) return;
  modalEl.classList.remove("open");
  modalEl.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}
function setupModalEvents(){
  if (!modalEl) return;
  modalEl.addEventListener("click",(e)=>{
    const t=e.target;
    if (t && t.hasAttribute("data-close")) closeModal();
  });
  document.addEventListener("keydown",(e)=>{
    if (e.key==="Escape" && modalEl.classList.contains("open")) closeModal();
  });
}

/* Upload */
async function onAddFormSubmit(e){
  e.preventDefault();
  if (!addFormEl) return;

  const fd=new FormData(addFormEl);
  const title=String(fd.get("title")||"").trim();
  const category=String(fd.get("category")||"Outros").trim();
  const status=String(fd.get("status")||"").trim()||"Adicionado";
  const date=String(fd.get("date")||"").trim();
  const description=String(fd.get("description")||"").trim();
  const bulletsRaw=String(fd.get("bullets")||"");
  const file=fd.get("image");

  if (!title || !description) return;
  if (!(file instanceof File)) return;

  const bullets=bulletsRaw.split("\n").map(s=>s.trim()).filter(Boolean);
  const dataUrl=await fileToDataUrl(file);
  const id=`${slugify(category)}-${slugify(title)}-${Date.now()}`;

  customItems.unshift({ id,title,category,status,date,createdAt:Date.now(),image:dataUrl,description,bullets,links:[],custom:true });
  saveJSON(STORAGE_KEY, customItems);
  addFormEl.reset();

  renderFilters(); renderGallery(); syncUrl();
}

function exportJSON(){
  const data={ exportedAt:new Date().toISOString(), items:customItems };
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download="necklas-galeria-export.json";
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
function clearCustomItems(){
  const ok=confirm("Apagar itens adicionados do navegador?");
  if (!ok) return;
  customItems=[]; saveJSON(STORAGE_KEY, customItems);
  renderFilters(); renderGallery(); syncUrl();
}

searchInputEl?.addEventListener("input",()=>{
  state.search=String(searchInputEl.value||"").trim();
  renderGallery(); syncUrl();
});
sortSelectEl?.addEventListener("change",()=>{
  state.sort=String(sortSelectEl.value||"featured");
  renderGallery(); syncUrl();
});
favoritesToggleEl?.addEventListener("click",()=>{
  state.favoritesOnly=!state.favoritesOnly;
  favoritesToggleEl.setAttribute("aria-pressed", String(state.favoritesOnly));
  renderGallery(); syncUrl();
});

/* data-filter / data-open-item */
document.addEventListener("click",(e)=>{
  const el = e.target instanceof Element ? e.target.closest("[data-filter],[data-open-item]") : null;
  if (!el) return;

  const openId=el.getAttribute("data-open-item");
  if (openId){ openModal(openId); return; }

  const filter=el.getAttribute("data-filter");
  if (filter){
    state.filter=filter;
    renderFilters(); renderGallery(); syncUrl();
  }
});

/* Coverflow */
const coverflowInitSet=new WeakSet();
function initCoverflow(root){
  if (!root || coverflowInitSet.has(root)) return;
  coverflowInitSet.add(root);

  const viewport=root.querySelector("[data-cf-viewport]");
  const items=Array.from(viewport?.querySelectorAll(".coverflow-item")||[]);
  const dotsWrap=root.querySelector("[data-cf-dots]");
  const prev=root.querySelector("[data-cf-prev]");
  const next=root.querySelector("[data-cf-next]");
  const toggleBtn=root.querySelector("[data-cf-toggle]");

  const key=root.getAttribute("data-cf-key")||"default";
  const AUTO_KEY=`necklas_coverflow_auto_${key}_v1`;
  const prefersReduced=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const fromStorage=localStorage.getItem(AUTO_KEY);
  let autoEnabled=fromStorage!==null ? fromStorage==="1" : root.getAttribute("data-autoplay")==="true";
  if (prefersReduced) autoEnabled=false;

  if (!viewport || items.length===0) return;

  let index=0;
  let timer=null;
  const mod=(n,m)=>((n%m)+m)%m;

  function shortestOffset(i){
    const n=items.length;
    let off=i-index;
    off=mod(off,n);
    if (off>n/2) off-=n;
    return off;
  }

  function initDots(){
    if (!dotsWrap) return;
    dotsWrap.innerHTML="";
    items.forEach((_,i)=>{
      const b=document.createElement("button");
      b.type="button";
      b.className="coverflow-dot";
      b.addEventListener("click",()=>{ index=i; render(); });
      dotsWrap.appendChild(b);
    });
  }

  function render(){
    items.forEach((el,i)=>{
      const off=shortestOffset(i);
      const abs=Math.abs(off);
      const scale=Math.max(0.78,1-abs*0.12);
      const op=Math.max(0.18,1-abs*0.20);
      const blur=Math.min(2.2,abs*0.7);
      const z=50-abs;
      el.style.setProperty("--offset",off);
      el.style.setProperty("--scale",scale);
      el.style.setProperty("--op",op);
      el.style.setProperty("--blur",`${blur}px`);
      el.style.setProperty("--z",z);
      el.classList.toggle("is-active", i===index);
    });

    if (dotsWrap){
      Array.from(dotsWrap.children).forEach((d,i)=>d.classList.toggle("active", i===index));
    }

    if (toggleBtn){
      toggleBtn.setAttribute("aria-pressed", String(autoEnabled));
      toggleBtn.disabled=!!prefersReduced;
      const stateEl=toggleBtn.querySelector("[data-cf-state]");
      if (stateEl) stateEl.textContent=autoEnabled ? "On" : "Off";
      if (prefersReduced && stateEl) stateEl.textContent="Off";
    }
  }

  function go(delta){ index=mod(index+delta, items.length); render(); }

  function startAuto(){
    if (!autoEnabled) return;
    if (timer) return;
    timer=setInterval(()=>go(1), 2800);
  }
  function stopAuto(){
    if (!timer) return;
    clearInterval(timer); timer=null;
  }

  prev?.addEventListener("click",()=>go(-1));
  next?.addEventListener("click",()=>go(1));
  toggleBtn?.addEventListener("click",()=>{
    if (prefersReduced) return;
    autoEnabled=!autoEnabled;
    localStorage.setItem(AUTO_KEY, autoEnabled ? "1" : "0");
    autoEnabled ? startAuto() : stopAuto();
    render();
  });

  items.forEach((el,i)=>{
    el.addEventListener("click",(e)=>{
      if (i!==index){ e.preventDefault(); e.stopPropagation(); index=i; render(); return; }
      const openId=el.getAttribute("data-open-item");
      if (openId){ e.preventDefault(); e.stopPropagation(); openModal(openId); }
    });
  });

  let startX=0; let dragging=false;
  viewport.addEventListener("pointerdown",(e)=>{ dragging=true; startX=e.clientX; viewport.setPointerCapture?.(e.pointerId); stopAuto(); });
  viewport.addEventListener("pointermove",(e)=>{
    if (!dragging) return;
    const dx=e.clientX-startX;
    if (Math.abs(dx)>55){ go(dx>0 ? -1 : 1); startX=e.clientX; }
  });
  viewport.addEventListener("pointerup",()=>{ dragging=false; startAuto(); });
  viewport.addEventListener("pointercancel",()=>{ dragging=false; startAuto(); });

  root.addEventListener("mouseenter", stopAuto);
  root.addEventListener("mouseleave", startAuto);

  initDots(); render(); startAuto();
}

document.querySelectorAll("[data-coverflow]").forEach(initCoverflow);

/* Contact mailto */
const contactForm=document.getElementById("contactForm");
const contactStatus=document.getElementById("contactStatus");
contactForm?.addEventListener("submit",(e)=>{
  e.preventDefault();
  const fd=new FormData(contactForm);
  const name=String(fd.get("name")||"").trim();
  const email=String(fd.get("email")||"").trim();
  const message=String(fd.get("message")||"").trim();
  const subject=`Contato - Portfólio (Necklas) - ${name}`;
  const body=[`Nome: ${name}`,`E-mail: ${email}`,"",message].join("\n");
  const mailto=`mailto:necklas.contact@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if (contactStatus) contactStatus.textContent="Abrindo seu e-mail...";
  window.location.href=mailto;
});

/* Timeline */
const timelineEl=document.getElementById("timelineList");
const timeline=[
  {date:"Agora", title:"WebFinanc (beta público)", desc:"Gerenciador de despesas e organização disponível ao público em fase de testes."},
  {date:"Agora", title:"Bot de RPG (Discord)", desc:"Estrutura nova e novas mecânicas. Em andamento, público por enquanto."},
  {date:"Curto prazo", title:"Aether Shift — Drop 01", desc:"Validar direção, fechar detalhes e estruturar execução."},
];
function renderTimeline(){
  if (!timelineEl) return;
  timelineEl.innerHTML="";
  timeline.forEach(t=>{
    const item=document.createElement("div");
    item.className="t-item";
    item.innerHTML=`
      <div class="t-top">
        <h3 class="t-title">${t.title}</h3>
        <span class="t-date">${t.date}</span>
      </div>
      <p class="t-desc">${t.desc}</p>
    `;
    timelineEl.appendChild(item);
  });
}

/* Init */
applyUrlState();
renderFilters();
renderGallery();
setupModalEvents();
renderTimeline();
syncUrl();

addFormEl?.addEventListener("submit", onAddFormSubmit);
exportBtn?.addEventListener("click", exportJSON);
clearBtn?.addEventListener("click", clearCustomItems);