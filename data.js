// ============================================================
// OMAR'S BOARD & GRAZE — DATA.JS
// Version 1.5.0
// "Built on a Levantine American palate —
//  where hummus and cheddar belong on the same board."
//
// All items pork-free. Board-ready, no cooking required.
// Stores: CM = Central Market, SM = Sara's Mediterranean, AG = Altin Grocery
// Profiles: C = Classic, S = Standard, E = Explorer
//   C — everyday on a Levantine American table
//   S — elevated but approachable, food-curious crowd
//   E — specialty deep cuts, even a Levantine American pauses here
// ============================================================

const APP_VERSION = "1.5.0";

const THEMES = [
  { id: "american",      label: "American",      flag: "🇺🇸" },
  { id: "latin",         label: "Latin",         flag: "🌎" },
  { id: "mediterranean", label: "Mediterranean", flag: "🌊" },
  { id: "french",        label: "French",        flag: "🇫🇷" },
  { id: "italian",       label: "Italian",       flag: "🇮🇹" },
  { id: "spanish",       label: "Spanish",       flag: "🇪🇸" },
  { id: "greek",         label: "Greek",         flag: "🇬🇷" },
  { id: "turkish",       label: "Turkish",       flag: "🇹🇷" },
  { id: "levantine",     label: "Levantine",     flag: "🌙" },
  { id: "northafrican",  label: "North African", flag: "🌍" },
  { id: "moroccan",      label: "Moroccan",      flag: "🇲🇦" },
  { id: "gulf",          label: "Gulf & Iraq",   flag: "🌴" },
  { id: "persian",       label: "Persian",       flag: "🇮🇷" },
  { id: "armenian",      label: "Armenian",      flag: "🇦🇲" },
  { id: "egyptian",      label: "Egyptian",      flag: "🇪🇬" },
  { id: "indian",        label: "Indian",        flag: "🇮🇳" },
];

// Theme pairs that produce incoherent boards — triggers warning in UI
const THEME_CLASHES = [
  // American clashes
  ["american", "levantine"],
  ["american", "gulf"],
  ["american", "persian"],
  ["american", "northafrican"],
  ["american", "moroccan"],
  ["american", "turkish"],
  ["american", "armenian"],
  ["american", "egyptian"],
  // Latin clashes
  ["latin", "levantine"],
  ["latin", "gulf"],
  ["latin", "persian"],
  ["latin", "northafrican"],
  ["latin", "moroccan"],
  ["latin", "turkish"],
  ["latin", "armenian"],
  ["latin", "egyptian"],
  ["latin", "indian"],
  // French clashes
  ["french", "levantine"],
  ["french", "persian"],
  ["french", "northafrican"],
  ["french", "moroccan"],
  ["french", "gulf"],
  ["french", "egyptian"],
  // Italian clashes
  ["italian", "gulf"],
  ["italian", "levantine"],
  ["italian", "persian"],
  ["italian", "northafrican"],
  ["italian", "moroccan"],
  ["italian", "indian"],
  // Spanish clashes
  ["spanish", "gulf"],
  ["spanish", "levantine"],
  ["spanish", "persian"],
  ["spanish", "northafrican"],
  ["spanish", "moroccan"],
  ["spanish", "indian"],
  // Indian — works well with Gulf (spice trade), Persian, Mediterranean
  ["indian", "french"],
  ["indian", "italian"],
  ["indian", "spanish"],
  ["indian", "moroccan"],
  // Moroccan — works with North African, Mediterranean, but not Western
  ["moroccan", "american"],
  ["moroccan", "latin"],
];

// Natural affinities — shown as compatible suggestions (informational)
const THEME_AFFINITIES = [
  ["levantine", "gulf", "persian", "turkish"],
  ["levantine", "gulf", "egyptian", "moroccan"],
  ["french", "italian", "spanish", "mediterranean"],
  ["greek", "turkish", "levantine", "mediterranean"],
  ["persian", "armenian", "turkish"],
  ["moroccan", "northafrican", "mediterranean"],
  ["gulf", "indian"],   // historical spice trade connection
];

const BOARD_SIZES = {
  S: { label: "Small",  description: "1–2 people",  itemsPerCategory: 1 },
  M: { label: "Medium", description: "3–5 people",  itemsPerCategory: 2 },
  L: { label: "Large",  description: "6–10 people", itemsPerCategory: 4 },
};

const MEAL_ROLES = {
  appetizer: { label: "Appetizer",     description: "Light — before a meal",  icon: "🥂" },
  main:      { label: "Main Course",   description: "This is the meal",       icon: "🍽️" },
  grazing:   { label: "Grazing Table", description: "Extended gathering",     icon: "🎉" },
};

const PROFILES = {
  classic:  { label: "Classic",  icon: "🧺", description: "Familiar favorites — no explanations needed" },
  standard: { label: "Curated",  icon: "🌿", description: "Elevated but approachable" },
  explorer: { label: "Explorer", icon: "🌶️", description: "The full board experience" },
};

const PROFILE_INCLUDES = {
  classic:  ["C"],
  standard: ["C", "S"],
  explorer: ["C", "S", "E"],
};

