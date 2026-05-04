import { useState, useRef, useEffect, useCallback } from "react";

// ============================================================
//  📖  CONFIGURATION — Modifiez tout ici !
// ============================================================

const RESTAURANT = {
  name: "Bonzai Coffee Lounge",        // Nom du restaurant
  tagline: "Restaurant Gastronomique", // Sous-titre couverture
  location: "Paris",
  since: "1987",
  chef: "Chef Jean-Pierre Moreau",
  address: "12 Rue des Lilas · Paris 6ème",
  phone: "+33 1 42 86 55 40",
  website: "lejardinsecret.fr",
  welcomeText:
    "Chers convives, bienvenue dans notre maison.\nChaque assiette est une lettre d'amour\nà la cuisine française.\n\nLaissez-vous porter par les saveurs,\nles textures et les émotions\nque notre chef a imaginées pour vous.",
};

// Chaque objet = une page du menu.
// type: "cover" | "welcome" | "menu" | "formulas" | "wines" | "backcover"
// Pour "menu": sections[] avec items[]
// Pour "wines": categories[] avec items[]
// Pour "formulas": formulas[]
const PAGES = [
  // ── Page 0: Couverture (générée auto depuis RESTAURANT) ──
  { type: "cover" },

  // ── Page 1: Bienvenue (générée auto depuis RESTAURANT) ──
  { type: "welcome" },

  // ── Page 2: Amuse-bouches ──
  {
    type: "menu",
    tag: "À Partager",
    title: "Amuse-Bouches",
    pageNumber: "2",
    sections: [
      {
        items: [
          { name: "Velouté de Champignons",  price: "12€", desc: "Truffes noires, crème légère, mousse de parmesan" },
          { name: "Foie Gras Mi-Cuit",        price: "22€", desc: "Chutney de figues, pain brioché toasté, fleur de sel" },
          { name: "Tartare de Saumon",        price: "18€", desc: "Avocat crémeux, citron caviar, chips de tapioca" },
          { name: "Burrata Maison",           price: "16€", desc: "Tomates anciennes, basilic, huile d'olive AOP" },
          { name: "Bisque de Homard",         price: "20€", desc: "Pince de homard, crème fouettée au cognac" },
          { name: "Gougères au Comté",        price: "9€",  desc: "Choux légers, fromage affiné 18 mois" },
          { name: "Rillettes de Canard",      price: "14€", desc: "Confit maison, cornichons, pain de campagne grillé" },
        ],
      },
    ],
  },

  // ── Page 3: Entrées ──
  {
    type: "menu",
    tag: "Nos",
    title: "Entrées",
    pageNumber: "3",
    sections: [
      {
        items: [
          { name: "Carpaccio de Saint-Jacques", price: "26€", desc: "Clémentine, gingembre confit, huile de noisette" },
          { name: "Terrine de Campagne",         price: "15€", desc: "Cornichons maison, moutarde de Meaux, brioche" },
          { name: "Salade de Homard Breton",     price: "34€", desc: "Mangue, avocat, vinaigrette passion-coriandre" },
          { name: "Œuf Parfait 64°",             price: "17€", desc: "Crème de maïs, lardons fumés, herbes fraîches" },
          { name: "Asperges Blanches",           price: "21€", desc: "Hollandaise légère, jambon ibérique, noisettes" },
          { name: "Velouté d'Artichaut",         price: "16€", desc: "Huile de truffe, copeaux de parmesan, croûtons" },
          { name: "Ceviche de Bar",              price: "24€", desc: "Lait de tigre, coriandre, poivrons doux marinés" },
        ],
      },
    ],
  },

  // ── Page 4: Poissons ──
  {
    type: "menu",
    tag: "Plats",
    title: "Poissons & Fruits de Mer",
    pageNumber: "4",
    sections: [
      {
        items: [
          { name: "Bar en Croûte d'Herbes",   price: "38€", desc: "Beurre blanc au champagne, légumes printaniers" },
          { name: "Sole Meunière",             price: "42€", desc: "Beurre noisette clarifié, câpres, citron confit" },
          { name: "Homard Thermidor",          price: "68€", desc: "Gratin de parmesan, sauce américaine, riz sauvage" },
          { name: "Turbot Rôti",               price: "52€", desc: "Artichaut barigoule, vierge au basilic, fleurs" },
          { name: "Saint-Jacques Snackées",    price: "46€", desc: "Velouté de chou-fleur, caviar d'Aquitaine" },
          { name: "Daurade Royale",            price: "36€", desc: "Fenouil confit, tapenade, huile d'olive vierge" },
          { name: "Risotto aux Langoustines",  price: "44€", desc: "Bisque corsée, parmesan 24 mois, basilic frais" },
        ],
      },
    ],
  },

  // ── Page 5: Viandes ──
  {
    type: "menu",
    tag: "Plats",
    title: "Viandes & Volailles",
    pageNumber: "5",
    sections: [
      {
        items: [
          { name: "Filet de Bœuf Rossini",      price: "58€", desc: "Foie gras poêlé, sauce Périgueux, pommes darphin" },
          { name: "Côte de Veau à la Crème",    price: "48€", desc: "Morilles fraîches, gratin dauphinois, herbes" },
          { name: "Pigeon Rôti en Cocotte",     price: "44€", desc: "Jus corsé, petits pois, lardons, oignons grelots" },
          { name: "Canard à l'Orange",          price: "42€", desc: "Sauce bigarade, navets caramélisés, pommes Anna" },
          { name: "Agneau des Pyrénées",        price: "54€", desc: "Jus de romarin, aubergine fondante, tapenade" },
          { name: "Poulet de Bresse Rôti",      price: "38€", desc: "Jus naturel, légumes du jardin glacés au beurre" },
          { name: "Ris de Veau Croustillant",   price: "46€", desc: "Sauce aux morilles, purée de céleri, chips dorées" },
        ],
      },
    ],
  },

  // ── Page 6: Desserts ──
  {
    type: "menu",
    tag: "Pour Finir",
    title: "Desserts",
    pageNumber: "6",
    sections: [
      {
        items: [
          { name: "Soufflé Grand Marnier",        price: "16€", desc: "Crème anglaise à la vanille Bourbon" },
          { name: "Tarte Tatin Revisitée",        price: "14€", desc: "Pommes caramélisées, glace calvados, caramel beurre salé" },
          { name: "Fondant Chocolat Araguani",    price: "15€", desc: "Cœur coulant, sorbet praliné, tuile dentelle" },
          { name: "Crème Brûlée Lavande",         price: "12€", desc: "Tuile caramel, fraises des bois, menthe fraîche" },
          { name: "Île Flottante Dorée",          price: "11€", desc: "Crème anglaise, pralines roses, amandes effilées" },
          { name: "Baba au Rhum",                 price: "13€", desc: "Chantilly maison, ananas rôti, zestes d'agrumes" },
          { name: "Paris-Brest Revisité",         price: "14€", desc: "Crème pralinée, noisettes torréfiées, caramel" },
        ],
      },
    ],
  },

  // ── Page 7: Vins ──
  {
    type: "wines",
    tag: "Sélection du Sommelier",
    title: "Carte des Vins",
    pageNumber: "7",
    categories: [
      {
        label: "Vins Blancs",
        items: [
          { name: "Chablis 1er Cru",        price: "54€", desc: "Domaine Defaix · minéral, tendu, persistant" },
          { name: "Meursault 2019",          price: "82€", desc: "Dom. Leflaive · beurre frais, noisette, fleurs blanches" },
          { name: "Condrieu 2020",           price: "76€", desc: "E. Guigal · abricot, miel, viognier très floral" },
        ],
      },
      {
        label: "Vins Rouges",
        items: [
          { name: "Pomerol 2016",            price: "96€",  desc: "Ch. La Fleur-Pétrus · velours, truffe, fruits confits" },
          { name: "Gevrey-Chambertin 2018",  price: "110€", desc: "Rossignol-Trapet · tannins soyeux, cerise, sous-bois" },
          { name: "Côte-Rôtie 2017",         price: "88€",  desc: "Chapoutier · épices, olive noire, syrah élégante" },
        ],
      },
    ],
  },

  // ── Page 8: Formules ──
  {
    type: "formulas",
    tag: "Nos",
    title: "Formules",
    pageNumber: "8",
    note: "Tous nos plats sont préparés avec des produits frais et de saison.\nAllergènes disponibles sur demande.",
    formulas: [
      {
        name: "Menu Découverte",
        price: "68€",
        desc: "Amuse-bouche · Entrée · Plat · Dessert · Mignardises",
      },
      {
        name: "Menu Prestige",
        price: "110€",
        desc: "Amuse-bouche · 2 Entrées · Trou normand · Plat · Fromages · Dessert · Mignardises",
      },
      {
        name: "Menu Dégustation",
        price: "165€",
        desc: "7 services · Accord mets-vins disponible · +85€ / personne",
      },
    ],
  },

  // ── Page 9: 4ème de couverture (générée auto depuis RESTAURANT) ──
  { type: "backcover" },
];

