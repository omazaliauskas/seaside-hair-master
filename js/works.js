/* =========================================================
   Kategorijos darbų puslapis (works.html?cat=slug)
   ========================================================= */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const data = window.GALLERY_DATA || { categories: [], works: [] };

  const params = new URLSearchParams(location.search);
  let current = params.get("cat") || "visi";
  if (!data.categories.some((c) => c.slug === current)) current = "visi";

  const byId = (slug) => data.categories.find((c) => c.slug === slug);
  const worksFor = (slug) =>
    slug === "visi" ? data.works : data.works.filter((w) => w.cats.includes(slug));

  /* ---- filtrų juosta ---- */
  const filters = $("#worksFilters");
  filters.innerHTML = data.categories
    .map(
      (c) =>
        `<a class="pill ${c.slug === current ? "is-active" : ""}" href="works.html?cat=${c.slug}">${c.title}</a>`
    )
    .join("");

  /* ---- antraštė ---- */
  const cat = byId(current);
  $("#worksTitle").textContent = cat.title;
  $("#worksDesc").textContent = cat.desc;
  $("#worksEyebrow").textContent = current === "visi" ? "Portfolio" : "Kategorija";
  document.title = cat.title + " · Seaside Hair Master";

  /* ---- tinklelis ---- */
  const grid = $("#worksGrid");
  const items = worksFor(current);
  if (!items.length) {
    grid.innerHTML = `<p class="works__empty">Šioje kategorijoje darbų dar nėra. Netrukus papildysime.</p>`;
  } else {
    grid.innerHTML = items
      .map(
        (w, i) => `
      <figure class="wtile reveal" data-reveal="up" data-i="${i}" style="transition-delay:${(i % 3) * 90}ms">
        <img src="${w.img}" alt="${w.title}" loading="lazy" onerror="this.closest('.wtile').classList.add('is-broken')" />
        <figcaption>${w.title}</figcaption>
      </figure>`
      )
      .join("");
  }

  /* ---- reveal ---- */
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => e.target.classList.toggle("is-in", e.isIntersecting)),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---- lightbox ---- */
  const lb = $("#lightbox");
  const photo = $("#lightboxPhoto");
  grid.addEventListener("click", (e) => {
    const tile = e.target.closest(".wtile");
    if (!tile || tile.classList.contains("is-broken")) return;
    photo.src = items[+tile.dataset.i].img;
    photo.alt = items[+tile.dataset.i].title;
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
  const close = () => {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };
  $("#lightboxClose").addEventListener("click", close);
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  /* Mobilųjį meniu tvarko js/menu.js */

  $("#footYear").textContent = new Date().getFullYear();
})();
