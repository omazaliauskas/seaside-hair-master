/* =========================================================
   Seaside Hair Master · interaktyvumas
   ========================================================= */
(function () {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =======================================================
     NAV
     ======================================================= */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const burger = $("#burger");
  const drawer = $("#drawer");
  burger.addEventListener("click", () => {
    const open = drawer.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open);
  });
  $$("#drawer a").forEach((a) =>
    a.addEventListener("click", () => {
      drawer.classList.remove("is-open");
      burger.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    })
  );

  /* =======================================================
     REVEAL — dvikryptė slenkanti animacija (aukštyn / žemyn)
     ======================================================= */
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.target.classList.toggle("is-in", e.isIntersecting));
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    $$(".reveal, .fade-line").forEach((el) => io.observe(el));

    $$(".reveal-word").forEach((w, i) => {
      w.animate(
        [
          { opacity: 0, transform: "translateY(40px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        { duration: 900, delay: 250 + i * 130, easing: "cubic-bezier(.22,.61,.36,1)", fill: "forwards" }
      );
    });
  } else {
    $$(".reveal, .fade-line, .reveal-word").forEach((el) => el.classList.add("is-in"));
  }

  /* =======================================================
     HERO — vandens raibuliukai sekantys pelę
     ======================================================= */
  const canvas = $("#rippleCanvas");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr;
    const ripples = [];
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let last = 0;
    const hero = $("#hero");
    hero.addEventListener("pointermove", (e) => {
      const now = performance.now();
      if (now - last < 42) return;
      last = now;
      const r = canvas.getBoundingClientRect();
      ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 4, a: 0.5 });
      if (ripples.length > 40) ripples.shift();
    });

    (function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 2.4; rp.a *= 0.955;
        if (rp.a < 0.01) { ripples.splice(i, 1); continue; }
        const g = ctx.createRadialGradient(rp.x, rp.y, Math.max(0, rp.r - 10), rp.x, rp.y, rp.r);
        g.addColorStop(0, "rgba(169,217,245,0)");
        g.addColorStop(0.8, `rgba(169,217,245,${rp.a * 0.4})`);
        g.addColorStop(1, `rgba(245,230,202,0)`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.stroke();
      }
      requestAnimationFrame(draw);
    })();
  }

  /* =======================================================
     PARTICLES — subtilus judantis fonas
     ======================================================= */
  const pcanvas = $("#particles");
  if (pcanvas && !reduceMotion) {
    const pctx = pcanvas.getContext("2d");
    let W, H, DPR, parts = [];
    const colors = ["rgba(169,217,245,", "rgba(245,230,202,", "rgba(185,168,240,"];
    function presize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = pcanvas.clientWidth; H = pcanvas.clientHeight;
      pcanvas.width = W * DPR; pcanvas.height = H * DPR;
      pctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.max(24, Math.min(70, Math.round((W * H) / 26000)));
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 2 + 0.6,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
        a: Math.random() * 0.4 + 0.14,
        c: colors[(Math.random() * colors.length) | 0]
      }));
    }
    presize();
    window.addEventListener("resize", presize);
    (function drawP() {
      pctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -5) p.x = W + 5; else if (p.x > W + 5) p.x = -5;
        if (p.y < -5) p.y = H + 5; else if (p.y > H + 5) p.y = -5;
        pctx.beginPath();
        pctx.fillStyle = p.c + p.a + ")";
        pctx.shadowBlur = 8; pctx.shadowColor = p.c + "0.5)";
        pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        pctx.fill();
      }
      requestAnimationFrame(drawP);
    })();
  }

  /* =======================================================
     BEFORE / AFTER — slankikliai showcase kortelėse
     ======================================================= */
  $$(".bax").forEach((el) => {
    const before = el.querySelector(".bax__before");
    const handle = el.querySelector(".bax__handle");
    let dragging = false;
    const set = (pct) => {
      pct = Math.max(5, Math.min(95, pct));
      before.style.width = pct + "%";
      handle.style.left = pct + "%";
    };
    const from = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      set((x / r.width) * 100);
    };
    el.addEventListener("pointerdown", (e) => { dragging = true; from(e); try { el.setPointerCapture(e.pointerId); } catch (_) {} });
    el.addEventListener("pointermove", (e) => { if (dragging) from(e); });
    el.addEventListener("pointerup", () => (dragging = false));
    el.addEventListener("pointercancel", () => (dragging = false));
  });

  /* =======================================================
     SERVICES — tabs + 3D tilt + cursor thumbnail
     ======================================================= */
  const SERVICES = {
    cuts: [
      { n: "Signatūrinis kirpimas", d: "Individualiai pritaikytas kirpimas pagal veido formą ir plaukų kritimą. Įskaitant konsultaciją ir signatūrinį stilizavimą.", p: "nuo 55 €", img: "assets/img/blonde-bob.jpg" },
      { n: "Precizinis kirpimas su formos modeliavimu", d: "Tekstūros kūrimas, sluoksniavimas ir tobulos linijos ilgiems bei vidutinio ilgio plaukams.", p: "nuo 65 €", img: "assets/img/long-brown.jpg" },
      { n: "Kirpčiukų korekcija", d: "Greitas kirpčiukų atnaujinimas tarp vizitų, kad forma visada būtų tobula.", p: "nuo 20 €", img: "assets/img/blonde-closeup.jpg" },
      { n: "Pūtimas ir stilizavimas", d: "Profesionalus plaukų pūtimas, garbanos ar tiesinimas ypatingoms progoms.", p: "nuo 40 €", img: "assets/img/stylist-blowdry.jpg" }
    ],
    color: [
      { n: "Signatūrinis pajūrio balajažas", d: "Rankomis tapyti, saulės pabučiuoti sruogeliai pagal natūralų plaukų kritimą. Įskaitant šaknų šešėlį, gloss toną ir signatūrinį pūtimą.", p: "nuo 180 €", img: "assets/img/balayage-wash.jpg" },
      { n: "Airtouch technika", d: "Švelniausi perėjimai naudojant oro srauto techniką natūraliausiam šviesėjimui be ryškių ribų.", p: "nuo 210 €", img: "assets/img/long-ombre.jpg" },
      { n: "Sruogelės su folijomis", d: "Tikslus šviesinimas folijomis sodresniam ir spindinčiam blondo efektui.", p: "nuo 150 €", img: "assets/img/foils-highlights.jpg" },
      { n: "Gloss & tono atnaujinimas", d: "Spalvos gaivinimas, blizgesio suteikimas ir tono korekcija tarp dažymų.", p: "nuo 45 €", img: "assets/img/blonde-closeup.jpg" }
    ],
    care: [
      { n: "Olaplex atkuriamoji terapija", d: "Gilus plaukų struktūros atkūrimas molekuliniu lygiu pažeistiems ir dažytiems plaukams.", p: "nuo 40 €", img: "assets/img/balayage-wash.jpg" },
      { n: "Prabangi drėkinamoji priežiūra", d: "Intensyvi kaukė su masažu ir garų terapija. Plaukai atgauna elastingumą ir švytėjimą.", p: "nuo 35 €", img: "assets/img/long-ombre.jpg" },
      { n: "Šventinis stilizavimas", d: "Sudėtingos šukuosenos, garbanos ar banguoti pajūrio motyvai ypatingoms progoms.", p: "nuo 60 €", img: "assets/img/styling-dryer.jpg" },
      { n: "Plaukų priauginimas Great Lengths", d: "Natūralių plaukų priauginimas apimčiai arba ilgiui, naudojant premium keratino kapsules.", p: "nuo 350 €", img: "assets/img/long-brown.jpg" }
    ]
  };

  const listEl = $("#servicesList");
  const thumb = $("#serviceThumb");
  let curX = 0, curY = 0, thumbX = 0, thumbY = 0, thumbRAF = null;

  function renderServices(cat) {
    listEl.innerHTML = SERVICES[cat]
      .map(
        (s) => `
      <article class="service" data-img="${s.img}">
        <div class="service__main">
          <h3>${s.n}</h3>
          <p>${s.d}</p>
        </div>
        <div class="service__price">
          <b>${s.p}</b><span>Kaina</span>
          <div class="service__book"><a href="#booking">Rezervuoti →</a></div>
        </div>
      </article>`
      )
      .join("");

    $$(".service", listEl).forEach((el) => {
      const img = el.dataset.img;
      el.addEventListener("pointermove", (e) => {
        if (window.innerWidth < 720) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${py * -5}deg) rotateY(${px * 6}deg) translateY(-2px)`;
        curX = e.clientX; curY = e.clientY;
      });
      el.addEventListener("pointerenter", () => {
        if (window.innerWidth < 720) return;
        thumb.style.backgroundImage = `url('${img}')`;
        thumb.classList.add("is-visible");
        if (!thumbRAF) followThumb();
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
        thumb.classList.remove("is-visible");
      });
    });
  }
  function followThumb() {
    thumbX += (curX - thumbX) * 0.18;
    thumbY += (curY - thumbY) * 0.18;
    thumb.style.left = thumbX + "px";
    thumb.style.top = thumbY + "px";
    thumbRAF = thumb.classList.contains("is-visible") ? requestAnimationFrame(followThumb) : null;
  }

  $$(".tab").forEach((t) =>
    t.addEventListener("click", () => {
      $$(".tab").forEach((x) => { x.classList.remove("is-active"); x.setAttribute("aria-selected", "false"); });
      t.classList.add("is-active"); t.setAttribute("aria-selected", "true");
      renderServices(t.dataset.tab);
    })
  );
  renderServices("cuts");

  /* =======================================================
     GALLERY — kategorijų karuselė
     ======================================================= */
  const track = $("#galleryTrack");
  const data = window.GALLERY_DATA;
  if (track && data) {
    track.innerHTML = data.categories
      .map((c) => {
        const count = c.slug === "visi"
          ? data.works.length
          : data.works.filter((w) => w.cats.includes(c.slug)).length;
        return `
        <a class="gcard" href="works.html?cat=${c.slug}">
          <div class="gcard__img" style="background-image:url('${c.cover}')"></div>
          <div class="gcard__shade"></div>
          <div class="gcard__body">
            <span class="gcard__count">${count} darbai</span>
            <h3>${c.title}</h3>
            <p>${c.desc}</p>
            <span class="gcard__link">Peržiūrėti
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </span>
          </div>
        </a>`;
      })
      .join("");

    const dotsWrap = $("#galleryDots");
    const prev = $("#galPrev");
    const next = $("#galNext");
    const cards = $$(".gcard", track);
    dotsWrap.innerHTML = cards.map((_, i) => `<button class="gdot" aria-label="Kortelė ${i + 1}"></button>`).join("");
    const dots = $$(".gdot", dotsWrap);

    const step = () => (cards[0] ? cards[0].offsetWidth + 20 : 340);
    const activeIndex = () => Math.round(track.scrollLeft / step());

    function sync() {
      const i = activeIndex();
      dots.forEach((d, k) => d.classList.toggle("is-active", k === i));
      prev.disabled = track.scrollLeft < 8;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    }
    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
    dots.forEach((d, i) =>
      d.addEventListener("click", () => track.scrollTo({ left: i * step(), behavior: "smooth" }))
    );
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();
  }

  /* =======================================================
     BOOKING
     ======================================================= */
  const form = $("#bookingForm");
  const panels = $$(".booking__panel");
  const stepsLi = $$("#bookingSteps li");
  let step = 1;
  const booking = { date: null, time: null };

  function goStep(n) {
    step = n;
    panels.forEach((p) => p.classList.toggle("is-active", +p.dataset.step === n));
    stepsLi.forEach((li) => {
      const s = +li.dataset.step;
      li.classList.toggle("is-active", s === n);
      li.classList.toggle("is-done", s < n);
    });
    if (n === 3) buildSummary();
    $("#booking").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validateStep1() {
    let ok = true;
    ["bName", "bEmail", "bPhone"].forEach((id) => {
      const inp = $("#" + id);
      const field = inp.closest(".field");
      const valid = inp.value.trim() && (inp.type !== "email" || /.+@.+\..+/.test(inp.value));
      field.classList.toggle("invalid", !valid);
      if (!valid) ok = false;
    });
    return ok;
  }

  $$("[data-next]").forEach((b) =>
    b.addEventListener("click", () => {
      const target = +b.dataset.next;
      if (step === 1 && !validateStep1()) return;
      if (step === 2 && !(booking.date && booking.time)) return;
      goStep(target);
    })
  );
  $$("[data-prev]").forEach((b) => b.addEventListener("click", () => goStep(+b.dataset.prev)));

  const dz = $("#dropzone");
  const fileInput = $("#bFiles");
  const fileList = $("#fileList");
  function showFiles(files) {
    const arr = [...files].slice(0, 3);
    fileList.textContent = arr.length ? arr.map((f) => f.name).join(", ") : "Priimami JPG / PNG, iki 3 nuotraukų";
  }
  fileInput.addEventListener("change", () => showFiles(fileInput.files));
  ["dragover", "dragenter"].forEach((ev) =>
    dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add("is-drag"); })
  );
  ["dragleave", "drop"].forEach((ev) =>
    dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove("is-drag"); })
  );
  dz.addEventListener("drop", (e) => {
    if (e.dataTransfer.files.length) { fileInput.files = e.dataTransfer.files; showFiles(e.dataTransfer.files); }
  });

  const calEl = $("#calendar");
  const slotsWrap = $("#timeslots");
  const slotGrid = $("#slotGrid");
  const slotDate = $("#slotDate");
  const toStep3 = $("#toStep3");
  const DOW = ["Pr", "An", "Tr", "Kt", "Pn", "Št", "Sk"];
  const MONTHS = ["sausio","vasario","kovo","balandžio","gegužės","birželio","liepos","rugpjūčio","rugsėjo","spalio","lapkričio","gruodžio"];

  function buildCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const first = new Date(year, month, 1);
    const startDow = (first.getDay() + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();

    let html = DOW.map((d) => `<div class="calendar__dow">${d}</div>`).join("");
    for (let i = 0; i < startDow; i++) html += `<div class="calendar__day is-empty"></div>`;
    for (let d = 1; d <= days; d++) {
      const date = new Date(year, month, d);
      const past = date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const closed = date.getDay() === 0;
      const disabled = past || closed;
      html += `<button type="button" class="calendar__day" data-day="${d}" ${disabled ? "disabled" : ""}>${d}</button>`;
    }
    calEl.innerHTML = html;

    $$(".calendar__day[data-day]", calEl).forEach((btn) =>
      btn.addEventListener("click", () => {
        $$(".calendar__day", calEl).forEach((x) => x.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        booking.date = new Date(year, month, +btn.dataset.day);
        slotDate.textContent = `${MONTHS[month]} ${btn.dataset.day} d.`;
        buildSlots(+btn.dataset.day % 6 === 0);
        slotsWrap.hidden = false;
        booking.time = null; toStep3.disabled = true;
      })
    );
  }
  function buildSlots(short) {
    const base = ["9:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00"];
    const times = short ? base.slice(0, 4) : base;
    slotGrid.innerHTML = times.map((t) => `<button type="button" class="slot" data-t="${t}">${t}</button>`).join("");
    $$(".slot", slotGrid).forEach((s) =>
      s.addEventListener("click", () => {
        $$(".slot", slotGrid).forEach((x) => x.classList.remove("is-selected"));
        s.classList.add("is-selected");
        booking.time = s.dataset.t;
        toStep3.disabled = false;
      })
    );
  }
  buildCalendar();

  function buildSummary() {
    const name = $("#bName").value || "·";
    const service = $("#bService").value;
    const dateStr = booking.date
      ? `${MONTHS[booking.date.getMonth()]} ${booking.date.getDate()} d., ${booking.time}`
      : "·";
    $("#summary").innerHTML = `
      <div class="summary__row"><span>Klientė</span><b>${name}</b></div>
      <div class="summary__row"><span>Paslauga</span><b>${service}</b></div>
      <div class="summary__row"><span>Laikas</span><b>${dateStr}</b></div>
      <div class="summary__row summary__total"><span>Konsultacijos avansas</span><b>50 €</b></div>`;
  }

  const card = $("#cCard");
  if (card) card.addEventListener("input", () => {
    card.value = card.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  });
  const exp = $("#cExp");
  if (exp) exp.addEventListener("input", () => {
    let v = exp.value.replace(/\D/g, "").slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    exp.value = v;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    panels.forEach((p) => (p.style.display = "none"));
    $("#bookingSteps").style.display = "none";
    $("#bookingSuccess").hidden = false;
    $(".booking__card").scrollIntoView({ behavior: "smooth", block: "center" });
  });

  /* =======================================================
     FOOTER — scroll to top + metai
     ======================================================= */
  const footTop = $("#footTop");
  if (footTop) footTop.addEventListener("click", () => window.scroll({ top: 0, behavior: "smooth" }));
  const yr = $("#footYear");
  if (yr) yr.textContent = new Date().getFullYear();
})();