// ============================================================
//  🎨  THEME COLORS
// ============================================================
const T = {
  cream:    "#f6eedd",
  paper:    "#f0e6d0",
  deep:     "#1e0f06",
  brown:    "#5a3820",
  gold:     "#c9a050",
  gold2:    "#e8c96a",
  darkBg:   "#110805",
};

// ============================================================
//  📐  PAGE RENDERERS
// ============================================================

const GoldLine = ({ style = {} }) => (
  <div style={{
    width: "100%", height: 1,
    background: `linear-gradient(to right, transparent, ${T.gold}, transparent)`,
    margin: "10px 0", ...style
  }} />
);

const DotLine = ({ style = {} }) => (
  <div style={{
    width: "54%", height: 1,
    background: `linear-gradient(to right, transparent, rgba(90,56,32,0.4), transparent)`,
    margin: "7px auto", ...style
  }} />
);

const PageNumber = ({ n }) => (
  <div style={{
    fontFamily: "'EB Garamond', serif", fontSize: "0.76em",
    color: T.gold, letterSpacing: "0.2em", textAlign: "center",
    marginTop: "auto", paddingTop: 10,
  }}>— {n} —</div>
);

const InsetBorder = () => (
  <div style={{
    position: "absolute", inset: 14,
    border: `1px solid rgba(180,138,55,0.28)`,
    pointerEvents: "none", zIndex: 3,
  }}>
    <div style={{
      position: "absolute", inset: 5,
      border: `1px solid rgba(180,138,55,0.12)`,
    }} />
  </div>
);

