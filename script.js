const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

if (menuBtn && menu) {
  menuBtn.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  // Fecha o menu ao clicar em um link (mobile)
  menu.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.tagName === "A") {
      menu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
}