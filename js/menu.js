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
  const bands = [...document.querySelectorAll(".vband__media")];
  if (!bands.length) return;

  const mqMobile = window.matchMedia("(max-width:960px)");
  const play = (v) => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  const CROSS = 0.9; // sekundžių persiliejimas prieš pabaigą

  bands.forEach((band) => {
    const layers = [...band.querySelectorAll(".vband__layer")];
    if (!layers.length) return;
    let active = 0;

    function applySource() {
      const src = mqMobile.matches ? band.dataset.mob : band.dataset.desk;
      if (!src) return;
      layers.forEach((v) => {
        if (v.getAttribute("src") !== src) { v.setAttribute("src", src); v.load(); }
      });
      if (band.dataset.poster) layers[0].setAttribute("poster", band.dataset.poster);
      active = 0;
      layers.forEach((v, i) => v.classList.toggle("is-active", i === 0));
      play(layers[0]);
    }

    let inView = true;

    layers.forEach((v, idx) => {
      // Persiliejimas (crossfade) prieš kartojant
      v.addEventListener("timeupdate", () => {
        if (idx !== active || layers.length < 2) return;
        if (v.duration && v.currentTime >= v.duration - CROSS) {
          const next = (active + 1) % layers.length;
          const nv = layers[next];
          try { nv.currentTime = 0; } catch (e) {}
          play(nv);
          nv.classList.add("is-active");
          v.classList.remove("is-active");
          active = next;
        }
      });
      v.addEventListener("canplay", () => {
        if (inView && v.classList.contains("is-active")) play(v);
      });
      // Atsarginis variantas: jei baigėsi be persiliejimo — paleisti iš naujo
      v.addEventListener("ended", () => {
        if (!v.classList.contains("is-active")) return;
        try { v.currentTime = 0; } catch (e) {}
        if (inView) play(v);
      });
      // Jei dekodavimas nepavyko — grįžti prie paprasto kartojimo
      v.addEventListener("error", () => {
        v.loop = true;
        try { v.load(); } catch (e) {}
        if (inView && v.classList.contains("is-active")) play(v);
      });
    });

    applySource();
    if (mqMobile.addEventListener) mqMobile.addEventListener("change", applySource);

    // Groja tik matoma juosta — taupo resursus ir išvengia dekoderio perkrovos
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          inView = e.isIntersecting;
          if (inView) play(layers[active]);
          else layers.forEach((v) => { try { v.pause(); } catch (err) {} });
        });
      }, { rootMargin: "200px 0px" }).observe(band);
    }

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && inView) play(layers[active]);
    });
    window.addEventListener("pageshow", () => { if (inView) play(layers[active]); });
  });
})();