const MenuItem = ({ item }) => (
  <div style={{ marginBottom: "clamp(9px,1.7vh,16px)" }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
      <span style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(0.82rem,1.35vw,1rem)",
        fontWeight: 700, color: T.deep, flexShrink: 0,
      }}>{item.name}</span>
      <span style={{
        flex: 1, borderBottom: "1px dotted #c4a472",
        marginBottom: 3, minWidth: 10,
      }} />
      <span style={{
        fontFamily: "'EB Garamond', serif",
        fontSize: "0.93em", color: T.brown,
        flexShrink: 0, fontStyle: "italic",
      }}>{item.price}</span>
    </div>
    {item.desc && (
      <div style={{
        fontSize: "0.73em", color: "#8a6040",
        fontStyle: "italic", lineHeight: 1.52, marginTop: 2,
      }}>{item.desc}</div>
    )}
  </div>
);

const PageWrapper = ({ children, dark = false }) => (
  <div style={{
    position: "absolute", inset: 0,
    background: dark
      ? `linear-gradient(148deg, #1c0e06 0%, #0d0603 60%, #1a0c06 100%)`
      : T.cream,
    display: "flex", flexDirection: "column",
    overflow: "hidden",
  }}>
    {children}
  </div>
);

const ContentBox = ({ children }) => (
  <div style={{
    position: "relative", zIndex: 2,
    height: "100%",
    padding: "clamp(24px,4.5vh,56px) clamp(22px,5vw,72px)",
    display: "flex", flexDirection: "column",
  }}>
    {children}
  </div>
);

