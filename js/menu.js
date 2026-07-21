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

/* =========================================================
   Fono video — visada groja + parallax
   ========================================================= */
(function () {
  "use strict";
  const v = document.getElementById("bgVideo");
  if (!v) return;

  const tryPlay = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  v.addEventListener("canplay", tryPlay);
  v.addEventListener("loadeddata", tryPlay);
  v.addEventListener("pause", () => { if (!document.hidden) tryPlay(); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) tryPlay(); });
  window.addEventListener("pageshow", tryPlay);
  tryPlay();

  // Parallax slenkant (ribotas, kad neatidengtų kraštų)
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const cap = window.innerHeight * 0.07;
      const y = Math.min(window.scrollY * 0.08, cap);
      v.style.transform = `translate3d(0, ${y}px, 0) scale(1.04)`;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }
})();
