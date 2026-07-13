# Seaside Hair Master — svetainė

Prabangi pajūrio stiliaus plaukų studijos svetainė. Tamsaus režimo glassmorphism dizainas,
pilnai pritaikyta mobiliesiems, planšetėms ir kompiuteriams. Visas turinys — lietuvių kalba.
Grynas HTML/CSS/JS, be jokių build įrankių.

## Failų struktūra

```
hair salon/
├── index.html            # pagrindinis puslapis (visos sekcijos)
├── works.html            # kategorijos darbų puslapis (?cat=slug)
├── css/styles.css        # visi stiliai + responsive
├── js/
│   ├── gallery-data.js   # BENDRI galerijos duomenys (kategorijos + darbai)
│   ├── main.js           # pagrindinio puslapio interaktyvumas
│   └── works.js          # kategorijos puslapio logika
├── assets/img/           # ČIA dėkite savo nuotraukas (žr. PHOTOS.md)
└── README.md
```

## ❗ Nuotraukos (privaloma)

Nuotraukos dar neįkeltos — kortelėse matysite pilkus laukelius su užrašu „Įkelkite nuotrauką“.
Atidarykite **`assets/img/PHOTOS.md`** — ten lentelė, kokį failą kaip pavadinti
(`blonde-bob.jpg`, `balayage-wash.jpg` ir t.t.). Įmetus failus, jie iškart atsiras visur.

## Kaip paleisti

Dukart spustelėkite **index.html**. Arba per lokalų serverį (rekomenduojama):

```bash
npx serve .      # arba:  python -m http.server 8000
```

## Kas atnaujinta

1. **Pašalinti brūkšniai** ir logotipo ženklas — liko tik pavadinimas „Seaside Hair Master“.
2. **„Prieš / Po“** — 3 transformacijų kortelės (vidurinė iškelta), su nuotraukomis.
3. **Slenkanti animacija** — elementai plaukiai įslenka iš šonų / apačios slenkant tiek žemyn, tiek aukštyn.
4. **Galerija** — kategorijų karuselė. Paspaudus kategoriją atsidaro atskiras puslapis
   (`works.html`) su visais tos kategorijos darbais. Yra ir „Visi darbai“ kategorija.
5. **Naujas footer** — pavadinimas, aprašymas, nuorodų stulpeliai, socialinių tinklų ikonos,
   mygtukas „į viršų“ (adaptuota iš pateikto React komponento į vanilla).
6. **Žemėlapis** — Google Maps įterptas kontaktų sekcijoje.

## Kaip redaguoti turinį

- **Galerijos kategorijos ir darbai** → `js/gallery-data.js` (naudoja ir index, ir works puslapiai)
- **Paslaugos ir kainos** → `js/main.js`, objektas `SERVICES`
- **„Prieš / Po“ kortelės** → `index.html`, sekcija `id="transform"`
- **Kontaktai, darbo laikas, footer** → `index.html`

## ⚠️ Vietos, kurias reikia užpildyti tikrais duomenimis

Instagram profilis uždaras, tikrų kontaktų negalėjau nuskaityti — įrašyti laikini:
- **Adresas:** Naglių g. 12, Palanga  → pakeiskite tikru (footer, kontaktai IR žemėlapio `iframe` src)
- **Telefonas:** +370 600 00000
- **El. paštas:** studija@seasidehair.lt
- **Facebook / TikTok** nuorodos footeryje (`href="#"`)

Žemėlapio adresą keiskite `index.html` eilutėje su `google.com/maps?q=...`.

## Realios integracijos (kitas žingsnis)

Rezervacijos forma yra veikianti demonstracija. Produkcijai reikia: **Stripe** (apmokėjimas),
**Cal.com / Acuity** (kalendorius), backend/CMS (formos duomenų saugojimas ir el. laiškai).

Dizaino spalvos ir kintamieji — `css/styles.css` viršuje (`:root`).