// ── COVER ──
const CoverPage = () => (
  <PageWrapper dark>
    <div style={{
      position: "absolute", inset: 18,
      border: `1px solid rgba(201,160,80,0.40)`,
      pointerEvents: "none", zIndex: 2,
    }}>
      <div style={{ position: "absolute", inset: 7, border: `1px solid rgba(201,160,80,0.15)` }} />
    </div>
    <div style={{
      position: "absolute", inset: 0, zIndex: 1,
      background: "radial-gradient(ellipse 65% 45% at 50% 42%, rgba(120,58,8,0.22) 0%, transparent 70%)",
    }} />
    <div style={{
      position: "relative", zIndex: 3, height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "48px", color: T.cream,
    }}>
      <div style={{ fontSize: "clamp(2.8rem,6vw,5rem)", marginBottom: 18, filter: "drop-shadow(0 3px 18px rgba(201,160,80,0.28))" }}>🌿</div>
      <div style={{ color: T.gold, letterSpacing: "0.55em", fontSize: "0.85em", marginBottom: 16 }}>✦ &nbsp; ✦ &nbsp; ✦</div>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(3rem,7.5vw,6.5rem)",
        fontStyle: "italic", fontWeight: 400,
        color: T.gold2, lineHeight: 1.05,
        textShadow: "0 4px 32px rgba(0,0,0,0.55)",
      }}>{RESTAURANT.name.split(" ").slice(0,2).join("\n")}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem,7.5vw,6.5rem)", fontStyle: "italic", color: T.gold2, lineHeight: 1.05 }}>
        {RESTAURANT.name}
      </div>
      <div style={{ fontSize: "clamp(0.65rem,1.4vw,0.95rem)", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(246,238,221,0.5)", marginTop: 10 }}>
        {RESTAURANT.tagline}
      </div>
      <div style={{ width: 110, height: 1, background: `linear-gradient(to right, transparent, ${T.gold}, transparent)`, margin: "20px auto" }} />
      <div style={{ fontSize: "0.82em", color: T.gold, letterSpacing: "0.22em" }}>
        ✦ &nbsp; {RESTAURANT.location} &nbsp;·&nbsp; Depuis {RESTAURANT.since} &nbsp; ✦
      </div>
      <div style={{
        position: "absolute", bottom: 34, right: 38,
        fontSize: "0.68em", letterSpacing: "0.2em", textTransform: "uppercase",
        color: "rgba(201,160,80,0.42)", display: "flex", alignItems: "center", gap: 7,
      }}>
        Glisser <span style={{ animation: "nudge 2.2s ease-in-out infinite" }}>→</span>
      </div>
    </div>
  </PageWrapper>
);

// ── WELCOME ──
const WelcomePage = () => (
  <PageWrapper>
    <InsetBorder />
    <ContentBox>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ fontSize: "clamp(2rem,5vw,3.5rem)", marginBottom: 16 }}>🌹</div>
        <GoldLine style={{ width: 70, margin: "0 auto 16px" }} />
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem,3.5vw,2.7rem)", fontStyle: "italic", color: T.deep }}>Bienvenue</div>
        <DotLine />
        <p style={{ fontSize: "clamp(0.8rem,1.55vw,1.08rem)", color: T.brown, lineHeight: 2.05, fontStyle: "italic", marginTop: 16, maxWidth: 500, whiteSpace: "pre-line" }}>
          {RESTAURANT.welcomeText}
        </p>
        <GoldLine style={{ width: 70, margin: "26px auto 12px" }} />
        <div style={{ fontSize: "0.7em", letterSpacing: "0.25em", color: T.gold, textTransform: "uppercase" }}>{RESTAURANT.chef}</div>
      </div>
      <PageNumber n="1" />
    </ContentBox>
  </PageWrapper>
);

// ── MENU PAGE ──
const MenuPage = ({ page }) => (
  <PageWrapper>
    <InsetBorder />
    <ContentBox>
      <div style={{ textAlign: "center", marginBottom: 9 }}>
        <div style={{ fontSize: "0.67em", letterSpacing: "0.32em", textTransform: "uppercase", color: T.gold, marginBottom: 3 }}>{page.tag}</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.3rem,2.8vw,2.1rem)", fontStyle: "italic", color: T.deep, lineHeight: 1.1 }}>{page.title}</div>
      </div>
      <GoldLine />
      {page.sections.map((section, si) => (
        <div key={si}>
          {section.label && (
            <div style={{ fontSize: "0.65em", letterSpacing: "0.28em", textTransform: "uppercase", color: T.gold, textAlign: "center", margin: "9px 0 5px" }}>— {section.label} —</div>
          )}
          {section.items.map((item, ii) => <MenuItem key={ii} item={item} />)}
        </div>
      ))}
      <GoldLine style={{ marginTop: "auto" }} />
      <div style={{ textAlign: "center", color: T.gold, fontSize: "0.82em", marginTop: 5 }}>✦</div>
      <PageNumber n={page.pageNumber} />
    </ContentBox>
  </PageWrapper>
);

// ── WINES ──
const WinesPage = ({ page }) => (
  <PageWrapper>
    <InsetBorder />
    <ContentBox>
      <div style={{ textAlign: "center", marginBottom: 9 }}>
        <div style={{ fontSize: "0.67em", letterSpacing: "0.32em", textTransform: "uppercase", color: T.gold, marginBottom: 3 }}>{page.tag}</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.3rem,2.8vw,2.1rem)", fontStyle: "italic", color: T.deep, lineHeight: 1.1 }}>{page.title}</div>
      </div>
      <GoldLine />
      {page.categories.map((cat, ci) => (
        <div key={ci}>
          <div style={{ fontSize: "0.65em", letterSpacing: "0.28em", textTransform: "uppercase", color: T.gold, textAlign: "center", margin: ci === 0 ? "0 0 7px" : "10px 0 7px" }}>— {cat.label} —</div>
          {cat.items.map((item, ii) => <MenuItem key={ii} item={item} />)}
        </div>
      ))}
      <GoldLine style={{ marginTop: "auto" }} />
      <div style={{ textAlign: "center", color: T.gold, fontSize: "0.82em", marginTop: 5 }}>✦</div>
      <PageNumber n={page.pageNumber} />
    </ContentBox>
  </PageWrapper>
);