const SERVING_GUIDANCE = {
  meats: {
    unit: "oz", appetizer: 1.5, main: 4, grazing: 6,
    tip: "Serve at room temperature. Slice thin. Fan or fold on the board.",
  },
  cheeses: {
    unit: "oz", appetizer: 1.5, main: 3, grazing: 4,
    tip: "Pull from fridge 30–45 min before serving. Offer a mix of soft, semi-firm, and aged.",
  },
  fruits: {
    unit: "oz", appetizer: 2, main: 3, grazing: 4,
    tip: "Mix fresh and dried. Fresh figs and grapes add visual height.",
  },
  crackers: {
    unit: "pieces", appetizer: 4, main: 10, grazing: 14,
    tip: "Offer at least two textures — one neutral, one seeded or spiced.",
  },
  breads: {
    unit: "pieces", appetizer: 2, main: 4, grazing: 6,
    tip: "Warm pita just before serving. Slice baguette at an angle.",
  },
  nuts: {
    unit: "oz", appetizer: 0.5, main: 1.5, grazing: 2,
    tip: "Use as gap-fillers and height builders. Roast if unroasted.",
  },
  spreads: {
    unit: "tbsp", appetizer: 1, main: 2, grazing: 3,
    tip: "Serve in small ramekins. Label unfamiliar ones for guests.",
  },
  pickles: {
    unit: "oz", appetizer: 0.75, main: 1.5, grazing: 2,
    tip: "Drain well before plating. Pickled turnips add striking color.",
  },
  vegetables: {
    unit: "oz", appetizer: 1.5, main: 3, grazing: 4,
    tip: "Keep raw veg cold until serving. Use as color breaks near dips.",
  },
  extras: {
    unit: "tbsp", appetizer: 0.5, main: 1, grazing: 2,
    tip: "Honey and jams go near cheese. Za'atar and sumac go near bread and labneh.",
  },
};

const BOARD_SUPPLIES = [
  { item: "Wooden or slate serving board",  note: "Large enough for your board size" },
  { item: "Small ramekins or bowls (3–5)",  note: "For dips, spreads, honey, olives" },
  { item: "Cheese knives (2–3)",            note: "One per soft cheese, one for hard" },
  { item: "Small spreaders (2–3)",          note: "For labneh, hummus, butter" },
  { item: "Cocktail picks or toothpicks",   note: "For meats, olives, and small bites" },
  { item: "Small serving spoons",           note: "For dips and loose items like nuts" },
  { item: "Parchment or wax paper",         note: "For lining the board (optional)" },
  { item: "Labels or small cards",          note: "Name unfamiliar items for guests" },
];

const PRESENTATION_ITEMS = [
  { name: "Edible flowers",            note: "Buy when you find them — rare but beautiful. Scatter lightly.", store: ["CM"] },
  { name: "Fresh rosemary sprigs",     note: "Use as natural dividers between sections on the board.", store: ["CM"] },
  { name: "Fresh thyme sprigs",        note: "Tuck around cheeses and meats for color and aroma.", store: ["CM"] },
  { name: "Fresh sage leaves",         note: "Deep green contrast against lighter cheeses.", store: ["CM"] },
  { name: "Micro greens",              note: "Nest under soft cheeses or use as a bed for small items.", store: ["CM"] },
  { name: "Dried citrus wheel slices", note: "Visual accent — dried orange or lemon slices add warm color.", store: ["CM", "AG"] },
  { name: "Small honeycomb piece",     note: "Place near aged cheeses — striking visual and flavor anchor.", store: ["CM"] },
  { name: "Whole figs (uncut)",        note: "Use for height and visual drama alongside sliced figs.", store: ["CM", "SM"] },
  { name: "Whole Medjool dates",       note: "Group in clusters for a rich visual anchor on Middle Eastern boards.", store: ["SM", "AG"] },
];

// ============================================================
// ITEMS
// p: "C" | "S" | "E" — board profile
// ============================================================

