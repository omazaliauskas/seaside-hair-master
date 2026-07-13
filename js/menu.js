/* =========================================================
   Staggered mobilusis meniu (React Bits stiliaus adaptacija, vanilla)
   Naudoja index.html ir works.html
   ========================================================= */
(function () {
  "use strict";
  const toggle = document.getElementById("smToggle");
  const panel = document.getElementById("smPanel");
  const menu = document.getElementById("staggeredMenu");
  if (!toggle || !panel) return;

  let open = false;

  function set(state) {
    open = state;
    document.body.classList.toggle("menu-open", state);
    toggle.setAttribute("aria-expanded", String(state));
    toggle.setAttribute("aria-label", state ? "Uždaryti meniu" : "Atidaryti meniu");
    panel.setAttribute("aria-hidden", String(!state));
    if (menu) menu.setAttribute("aria-hidden", String(!state));
    document.body.style.overflow = state ? "hidden" : "";
  }

  toggle.addEventListener("click", () => set(!open));

  // Uždaryti paspaudus nuorodą
  panel.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => set(false))
  );

  // Uždaryti ESC klavišu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open) set(false);
  });

  // Uždaryti paspaudus šalia (už panelės ir mygtuko)
  document.addEventListener("mousedown", (e) => {
    if (open && !panel.contains(e.target) && !toggle.contains(e.target)) set(false);
  });

  // Jei ekranas padidėja į desktopą — uždaryti
  const mq = window.matchMedia("(min-width:961px)");
  const onChange = (e) => { if (e.matches && open) set(false); };
  if (mq.addEventListener) mq.addEventListener("change", onChange);
})();
