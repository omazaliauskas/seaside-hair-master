/* =========================================================
   Bendri galerijos duomenys (naudoja index.html ir works.html)
   Nuotraukas dėkite į assets/img/ (žr. PHOTOS.md)
   ========================================================= */
window.GALLERY_DATA = {
  // Kategorijos — rodomos kaip kortelės karuselėje.
  // slug naudojamas nuorodoje works.html?cat=slug
  categories: [
    {
      slug: "visi",
      title: "Visi darbai",
      desc: "Pilna transformacijų ir stilizavimo darbų kolekcija vienoje vietoje.",
      cover: "assets/img/long-ombre.jpg"
    },
    {
      slug: "sviesus",
      title: "Šviesūs plaukai",
      desc: "Blondinės, sruogelės ir švytinčios šaltos spalvos, sukurtos individualiai.",
      cover: "assets/img/blonde-closeup.jpg"
    },
    {
      slug: "balayage",
      title: "Balajažas",
      desc: "Rankomis tapyti, saulės pabučiuoti perėjimai ir natūralus švytėjimas.",
      cover: "assets/img/balayage-wash.jpg"
    },
    {
      slug: "tamsus",
      title: "Tamsūs plaukai",
      desc: "Sodrūs šokoladiniai ir riešuto atspalviai su blizgesio užbaigimu.",
      cover: "assets/img/long-brown.jpg"
    },
    {
      slug: "stilizavimas",
      title: "Stilizavimas",
      desc: "Profesionalus pūtimas, garbanos ir šventinės šukuosenos.",
      cover: "assets/img/stylist-blowdry.jpg"
    }
  ],

  // Visi darbai. cats — kurioms kategorijoms priklauso (be „visi“, jis automatinis).
  works: [
    { img: "assets/img/blonde-bob.jpg",       title: "Švytintis blond bob",        cats: ["sviesus"] },
    { img: "assets/img/blonde-closeup.jpg",   title: "Perlinė blondinė",           cats: ["sviesus"] },
    { img: "assets/img/foils-highlights.jpg", title: "Sruogelės su folijomis",     cats: ["sviesus", "balayage"] },
    { img: "assets/img/balayage-wash.jpg",    title: "Karamelinis balajažas",      cats: ["balayage"] },
    { img: "assets/img/long-ombre.jpg",       title: "Ilgas ombre balajažas",      cats: ["balayage", "sviesus"] },
    { img: "assets/img/long-brown.jpg",       title: "Ilgi tamsūs plaukai",        cats: ["tamsus"] },
    { img: "assets/img/styling-dryer.jpg",    title: "Pūtimas ir stilizavimas",    cats: ["stilizavimas"] },
    { img: "assets/img/stylist-blowdry.jpg",  title: "Profesionalus pūtimas",      cats: ["stilizavimas"] }
  ]
};