const ITEMS = {

  // ----------------------------------------------------------
  meats: [
    // Classic — Levantine American everyday
    { name: "Smoked turkey breast",                          store: ["CM"],            themes: ["american","levantine","gulf"],                                                    p: "C" },
    { name: "Roast beef, thinly sliced",                     store: ["CM"],            themes: ["american","levantine","gulf"],                                                    p: "C" },
    { name: "Smoked chicken breast",                         store: ["CM"],            themes: ["american","levantine","gulf"],                                                    p: "C" },
    { name: "Corned beef",                                   store: ["CM"],            themes: ["american","levantine","gulf"],                                                    p: "C" },
    { name: "Beef mortadella, sliced",                       store: ["CM","SM","AG"],  themes: ["levantine","gulf","turkish","northafrican","persian","italian","mediterranean","armenian","egyptian"], p: "C" },
    { name: "Poultry mortadella, sliced",                    store: ["SM","AG"],       themes: ["levantine","gulf","turkish","northafrican","persian","egyptian"],                 p: "C" },
    { name: "Beef bologna, sliced",                          store: ["CM","SM","AG"],  themes: ["levantine","gulf","turkish","american","egyptian"],                               p: "C" },
    { name: "Beef pastrami, sliced",                         store: ["CM","SM","AG"],  themes: ["levantine","gulf","american","armenian","egyptian"],                              p: "C" },
    { name: "Beef sujuk, dry-cured, sliced",                 store: ["SM","AG"],       themes: ["turkish","levantine","gulf","armenian"],                                          p: "C" },
    // Standard
    { name: "Beef salami",                                   store: ["CM","SM","AG"],  themes: ["italian","mediterranean","levantine","gulf","armenian"],                          p: "S" },
    { name: "Beef pepperoni",                                store: ["CM","SM"],       themes: ["italian","mediterranean","american"],                                             p: "S" },
    { name: "Beef basturma, sliced",                         store: ["SM","AG"],       themes: ["turkish","levantine","gulf","persian","armenian"],                                p: "S" },
    { name: "Beef bresaola (Italian air-dried beef)",        store: ["CM"],            themes: ["italian","mediterranean"],                                                        p: "S" },
    // Explorer
    { name: "Smoked duck breast",                            store: ["CM"],            themes: ["french","mediterranean"],                                                         p: "E" },
    { name: "Duck rillettes (French shredded duck confit)",  store: ["CM"],            themes: ["french"],                                                                         p: "E" },
    { name: "Chicken liver mousse",                          store: ["CM"],            themes: ["french"],                                                                         p: "E" },
  ],

  // ----------------------------------------------------------
  cheeses: [
    // Classic
    { name: "Aged white cheddar",                            store: ["CM"],            themes: ["american"],                                                                       p: "C" },
    { name: "Pepper jack",                                   store: ["CM"],            themes: ["american","latin"],                                                               p: "C" },
    { name: "Colby jack",                                    store: ["CM"],            themes: ["american"],                                                                       p: "C" },
    { name: "Cream cheese block",                            store: ["CM"],            themes: ["american"],                                                                       p: "C" },
    { name: "Feta (sheep's milk)",                           store: ["CM","SM"],       themes: ["greek","mediterranean","levantine","gulf","egyptian"],                            p: "C" },
    { name: "Labneh (strained yogurt cheese)",               store: ["SM","AG"],       themes: ["levantine","gulf","persian","northafrican","moroccan","armenian","egyptian"],     p: "C" },
    { name: "Beyaz peynir (white cheese)",                   store: ["AG","SM"],       themes: ["turkish","levantine","gulf"],                                                     p: "C" },
    { name: "Halloumi (Cypriot firm grilling cheese)",       store: ["CM","SM"],       themes: ["greek","levantine","gulf"],                                                       p: "C" },
    { name: "Shanklish (aged labneh balls in za'atar)",      store: ["SM"],            themes: ["levantine","gulf"],                                                               p: "C" },
    { name: "Chechil (Armenian braided string cheese)",      store: ["SM","AG"],       themes: ["armenian","levantine","turkish"],                                                 p: "C" },
    { name: "Paneer, fresh cubed",                           store: ["CM"],            themes: ["indian"],                                                                         p: "C" },
    // Standard
    { name: "Brie de Meaux",                                 store: ["CM"],            themes: ["french","mediterranean"],                                                         p: "S" },
    { name: "Camembert",                                     store: ["CM"],            themes: ["french"],                                                                         p: "S" },
    { name: "Manchego (6-month aged)",                       store: ["CM"],            themes: ["spanish","mediterranean"],                                                        p: "S" },
    { name: "Parmigiano Reggiano",                           store: ["CM"],            themes: ["italian","mediterranean"],                                                        p: "S" },
    { name: "Grana Padano",                                  store: ["CM"],            themes: ["italian","mediterranean"],                                                        p: "S" },
    { name: "Burrata",                                       store: ["CM"],            themes: ["italian","mediterranean"],                                                        p: "S" },
    { name: "Smoked gouda",                                  store: ["CM"],            themes: ["american","mediterranean"],                                                       p: "S" },
    { name: "Whipped feta",                                  store: ["CM","SM"],       themes: ["greek","mediterranean","levantine","egyptian"],                                   p: "S" },
    { name: "Akkawi (Levantine mild white cheese)",          store: ["SM"],            themes: ["levantine","gulf","egyptian"],                                                    p: "S" },
    { name: "Panir (fresh Persian cheese, similar to feta)", store: ["SM"],            themes: ["persian"],                                                                        p: "S" },
    { name: "Queso fresco",                                  store: ["CM"],            themes: ["latin"],                                                                          p: "S" },
    { name: "Chèvre (fresh goat cheese)",                    store: ["CM","SM"],       themes: ["french","mediterranean","moroccan"],                                              p: "S" },
    { name: "Comté (French aged cow's milk)",                store: ["CM"],            themes: ["french"],                                                                         p: "S" },
    { name: "Roquefort",                                     store: ["CM"],            themes: ["french"],                                                                         p: "S" },
    { name: "Pecorino Romano",                               store: ["CM"],            themes: ["italian","mediterranean","greek"],                                                p: "S" },
    { name: "Asiago",                                        store: ["CM"],            themes: ["italian"],                                                                        p: "S" },
    { name: "Cotija, aged",                                  store: ["CM"],            themes: ["latin"],                                                                          p: "S" },
    // Explorer
    { name: "Taleggio",                                      store: ["CM"],            themes: ["italian"],                                                                        p: "E" },
    { name: "Époisses (French washed-rind, pungent)",        store: ["CM"],            themes: ["french"],                                                                         p: "E" },
    { name: "Idiazábal (Spanish smoked sheep's milk)",       store: ["CM"],            themes: ["spanish"],                                                                        p: "E" },
    { name: "Mahón (Spanish cow's milk, semi-firm)",         store: ["CM"],            themes: ["spanish"],                                                                        p: "E" },
    { name: "Kasseri (Greek semi-hard sheep's milk)",        store: ["CM"],            themes: ["greek"],                                                                          p: "E" },
    { name: "Graviera (Greek aged cow's milk, nutty)",       store: ["CM"],            themes: ["greek"],                                                                          p: "E" },
    { name: "Kaşar peyniri (Turkish semi-hard yellow cheese)", store: ["AG"],          themes: ["turkish"],                                                                        p: "E" },
    { name: "Tulum peyniri (Turkish aged crumbly white cheese)", store: ["AG"],        themes: ["turkish"],                                                                        p: "E" },
    { name: "Nabulsi (Palestinian brined white cheese)",     store: ["SM"],            themes: ["levantine"],                                                                      p: "E" },
    { name: "Lighvan (Persian brined sheep's milk)",         store: ["SM"],            themes: ["persian","gulf"],                                                                 p: "E" },
    { name: "Rumi (Egyptian aged hard cheese)",              store: ["SM"],            themes: ["egyptian"],                                                                       p: "E" },
    { name: "Smen (aged Moroccan fermented butter)",         store: ["CM"],            themes: ["moroccan"],                                                                       p: "E" },
    { name: "Oaxacan string cheese",                         store: ["CM"],            themes: ["latin"],                                                                          p: "E" },
  ],

  // ----------------------------------------------------------
  fruits: [
    // Fresh — Classic
    { name: "Red & green grapes",                            store: ["CM","SM"],       themes: ["american","french","italian","mediterranean","spanish","greek","armenian"],       p: "C" },
    { name: "Sliced strawberries",                           store: ["CM","SM"],       themes: ["american","french"],                                                              p: "C" },
    { name: "Sliced Honeycrisp apple",                       store: ["CM"],            themes: ["american","french"],                                                              p: "C" },
    { name: "Sliced Bosc pear",                              store: ["CM"],            themes: ["american","french","italian"],                                                    p: "C" },
    { name: "Blackberries",                                  store: ["CM"],            themes: ["american","french"],                                                              p: "C" },
    { name: "Blueberries",                                   store: ["CM"],            themes: ["american"],                                                                       p: "C" },
    { name: "Medjool dates",                                 store: ["SM","AG"],       themes: ["levantine","gulf","persian","moroccan","northafrican","mediterranean","armenian","egyptian"], p: "C" },
    { name: "Dried apricots",                                store: ["CM","SM","AG"],  themes: ["turkish","persian","gulf","mediterranean","armenian","moroccan"],                 p: "C" },
    { name: "Pomegranate arils",                             store: ["CM","SM"],       themes: ["persian","levantine","gulf","northafrican","greek","armenian","moroccan"],        p: "C" },
    { name: "Sliced mango",                                  store: ["CM","SM"],       themes: ["latin","indian"],                                                                 p: "C" },
    // Dates — distinct varieties
    { name: "Ajwa dates (Saudi, dark & earthy)",             store: ["SM","AG"],       themes: ["gulf","levantine","persian"],                                                     p: "S" },
    { name: "Barhi dates (Iraqi, butterscotch-sweet)",       store: ["SM","AG"],       themes: ["gulf","levantine"],                                                               p: "S" },
    { name: "Deglet Noor dates (North African, firm & nutty)", store: ["CM","SM"],     themes: ["northafrican","moroccan","mediterranean"],                                        p: "C" },
    // Standard — dried & specialty
    { name: "Fresh figs, halved",                            store: ["CM","SM"],       themes: ["mediterranean","french","italian","greek","levantine","moroccan"],                p: "S" },
    { name: "Dried Calimyrna figs",                          store: ["CM","SM"],       themes: ["mediterranean","turkish","persian","levantine","armenian"],                       p: "S" },
    { name: "Dried sour cherries",                           store: ["CM","AG"],       themes: ["turkish","persian","mediterranean","armenian"],                                   p: "S" },
    { name: "Golden raisins",                                store: ["CM","AG"],       themes: ["northafrican","persian","mediterranean","moroccan"],                              p: "S" },
    { name: "Dried mandarin slices",                         store: ["CM","AG"],       themes: ["mediterranean","turkish","persian","northafrican","moroccan"],                    p: "S" },
    { name: "Guava paste slices",                            store: ["CM"],            themes: ["latin"],                                                                          p: "S" },
    { name: "Sliced papaya",                                 store: ["CM"],            themes: ["latin"],                                                                          p: "S" },
    // Explorer — Persian specialty
    { name: "Aloo bokhara (dried Persian plums)",            store: ["SM"],            themes: ["persian","gulf"],                                                                 p: "E" },
    { name: "Lavashak (Persian fruit leather)",              store: ["SM"],            themes: ["persian"],                                                                        p: "E" },
    { name: "Zereshk (dried barberries)",                    store: ["SM"],            themes: ["persian"],                                                                        p: "E" },
    // Pastes
    { name: "Membrillo (quince paste)",                      store: ["CM"],            themes: ["spanish","mediterranean","french"],                                               p: "S" },
  ],

  // ----------------------------------------------------------
  crackers: [
    // Classic
    { name: "Water crackers",                                store: ["CM"],            themes: ["american","french","italian"],                                                    p: "C" },
    { name: "Multigrain crackers",                           store: ["CM"],            themes: ["american","mediterranean"],                                                       p: "C" },
    { name: "Sesame seed crackers",                          store: ["CM","SM"],       themes: ["mediterranean","greek","levantine","gulf","egyptian"],                            p: "C" },
    { name: "Papadum (Indian crispy lentil crackers)",       store: ["CM"],            themes: ["indian"],                                                                         p: "C" },
    // Standard
    { name: "Herb flatbread crackers",                       store: ["CM"],            themes: ["mediterranean","french","italian"],                                               p: "S" },
    { name: "Olive oil crackers",                            store: ["CM"],            themes: ["italian","spanish","mediterranean","greek"],                                      p: "S" },
    { name: "Raincoast crisps",                              store: ["CM"],            themes: ["american"],                                                                       p: "S" },
    { name: "Seeded rye crispbread",                         store: ["CM"],            themes: ["french","american"],                                                              p: "S" },
    // Explorer
    { name: "Taralli (Italian ring crackers)",               store: ["CM"],            themes: ["italian"],                                                                        p: "E" },
  ],

  // ----------------------------------------------------------
  breads: [
    // Classic
    { name: "Fresh pita bread",                              store: ["SM"],            themes: ["levantine","gulf","greek","mediterranean","egyptian"],                            p: "C" },
    { name: "Pita chips",                                    store: ["CM","SM"],       themes: ["greek","levantine","gulf","egyptian"],                                            p: "C" },
    { name: "Sourdough slices, toasted",                     store: ["CM"],            themes: ["american","french"],                                                              p: "C" },
    { name: "Corn tortilla chips",                           store: ["CM"],            themes: ["latin"],                                                                          p: "C" },
    { name: "Aish baladi (Egyptian whole wheat pita)",       store: ["SM","CM"],       themes: ["egyptian","levantine","gulf"],                                                    p: "C" },
    { name: "Naan, sliced",                                  store: ["CM"],            themes: ["indian"],                                                                         p: "C" },
    // Standard
    { name: "Baguette slices",                               store: ["CM"],            themes: ["french","mediterranean"],                                                         p: "S" },
    { name: "Crostini, toasted",                             store: ["CM"],            themes: ["italian","mediterranean","french"],                                               p: "S" },
    { name: "Focaccia, sliced",                              store: ["CM"],            themes: ["italian","mediterranean"],                                                        p: "S" },
    { name: "Lavash (Armenian/Persian thin flatbread)",      store: ["AG","SM"],       themes: ["turkish","persian","levantine","gulf","armenian"],                                p: "S" },
    { name: "Pide (Turkish flatbread)",                      store: ["AG"],            themes: ["turkish"],                                                                        p: "S" },
    { name: "Msemen (Moroccan layered flatbread)",           store: ["SM"],            themes: ["moroccan","northafrican"],                                                        p: "S" },
    { name: "Samoon (Iraqi diamond-shaped bread)",           store: ["SM","AG"],       themes: ["gulf","levantine"],                                                               p: "S" },
    // Explorer
    { name: "Barbari (Persian sesame-topped flatbread)",     store: ["SM"],            themes: ["persian"],                                                                        p: "E" },
    { name: "Sangak (Persian stone-baked flatbread)",        store: ["SM"],            themes: ["persian"],                                                                        p: "E" },
    { name: "Markook (Levantine paper-thin flatbread)",      store: ["SM"],            themes: ["levantine","gulf"],                                                               p: "E" },
    { name: "Harcha (Moroccan semolina griddle bread)",      store: ["SM"],            themes: ["moroccan"],                                                                       p: "E" },
  ],

  // ----------------------------------------------------------
  nuts: [
    // Classic
    { name: "Pistachios, roasted",                           store: ["CM","SM","AG"],  themes: ["persian","levantine","gulf","mediterranean","armenian","moroccan"],               p: "C" },
    { name: "Roasted cashews",                               store: ["CM","SM","AG"],  themes: ["persian","levantine","gulf","mediterranean","indian"],                            p: "C" },
    { name: "Spiced pecans",                                 store: ["CM"],            themes: ["american"],                                                                       p: "C" },
    { name: "Candied walnuts",                               store: ["CM"],            themes: ["american","french"],                                                              p: "C" },
    { name: "Roasted chickpeas",                             store: ["SM","AG"],       themes: ["levantine","gulf","northafrican","moroccan","mediterranean","egyptian"],           p: "C" },
    { name: "Walnuts with honey",                            store: ["CM","SM"],       themes: ["greek","persian","mediterranean","armenian"],                                     p: "C" },
    // Standard
    { name: "Marcona almonds",                               store: ["CM"],            themes: ["spanish","mediterranean"],                                                        p: "S" },
    { name: "Spiced almonds",                                store: ["CM","SM"],       themes: ["northafrican","spanish","mediterranean","moroccan"],                              p: "S" },
    { name: "Pine nuts, toasted",                            store: ["CM","SM"],       themes: ["mediterranean","italian","levantine","gulf"],                                     p: "S" },
    { name: "Pepitas (pumpkin seeds)",                       store: ["CM"],            themes: ["latin"],                                                                          p: "S" },
    { name: "Cajun spiced cashews",                          store: ["CM"],            themes: ["american"],                                                                       p: "S" },
    { name: "Mixed nuts, za'atar spiced",                    store: ["SM"],            themes: ["levantine","gulf"],                                                               p: "S" },
    { name: "Masala spiced nuts",                            store: ["CM"],            themes: ["indian"],                                                                         p: "S" },
    { name: "Khaleeji nuts (cardamom & saffron spiced)",     store: ["AG","SM"],       themes: ["gulf"],                                                                           p: "S" },
    // Explorer
    { name: "Turkish hazelnuts",                             store: ["AG"],            themes: ["turkish","mediterranean"],                                                        p: "E" },
    { name: "Tokhme (Persian roasted watermelon seeds)",     store: ["SM","AG"],       themes: ["persian","gulf"],                                                                 p: "E" },
  ],

  // ----------------------------------------------------------
  spreads: [
    // Classic
    { name: "Wildflower honey",                              store: ["CM"],            themes: ["american","french","mediterranean"],                                              p: "C" },
    { name: "Hummus",                                        store: ["SM","CM"],       themes: ["levantine","gulf","greek","mediterranean","egyptian"],                            p: "C" },
    { name: "Baba ghanoush (smoky eggplant dip)",            store: ["SM"],            themes: ["levantine","gulf","mediterranean","egyptian"],                                    p: "C" },
    { name: "Labneh with za'atar",                           store: ["SM"],            themes: ["levantine","gulf","armenian"],                                                    p: "C" },
    { name: "Tahini",                                        store: ["SM","AG","CM"],  themes: ["levantine","gulf","greek","northafrican","persian","moroccan","egyptian"],        p: "C" },
    { name: "Guacamole",                                     store: ["CM"],            themes: ["latin"],                                                                          p: "C" },
    { name: "Whole-grain mustard",                           store: ["CM"],            themes: ["american","french"],                                                              p: "C" },
    { name: "Pepper jelly",                                  store: ["CM"],            themes: ["american"],                                                                       p: "C" },
    { name: "Apple butter",                                  store: ["CM"],            themes: ["american"],                                                                       p: "C" },
    { name: "Mango chutney",                                 store: ["CM"],            themes: ["indian"],                                                                         p: "C" },
    { name: "Mint-cilantro chutney",                         store: ["CM"],            themes: ["indian"],                                                                         p: "C" },
    // Standard
    { name: "Tzatziki",                                      store: ["CM","SM"],       themes: ["greek","mediterranean"],                                                          p: "S" },
    { name: "Pesto",                                         store: ["CM"],            themes: ["italian"],                                                                        p: "S" },
    { name: "Fig jam",                                       store: ["CM"],            themes: ["french","italian","mediterranean","spanish"],                                     p: "S" },
    { name: "Tapenade (olive spread)",                       store: ["CM","SM"],       themes: ["french","mediterranean","greek"],                                                 p: "S" },
    { name: "Harissa (North African chili paste)",           store: ["CM","SM"],       themes: ["northafrican","moroccan","mediterranean"],                                        p: "S" },
    { name: "Muhammara (red pepper-walnut dip)",             store: ["SM"],            themes: ["levantine","gulf","turkish","armenian"],                                          p: "S" },
    { name: "Toum (garlic cream)",                           store: ["SM"],            themes: ["levantine","gulf"],                                                               p: "S" },
    { name: "Pomegranate molasses",                          store: ["SM","AG"],       themes: ["levantine","gulf","persian","northafrican","moroccan","armenian"],                p: "S" },
    { name: "Mast-o-khiar (yogurt-cucumber dip)",            store: ["SM"],            themes: ["persian","gulf"],                                                                 p: "S" },
    { name: "Truffle honey",                                 store: ["CM"],            themes: ["italian","french"],                                                               p: "S" },
    { name: "Apricot preserves",                             store: ["CM"],            themes: ["french","mediterranean","moroccan"],                                              p: "S" },
    { name: "Sun-dried tomato spread",                       store: ["CM"],            themes: ["italian","mediterranean"],                                                        p: "S" },
    { name: "Amlou (Moroccan almond-argan spread)",          store: ["CM"],            themes: ["moroccan"],                                                                       p: "S" },
    { name: "Zaalouk (Moroccan eggplant-tomato dip)",        store: ["SM","CM"],       themes: ["moroccan","northafrican"],                                                        p: "S" },
    { name: "Argan oil for dipping",                         store: ["CM"],            themes: ["moroccan"],                                                                       p: "S" },
    { name: "Mutabal (smoky eggplant & tahini dip)",         store: ["SM"],            themes: ["levantine","gulf"],                                                               p: "S" },
    { name: "Salsa verde",                                   store: ["CM"],            themes: ["latin"],                                                                          p: "S" },
    { name: "Olive oil + za'atar for dipping",               store: ["SM","AG"],       themes: ["levantine","gulf","mediterranean","greek"],                                       p: "S" },
    { name: "Date molasses",                                 store: ["SM","AG"],       themes: ["persian","gulf","northafrican"],                                                  p: "S" },
    { name: "Bissara (Egyptian fava bean dip)",              store: ["SM"],            themes: ["egyptian","moroccan","northafrican"],                                             p: "S" },
    { name: "Tamarind-date chutney",                         store: ["CM"],            themes: ["indian"],                                                                         p: "S" },
    // Explorer
    { name: "Romesco (Spanish roasted red pepper & almond sauce)", store: ["CM"],      themes: ["spanish","mediterranean"],                                                        p: "E" },
    { name: "Haydari (yogurt-herb dip)",                     store: ["AG","SM"],       themes: ["turkish"],                                                                        p: "E" },
    { name: "Biber salçası (pepper paste)",                  store: ["AG"],            themes: ["turkish","gulf"],                                                                 p: "E" },
    { name: "Kashk (fermented whey dip)",                    store: ["SM"],            themes: ["persian"],                                                                        p: "E" },
    { name: "Chermoula (North African herb & spice sauce)",  store: ["SM"],            themes: ["northafrican","moroccan"],                                                        p: "E" },
    { name: "Skordalia (garlic dip)",                        store: ["CM"],            themes: ["greek"],                                                                          p: "E" },
  ],

  // ----------------------------------------------------------
  pickles: [
    // Classic
    { name: "Kalamata olives",                               store: ["CM","SM"],       themes: ["greek","mediterranean"],                                                          p: "C" },
    { name: "Mixed marinated olives",                        store: ["CM","SM"],       themes: ["mediterranean","spanish","french","moroccan"],                                    p: "C" },
    { name: "Pickled jalapeños",                             store: ["CM"],            themes: ["latin","american"],                                                               p: "C" },
    { name: "Bread & butter pickles",                        store: ["CM"],            themes: ["american"],                                                                       p: "C" },
    { name: "Pickled turnips (pink)",                        store: ["SM","AG"],       themes: ["levantine","gulf","turkish","armenian","egyptian"],                               p: "C" },
    { name: "Pickled cucumbers, Middle Eastern style",       store: ["SM"],            themes: ["levantine","gulf","egyptian"],                                                    p: "C" },
    { name: "Pickled garlic",                                store: ["SM","AG","CM"],  themes: ["levantine","gulf","persian","mediterranean","armenian"],                          p: "C" },
    // Standard
    { name: "Castelvetrano olives (Sicilian mild green)",    store: ["CM"],            themes: ["italian","mediterranean"],                                                        p: "S" },
    { name: "Cerignola olives (Southern Italian large)",     store: ["CM"],            themes: ["italian","mediterranean"],                                                        p: "S" },
    { name: "Manzanilla olives, stuffed",                    store: ["CM"],            themes: ["spanish"],                                                                        p: "S" },
    { name: "Cornichons (French tiny pickled gherkins)",     store: ["CM"],            themes: ["french","american"],                                                              p: "S" },
    { name: "Marinated artichoke hearts",                    store: ["CM"],            themes: ["italian","mediterranean","greek"],                                                p: "S" },
    { name: "Roasted red peppers",                           store: ["CM"],            themes: ["mediterranean","spanish","italian","moroccan"],                                   p: "S" },
    { name: "Sun-dried tomatoes in oil",                     store: ["CM"],            themes: ["italian","mediterranean"],                                                        p: "S" },
    { name: "Pickled banana peppers",                        store: ["CM"],            themes: ["italian","american"],                                                             p: "S" },
    { name: "Peppadew peppers (South African sweet-hot)",    store: ["CM"],            themes: ["mediterranean","american"],                                                       p: "S" },
    { name: "Preserved lemons",                              store: ["SM","CM"],       themes: ["northafrican","persian","mediterranean","moroccan"],                              p: "S" },
    { name: "Pickled grape leaves",                          store: ["SM","AG"],       themes: ["greek","turkish","levantine","gulf","armenian"],                                  p: "S" },
    { name: "Pickled mango (aam ka achar)",                  store: ["CM"],            themes: ["indian"],                                                                         p: "S" },
    // Explorer
    { name: "Turşu (Turkish mixed pickled vegetables)",      store: ["AG"],            themes: ["turkish","gulf"],                                                                 p: "E" },
    { name: "Marinated mushrooms",                           store: ["CM"],            themes: ["italian","french","mediterranean"],                                               p: "E" },
    { name: "Torshi (Persian mixed pickles)",                store: ["SM"],            themes: ["persian","gulf","armenian"],                                                      p: "E" },
  ],

  // ----------------------------------------------------------
  vegetables: [
    // Classic
    { name: "Cherry tomatoes",                               store: ["CM","SM"],       themes: ["italian","mediterranean","greek","levantine","gulf"],                             p: "C" },
    { name: "Carrot sticks",                                 store: ["CM","SM"],       themes: ["american","french","mediterranean"],                                              p: "C" },
    { name: "Celery sticks",                                 store: ["CM"],            themes: ["american","french"],                                                              p: "C" },
    { name: "Cucumber spears",                               store: ["CM"],            themes: ["american","greek","mediterranean"],                                               p: "C" },
    { name: "Bell pepper strips",                            store: ["CM","SM"],       themes: ["american","latin","mediterranean","indian"],                                      p: "C" },
    { name: "Persian cucumbers, sliced",                     store: ["CM","SM"],       themes: ["persian","levantine","gulf","greek","mediterranean"],                             p: "C" },
    { name: "Radishes, trimmed",                             store: ["CM","SM"],       themes: ["french","persian","levantine","gulf","mediterranean","moroccan"],                 p: "C" },
    { name: "Snap peas",                                     store: ["CM"],            themes: ["american","french"],                                                              p: "C" },
    { name: "Broccoli florets",                              store: ["CM"],            themes: ["american","italian"],                                                             p: "C" },
    { name: "Cauliflower florets",                           store: ["CM"],            themes: ["american","mediterranean","levantine","gulf","indian"],                           p: "C" },
    { name: "Green onions / scallions",                      store: ["CM","SM"],       themes: ["persian","levantine","gulf","american","armenian"],                               p: "C" },
    { name: "Fresh mint sprigs",                             store: ["CM","SM"],       themes: ["persian","levantine","gulf","greek","northafrican","moroccan","armenian"],        p: "C" },
    // Standard
    { name: "Fresh basil leaves",                            store: ["CM"],            themes: ["italian","mediterranean","persian"],                                              p: "S" },
    { name: "Fresh dill",                                    store: ["CM","SM"],       themes: ["persian","greek","levantine","armenian"],                                         p: "S" },
    // Explorer
    { name: "Fresh tarragon",                                store: ["CM","SM"],       themes: ["persian","french","armenian"],                                                    p: "E" },
    { name: "Endive leaves",                                 store: ["CM"],            themes: ["french","italian"],                                                               p: "E" },
  ],

  // ----------------------------------------------------------
  extras: [
    // Classic
    { name: "Local Texas wildflower honey",                  store: ["CM"],            themes: ["american"],                                                                       p: "C" },
    { name: "Za'atar (Middle Eastern herb & sesame blend)",  store: ["SM","AG"],       themes: ["levantine","gulf","turkish","armenian","egyptian"],                               p: "C" },
    { name: "Sumac (tart red berry spice, lemony flavor)",   store: ["SM","AG"],       themes: ["levantine","gulf","persian","turkish","armenian"],                                p: "C" },
    { name: "Dolma (grape leaves stuffed with rice & herbs)", store: ["SM","AG"],      themes: ["greek","turkish","levantine","gulf","armenian"],                                  p: "C" },
    { name: "Baklava pieces",                                store: ["SM","AG"],       themes: ["turkish","greek","levantine","gulf","armenian"],                                  p: "C" },
    { name: "Dried cranberries",                             store: ["CM"],            themes: ["american"],                                                                       p: "C" },
    { name: "Dukkah (Egyptian nut & spice blend)",           store: ["CM"],            themes: ["egyptian","moroccan","mediterranean"],                                            p: "S" },
    // Standard
    { name: "Roasted garlic cloves",                         store: ["CM"],            themes: ["italian","mediterranean","french"],                                               p: "S" },
    { name: "Caperberries (large Mediterranean caper buds)", store: ["CM"],            themes: ["italian","mediterranean","spanish"],                                              p: "S" },
    { name: "Sesame halva (Middle Eastern sesame candy)",    store: ["SM","AG"],       themes: ["levantine","gulf","greek","egyptian"],                                            p: "S" },
    { name: "Lokum (Turkish delight)",                       store: ["AG"],            themes: ["turkish","gulf"],                                                                 p: "S" },
    { name: "Marcona almonds, rosemary",                     store: ["CM"],            themes: ["spanish","mediterranean"],                                                        p: "S" },
    { name: "Dulce de leche (Latin caramel milk spread)",    store: ["CM"],            themes: ["latin"],                                                                          p: "S" },
    { name: "Aleppo pepper flakes",                          store: ["SM","AG"],       themes: ["armenian","levantine","turkish"],                                                 p: "S" },
    { name: "Omani halwa (Gulf saffron & cardamom sweet)",   store: ["AG"],            themes: ["gulf"],                                                                           p: "E" },
    { name: "Luqaimat (Gulf sweet dumplings, date syrup)",   store: ["AG"],            themes: ["gulf"],                                                                           p: "E" },
    // Explorer
    { name: "Saffron honey",                                 store: ["SM"],            themes: ["persian","gulf","northafrican","moroccan","mediterranean"],                       p: "E" },
    { name: "Rose water candies",                            store: ["SM","AG"],       themes: ["persian","gulf"],                                                                 p: "E" },
  ],
};