// ── FORMULAS ──
const FormulasPage = ({ page }) => (
  <PageWrapper>
    <InsetBorder />
    <ContentBox>
      <div style={{ textAlign: "center", marginBottom: 9 }}>
        <div style={{ fontSize: "0.67em", letterSpacing: "0.32em", textTransform: "uppercase", color: T.gold, marginBottom: 3 }}>{page.tag}</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.3rem,2.8vw,2.1rem)", fontStyle: "italic", color: T.deep, lineHeight: 1.1 }}>{page.title}</div>
      </div>
      <GoldLine />
      {page.formulas.map((f, i) => (
        <div key={i} style={{ margin: "clamp(10px,2.2vh,22px) 0" }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1rem,2.1vw,1.35rem)", fontStyle: "italic", color: T.deep,
            borderBottom: "1px solid #d4c0a0", paddingBottom: 7, marginBottom: 7,
            display: "flex", justifyContent: "space-between",
          }}>
            <span>{f.name}</span>
            <span style={{ fontFamily: "'EB Garamond', serif", color: T.brown }}>{f.price}</span>
          </div>
          <div style={{ fontSize: "0.73em", color: "#8a6040", fontStyle: "italic", lineHeight: 1.52 }}>{f.desc}</div>
        </div>
      ))}
      {page.note && (
        <>
          <GoldLine style={{ marginTop: 16 }} />
          <div style={{ fontSize: "0.72em", color: "#9a7a55", fontStyle: "italic", textAlign: "center", lineHeight: 1.82, marginTop: 8, whiteSpace: "pre-line" }}>{page.note}</div>
        </>
      )}
      <PageNumber n={page.pageNumber} />
    </ContentBox>
  </PageWrapper>
);

// ── BACK COVER ──
const BackCoverPage = () => (
  <PageWrapper dark>
    <div style={{ position: "absolute", inset: 18, border: `1px solid rgba(201,160,80,0.40)`, pointerEvents: "none", zIndex: 2 }}>
      <div style={{ position: "absolute", inset: 7, border: `1px solid rgba(201,160,80,0.15)` }} />
    </div>
    <div style={{
      position: "relative", zIndex: 3, height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: 44, color: T.cream,
    }}>
      <div style={{ fontSize: "clamp(2rem,5vw,3.5rem)", marginBottom: 12 }}>🌿</div>
      <div style={{ color: T.gold, letterSpacing: "0.5em", fontSize: "0.85em", marginBottom: 12 }}>✦ &nbsp; ✦ &nbsp; ✦</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem,3vw,2.3rem)", fontStyle: "italic", color: T.gold2 }}>Merci de votre visite</div>
      <p style={{ fontStyle: "italic", fontSize: "0.88em", lineHeight: 1.95, color: "rgba(246,238,221,0.6)", marginTop: 10 }}>
        Nous espérons que ce repas<br />restera gravé dans vos mémoires.<br />À très bientôt.
      </p>
      <div style={{ width: 90, height: 1, background: `linear-gradient(to right, transparent, ${T.gold}, transparent)`, margin: "20px auto" }} />
      {[RESTAURANT.address, RESTAURANT.phone, RESTAURANT.website].map((l, i) => (
        <div key={i} style={{ fontSize: "0.73em", letterSpacing: "0.17em", color: T.gold, marginTop: i > 0 ? 4 : 0, textTransform: "uppercase" }}>{l}</div>
      ))}
    </div>
  </PageWrapper>
);

// ── ROUTER ──
const renderPage = (page) => {
  switch (page.type) {
    case "cover":     return <CoverPage />;
    case "welcome":   return <WelcomePage />;
    case "menu":      return <MenuPage page={page} />;
    case "wines":     return <WinesPage page={page} />;
    case "formulas":  return <FormulasPage page={page} />;
    case "backcover": return <BackCoverPage />;
    default:          return null;
  }
};

