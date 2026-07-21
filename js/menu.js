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
  const layers = [document.getElementById("bgVideo"), document.getElementById("bgVideo2")].filter(Boolean);
  if (!layers.length) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const play = (v) => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  const CROSS = 0.9; // sekundžių persiliejimas prieš pabaigą
  let active = 0;

  play(layers[0]);

  if (layers.length < 2) {
    layers[0].loop = true;
  } else {
    layers.forEach((v, idx) => {
      v.addEventListener("timeupdate", () => {
        if (idx !== active) return;
        if (v.duration && v.currentTime >= v.duration - CROSS) {
          const next = (active + 1) % layers.length;
          const nv = layers[next];
          try { nv.currentTime = 0; } catch (e) {}
          play(nv);
          nv.classList.add("is-active");   // persilieja (opacity transition)
          v.classList.remove("is-active");
          active = next;
        }
      });
    });
  }

  // Visada groti (grįžus į skirtuką ir pan.)
  const ensure = () => { if (!document.hidden) play(layers[active]); };
  document.addEventListener("visibilitychange", ensure);
  window.addEventListener("pageshow", ensure);
  layers.forEach((v) => v.addEventListener("canplay", () => {
    if (v.classList.contains("is-active")) play(v);
  }));

  // Parallax nenaudojamas: video slenka kartu su puslapiu
})();