// ============================================================
// HELPERS
// ============================================================

function themesClash(selectedThemeIds) {
  const clashes = [];
  for (const [a, b] of THEME_CLASHES) {
    if (selectedThemeIds.includes(a) && selectedThemeIds.includes(b)) {
      const labelA = THEMES.find(t => t.id === a).label;
      const labelB = THEMES.find(t => t.id === b).label;
      clashes.push(`${labelA} + ${labelB}`);
    }
  }
  return clashes;
}

function getEligibleItems(category, selectedThemeIds, boardProfile) {
  const allowed = PROFILE_INCLUDES[boardProfile] || ["C","S","E"];
  return ITEMS[category].filter(item =>
    item.themes.some(t => selectedThemeIds.includes(t)) &&
    allowed.includes(item.p)
  );
}

function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function rollBoard(selectedThemeIds, boardSize, boardProfile) {
  const n = BOARD_SIZES[boardSize].itemsPerCategory;
  const result = {};
  for (const category of Object.keys(ITEMS)) {
    const eligible = getEligibleItems(category, selectedThemeIds, boardProfile);
    result[category] = eligible.length > 0
      ? pickRandom(eligible, Math.min(n, eligible.length))
      : [];
  }
  return result;
}

function calcServing(category, mealRole, headCount, itemCount) {
  const g = SERVING_GUIDANCE[category];
  if (!g || itemCount === 0) return null;
  const total = g[mealRole] * headCount;
  const perItem = total / itemCount;
  const unit = g.unit;
  let imperial, metric;
  if (unit === "pieces") {
    const count = Math.max(1, Math.round(perItem));
    imperial = count + (count === 1 ? " piece" : " pieces");
    metric = null;
  } else if (unit === "tbsp") {
    const r = Math.round(perItem * 2) / 2;
    imperial = r >= 16 ? (Math.round((r/16)*4)/4) + " cup" : r + " tbsp";
    const ml = Math.round(perItem * 14.787);
    metric = ml >= 1000 ? (Math.round((ml/1000)*10)/10) + " L" : (Math.round(ml/5)*5) + " ml";
  } else {
    const r = Math.round(perItem * 2) / 2;
    imperial = r >= 16 ? (Math.round((r/16)*4)/4) + (r >= 32 ? " lbs" : " lb") : r + " oz";
    const g2 = Math.round(perItem * 28.3495);
    metric = g2 >= 1000 ? (Math.round((g2/1000)*10)/10) + " kg" : (Math.round(g2/5)*5) + " g";
  }
  return { imperial, metric };
}