// ============================================================
//  🎬  FOLD ENGINE (Canvas)
// ============================================================
function drawFold(ctx, W, H, t, dir) {
  ctx.clearRect(0, 0, W, H);

  // creaseX: the fold line sweeps across the screen
  const creaseX = dir > 0 ? W * (1 - t) : W * t;
  const easeT   = Math.sin(t * Math.PI * 0.5); // smoother ramp

  // ── A. Shadow on revealed page ──
  const shW = Math.min(110, W * 0.16);
  if (dir > 0) {
    const g = ctx.createLinearGradient(creaseX, 0, creaseX + shW, 0);
    g.addColorStop(0,   "rgba(0,0,0,0.35)");
    g.addColorStop(0.4, "rgba(0,0,0,0.14)");
    g.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(creaseX, 0, shW, H);
  } else {
    const g = ctx.createLinearGradient(creaseX, 0, creaseX - shW, 0);
    g.addColorStop(0,   "rgba(0,0,0,0.35)");
    g.addColorStop(0.4, "rgba(0,0,0,0.14)");
    g.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(creaseX - shW, 0, shW, H);
  }

  const flapW = dir > 0 ? creaseX : W - creaseX;
  if (flapW < 1.5) return;

  // ── B. Perspective compression of the flap ──
  // cos curve: starts at 1 (flat), approaches 0 (edge-on)
  const compress = Math.cos(easeT * Math.PI * 0.5);

  ctx.save();
  ctx.beginPath();
  if (dir > 0) ctx.rect(0, 0, creaseX, H);
  else         ctx.rect(creaseX, 0, W - creaseX, H);
  ctx.clip();

  // Squish the flap toward the crease
  ctx.save();
  if (dir > 0) {
    ctx.translate(creaseX, 0);
    ctx.scale(compress, 1);
    ctx.translate(-creaseX, 0);
  } else {
    ctx.translate(creaseX, 0);
    ctx.scale(compress, 1);
    ctx.translate(-creaseX, 0);
  }

  // ── C. Flap paper fill ──
  const x0 = dir > 0 ? 0 : creaseX;
  const x1 = dir > 0 ? creaseX : W;
  const paperG = ctx.createLinearGradient(x0, 0, x1, 0);
  if (dir > 0) {
    paperG.addColorStop(0,    "#f8efdf");
    paperG.addColorStop(0.55, "#f2e6d0");
    paperG.addColorStop(0.85, "#e8d8bc");
    paperG.addColorStop(1,    "#d8c8a5");
  } else {
    paperG.addColorStop(0,    "#d8c8a5");
    paperG.addColorStop(0.15, "#e8d8bc");
    paperG.addColorStop(0.45, "#f2e6d0");
    paperG.addColorStop(1,    "#f8efdf");
  }
  ctx.fillStyle = paperG;
  ctx.fillRect(0, 0, W, H);

  // ── D. Faint content lines (page text simulation) ──
  ctx.globalAlpha = Math.max(0, (1 - t * 2.0) * 0.35);
  ctx.strokeStyle = "rgba(90,50,15,0.12)";
  ctx.lineWidth = 1;
  for (let y = 70; y < H - 50; y += 26) {
    const lx0 = dir > 0 ? 50            : creaseX + 20;
    const lx1 = dir > 0 ? creaseX - 20  : W - 50;
    ctx.beginPath(); ctx.moveTo(lx0, y); ctx.lineTo(lx1, y); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore(); // undo squish

  // ── E. Crease specular highlight ──
  const cw = 13;
  const cg = ctx.createLinearGradient(creaseX - cw, 0, creaseX + cw, 0);
  cg.addColorStop(0,   "rgba(255,252,240,0)");
  cg.addColorStop(0.28,"rgba(255,252,240,0.6)");
  cg.addColorStop(0.50,"rgba(255,255,255,0.95)");
  cg.addColorStop(0.72,"rgba(255,252,240,0.5)");
  cg.addColorStop(1,   "rgba(255,252,240,0)");
  ctx.fillStyle = cg;
  ctx.fillRect(creaseX - cw, 0, cw * 2, H);

  // ── F. Inner shadow (depth near crease, on the flap side) ──
  const isW = Math.min(60, flapW * 0.45);
  if (dir > 0) {
    const isg = ctx.createLinearGradient(creaseX, 0, creaseX - isW, 0);
    isg.addColorStop(0, "rgba(50,20,5,0.30)");
    isg.addColorStop(1, "rgba(50,20,5,0)");
    ctx.fillStyle = isg; ctx.fillRect(creaseX - isW, 0, isW, H);
  } else {
    const isg = ctx.createLinearGradient(creaseX, 0, creaseX + isW, 0);
    isg.addColorStop(0, "rgba(50,20,5,0.30)");
    isg.addColorStop(1, "rgba(50,20,5,0)");
    ctx.fillStyle = isg; ctx.fillRect(creaseX, 0, isW, H);
  }

  // ── G. Curl shadow at bottom corner ──
  const curlT  = Math.min(1, easeT * 2.8);
  const curlR  = Math.min(H * 0.16, 90) * curlT;
  if (curlR > 3) {
    const cx2 = dir > 0 ? 0 : W;
    const cy2 = H;
    // Dark underneath
    const cGrad = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, curlR * 2.4);
    cGrad.addColorStop(0,   "rgba(20,8,2,0.50)");
    cGrad.addColorStop(0.4, "rgba(20,8,2,0.20)");
    cGrad.addColorStop(1,   "rgba(20,8,2,0)");
    ctx.fillStyle = cGrad;
    ctx.beginPath(); ctx.arc(cx2, cy2, curlR * 2.4, 0, Math.PI * 2); ctx.fill();
    // Bright curled edge
    const eGrad = ctx.createRadialGradient(cx2, cy2, curlR * 0.55, cx2, cy2, curlR * 1.1);
    eGrad.addColorStop(0,   "rgba(255,248,232,0.75)");
    eGrad.addColorStop(0.6, "rgba(245,235,210,0.35)");
    eGrad.addColorStop(1,   "rgba(240,228,200,0)");
    ctx.fillStyle = eGrad;
    ctx.beginPath(); ctx.arc(cx2, cy2, curlR * 1.1, 0, Math.PI * 2); ctx.fill();
  }

  // ── H. Also curl top corner (lighter) ──
  const curlR2 = curlR * 0.6;
  if (curlR2 > 2) {
    const cx3 = dir > 0 ? 0 : W;
    const cy3 = 0;
    const cGrad2 = ctx.createRadialGradient(cx3, cy3, 0, cx3, cy3, curlR2 * 2.2);
    cGrad2.addColorStop(0,   "rgba(20,8,2,0.38)");
    cGrad2.addColorStop(0.4, "rgba(20,8,2,0.14)");
    cGrad2.addColorStop(1,   "rgba(20,8,2,0)");
    ctx.fillStyle = cGrad2;
    ctx.beginPath(); ctx.arc(cx3, cy3, curlR2 * 2.2, 0, Math.PI * 2); ctx.fill();
  }

  ctx.restore();

  // ── I. Top / bottom edge depth ──
  const tg = ctx.createLinearGradient(0, 0, 0, 18);
  tg.addColorStop(0, "rgba(0,0,0,0.22)"); tg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = tg; ctx.fillRect(0, 0, W, 18);
  const bg = ctx.createLinearGradient(0, H - 18, 0, H);
  bg.addColorStop(0, "rgba(0,0,0,0)"); bg.addColorStop(1, "rgba(0,0,0,0.22)");
  ctx.fillStyle = bg; ctx.fillRect(0, H - 18, W, 18);
}

// ============================================================
//  🏗️  MAIN COMPONENT
// ============================================================
export default function RestaurantBook() {
  const total       = PAGES.length;
  const [cur, setCur]       = useState(0);
  const canvasRef   = useRef(null);
  const bookRef     = useRef(null);
  const stateRef    = useRef({
    cur: 0, dragging: false, animating: false,
    dragDir: 0, dragT: 0, startX: 0, startY: 0,
    axisLocked: false, rafId: 0,
    nextVisible: false,
  });
  const [nextIdx, setNextIdx] = useState(null);

  // Sync ref cur with state cur
  useEffect(() => { stateRef.current.cur = cur; }, [cur]);

  const W = useRef(0), H = useRef(0);

  function resize() {
    const el = bookRef.current;
    const cv = canvasRef.current;
    if (!el || !cv) return;
    W.current = cv.width  = el.offsetWidth;
    H.current = cv.height = el.offsetHeight;
  }

  function drawIdle() {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    ctx.clearRect(0, 0, W.current, H.current);
    const tg = ctx.createLinearGradient(0, 0, 0, 18);
    tg.addColorStop(0, "rgba(0,0,0,0.22)"); tg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = tg; ctx.fillRect(0, 0, W.current, 18);
    const bg = ctx.createLinearGradient(0, H.current - 18, 0, H.current);
    bg.addColorStop(0, "rgba(0,0,0,0)"); bg.addColorStop(1, "rgba(0,0,0,0.22)");
    ctx.fillStyle = bg; ctx.fillRect(0, H.current - 18, W.current, 18);
  }

  function drawFrame(t, dir) {
    const cv = canvasRef.current;
    if (!cv) return;
    drawFold(cv.getContext("2d"), W.current, H.current, t, dir);
  }

  function animTo(fromT, toT, dir, onDone) {
    const s = stateRef.current;
    cancelAnimationFrame(s.rafId);
    s.animating = true;
    const DUR   = toT > fromT ? 500 : 330;
    const start = performance.now();
    function frame(now) {
      let raw = (now - start) / DUR;
      if (raw >= 1) raw = 1;
      const ease = raw < 0.5 ? 4*raw*raw*raw : 1 - Math.pow(-2*raw+2, 3) / 2;
      const t    = fromT + (toT - fromT) * ease;
      drawFrame(t, dir);
      if (raw < 1) { s.rafId = requestAnimationFrame(frame); }
      else { s.animating = false; drawIdle(); onDone(); }
    }
    s.rafId = requestAnimationFrame(frame);
  }

  const completeFlip = useCallback((dir) => {
    const s = stateRef.current;
    const next = s.cur + dir;
    setCur(next);
    setNextIdx(null);
    s.dragging = false; s.dragT = 0; s.axisLocked = false;
  }, []);

  const cancelFlip = useCallback(() => {
    const s = stateRef.current;
    setNextIdx(null);
    s.dragging = false; s.dragT = 0; s.axisLocked = false;
  }, []);

  // pointer events
  const onDown = useCallback((e) => {
    const s = stateRef.current;
    if (s.animating) return;
    const pt = e.touches ? e.touches[0] : e;
    s.startX = pt.clientX; s.startY = pt.clientY;
    s.dragging = false; s.axisLocked = false; s.dragT = 0;
  }, []);

  const onMove = useCallback((e) => {
    const s = stateRef.current;
    if (s.animating) return;
    const pt   = e.touches ? e.touches[0] : e;
    const dx   = pt.clientX - s.startX;
    const dy   = pt.clientY - s.startY;

    if (!s.axisLocked) {
      if (Math.abs(dx) < 14 && Math.abs(dy) < 14) return;
      if (Math.abs(dy) > Math.abs(dx) * 1.4) return;
      s.axisLocked = true;
      s.dragDir    = dx < 0 ? 1 : -1;
      const next   = s.cur + s.dragDir;
      if (next < 0 || next >= total) { s.axisLocked = false; return; }
      s.dragging = true;
      setNextIdx(next);
    }
    if (!s.dragging) return;
    if (e.cancelable) e.preventDefault();

    s.dragT = Math.max(0, Math.min(1, Math.abs(dx) / W.current));
    drawFrame(s.dragT, s.dragDir);
  }, [total]);

  const onUp = useCallback(() => {
    const s = stateRef.current;
    if (!s.dragging || s.animating) return;
    if (s.dragT > 0.28) {
      animTo(s.dragT, 1, s.dragDir, () => completeFlip(s.dragDir));
    } else {
      animTo(s.dragT, 0, s.dragDir, cancelFlip);
    }
  }, [completeFlip, cancelFlip]);

  // Keyboard
  const triggerFlip = useCallback((dir) => {
    const s = stateRef.current;
    if (s.animating || s.dragging) return;
    const next = s.cur + dir;
    if (next < 0 || next >= total) return;
    s.dragDir = dir;
    s.dragging = true;
    setNextIdx(next);
    animTo(0, 1, dir, () => completeFlip(dir));
  }, [total, completeFlip]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") triggerFlip(1);
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")  triggerFlip(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [triggerFlip]);

  useEffect(() => {
    resize();
    drawIdle();
    window.addEventListener("resize", () => { resize(); drawIdle(); });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        html, body, #root { width: 100%; height: 100%; overflow: hidden; background: #090402; }
        body { font-family: 'Cormorant Garamond', serif; }
        @keyframes nudge { 0%,100%{transform:translateX(0)} 55%{transform:translateX(7px)} }
      `}</style>

      <div
        ref={bookRef}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
        onTouchCancel={onUp}
        style={{
          position: "relative", width: "100vw", height: "100vh",
          overflow: "hidden", touchAction: "none", userSelect: "none",
          cursor: "grab",
          background: "radial-gradient(ellipse 90% 70% at 50% 50%, #200e06 0%, #090402 100%)",
        }}
      >
        {/* Next page (revealed underneath) */}
        {nextIdx !== null && (
          <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
            {renderPage(PAGES[nextIdx])}
          </div>
        )}

        {/* Current page */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
          {renderPage(PAGES[cur])}
        </div>

        {/* Canvas (fold effect drawn on top) */}
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 9999, pointerEvents: "none" }}
        />

        {/* Page dots */}
        <div style={{
          position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: 8, zIndex: 10000,
        }}>
          {PAGES.map((_, i) => (
            <div key={i} style={{
              width: i === cur ? 18 : 6, height: 6,
              borderRadius: 3,
              background: i === cur ? T.gold : "rgba(201,160,80,0.25)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>
      </div>
    </>
  );
}