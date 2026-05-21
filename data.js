// ============================================================
// OMAR'S BOARD & GRAZE — DATA.JS
// Version 1.2.0
// "Built on a Levantine American palate —
//  where hummus and cheddar belong on the same board."
//
// All items pork-free. Board-ready, no cooking required.
// Stores: CM = Central Market, SM = Sara's Mediterranean, AG = Altin Grocery
// Profiles: C = Classic, S = Standard, E = Explorer
//   C — everyday on a Levantine American table
//   S — elevated but approachable, food-curious crowd
//   E — specialty, deep cuts, even a Levantine American pauses here
// ============================================================

const APP_VERSION = "1.2.0";

const THEMES = [
  { id: "american",      label: "American",        flag: "🇺🇸" },
  { id: "latin",         label: "Latin",           flag: "🌎" },
  { id: "mediterranean", label: "Mediterranean",   flag: "🌊" },
  { id: "french",        label: "French",          flag: "🇫🇷" },
  { id: "italian",       label: "Italian",         flag: "🇮🇹" },
  { id: "spanish",       label: "Spanish",         flag: "🇪🇸" },
  { id: "greek",         label: "Greek",           flag: "🇬🇷" },
  { id: "turkish",       label: "Turkish",         flag: "🇹🇷" },
  { id: "middleeastern", label: "Middle Eastern",  flag: "🌙" },
  { id: "northafrican",  label: "North African",   flag: "🌍" },
  { id: "persian",       label: "Persian",         flag: "🇮🇷" },
  { id: "levantine",     label: "Levantine",       flag: "🫒" },
];

const THEME_CLASHES = [
  ["american",   "middleeastern"],
  ["american",   "persian"],
  ["american",   "levantine"],
  ["american",   "northafrican"],
  ["american",   "turkish"],
  ["latin",      "northafrican"],
  ["latin",      "persian"],
  ["latin",      "middleeastern"],
  ["latin",      "levantine"],
  ["latin",      "turkish"],
  ["french",     "middleeastern"],
  ["french",     "persian"],
  ["french",     "northafrican"],
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

// Board personality profiles
const PROFILES = {
  classic:  { label: "Classic",  icon: "🧺", description: "Familiar favorites — no explanations needed" },
  standard: { label: "Curated",  icon: "🌿", description: "Elevated but approachable" },
  explorer: { label: "Explorer", icon: "🌶️", description: "The full board experience" },
};

// Which item profiles are included per board profile
// classic  → C only
// standard → C + S
// explorer → C + S + E
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

  meats: [
    // Classic — Levantine American everyday
    { name: "Smoked turkey breast",                          store: ["CM"],            themes: ["american","middleeastern","levantine"],                                          p: "C" },
    { name: "Roast beef, thinly sliced",                     store: ["CM"],            themes: ["american","middleeastern","levantine"],                                          p: "C" },
    { name: "Smoked chicken breast",                         store: ["CM"],            themes: ["american","middleeastern","levantine"],                                          p: "C" },
    { name: "Corned beef",                                   store: ["CM"],            themes: ["american","middleeastern","levantine"],                                          p: "C" },
    { name: "Beef mortadella, sliced",                       store: ["CM","SM","AG"],  themes: ["levantine","middleeastern","turkish","northafrican","persian","italian","mediterranean"], p: "C" },
    { name: "Poultry mortadella, sliced",                    store: ["SM","AG"],       themes: ["levantine","middleeastern","turkish","northafrican","persian"],                   p: "C" },
    { name: "Beef bologna, sliced",                          store: ["CM","SM","AG"],  themes: ["levantine","middleeastern","turkish","american"],                                p: "C" },
    { name: "Beef pastrami, sliced",                         store: ["CM","SM","AG"],  themes: ["levantine","middleeastern","american"],                                          p: "C" },
    { name: "Beef sujuk, dry-cured, sliced",                 store: ["SM","AG"],       themes: ["turkish","middleeastern","levantine"],                                           p: "C" },
    // Standard
    { name: "Beef salami",                                   store: ["CM","SM","AG"],  themes: ["italian","mediterranean","levantine","middleeastern"],                           p: "S" },
    { name: "Beef pepperoni",                                store: ["CM","SM"],       themes: ["italian","mediterranean","american"],                                            p: "S" },
    { name: "Beef basturma, sliced",                         store: ["SM","AG"],       themes: ["turkish","middleeastern","levantine","persian"],                                 p: "S" },
    { name: "Beef bresaola (Italian air-dried beef)",        store: ["CM"],            themes: ["italian","mediterranean"],                                                       p: "S" },
    // Explorer
    { name: "Smoked duck breast",                            store: ["CM"],            themes: ["french","mediterranean"],                                                        p: "E" },
    { name: "Duck rillettes (French shredded duck confit)",  store: ["CM"],            themes: ["french"],                                                                        p: "E" },
    { name: "Chicken liver mousse",                          store: ["CM"],            themes: ["french"],                                                                        p: "E" },
  ],

  cheeses: [
    // Classic
    { name: "Aged white cheddar",                            store: ["CM"],            themes: ["american"],                                                                      p: "C" },
    { name: "Pepper jack",                                   store: ["CM"],            themes: ["american","latin"],                                                              p: "C" },
    { name: "Colby jack",                                    store: ["CM"],            themes: ["american"],                                                                      p: "C" },
    { name: "Cream cheese block",                            store: ["CM"],            themes: ["american"],                                                                      p: "C" },
    { name: "Feta (sheep's milk)",                           store: ["CM","SM"],       themes: ["greek","mediterranean","levantine","middleeastern"],                             p: "C" },
    { name: "Labneh (strained yogurt cheese)",               store: ["SM","AG"],       themes: ["middleeastern","levantine","persian","northafrican"],                            p: "C" },
    { name: "Beyaz peynir (white cheese)",                   store: ["AG","SM"],       themes: ["turkish","middleeastern"],                                                       p: "C" },
    { name: "Halloumi (Cypriot firm grilling cheese)",       store: ["CM","SM"],       themes: ["greek","levantine","middleeastern"],                                             p: "C" },
    // Standard
    { name: "Brie de Meaux",                                 store: ["CM"],            themes: ["french","mediterranean"],                                                        p: "S" },
    { name: "Camembert",                                     store: ["CM"],            themes: ["french"],                                                                        p: "S" },
    { name: "Manchego (6-month aged)",                       store: ["CM"],            themes: ["spanish","mediterranean"],                                                       p: "S" },
    { name: "Parmigiano Reggiano",                           store: ["CM"],            themes: ["italian","mediterranean"],                                                       p: "S" },
    { name: "Grana Padano",                                  store: ["CM"],            themes: ["italian","mediterranean"],                                                       p: "S" },
    { name: "Burrata",                                       store: ["CM"],            themes: ["italian","mediterranean"],                                                       p: "S" },
    { name: "Smoked gouda",                                  store: ["CM"],            themes: ["american","mediterranean"],                                                      p: "S" },
    { name: "Whipped feta",                                  store: ["CM","SM"],       themes: ["greek","mediterranean","levantine"],                                             p: "S" },
    { name: "Akkawi (Levantine mild white cheese)",          store: ["SM"],            themes: ["levantine","middleeastern"],                                                     p: "S" },
    { name: "Panir (fresh Persian cheese, similar to feta)", store: ["SM"],            themes: ["persian"],                                                                       p: "S" },
    { name: "Queso fresco",                                  store: ["CM"],            themes: ["latin"],                                                                         p: "S" },
    { name: "Chèvre (fresh goat cheese)",                    store: ["CM","SM"],       themes: ["french","mediterranean"],                                                        p: "S" },
    { name: "Comté (French aged cow's milk)",                store: ["CM"],            themes: ["french"],                                                                        p: "S" },
    { name: "Roquefort",                                     store: ["CM"],            themes: ["french"],                                                                        p: "S" },
    { name: "Pecorino Romano",                               store: ["CM"],            themes: ["italian","mediterranean","greek"],                                               p: "S" },
    { name: "Asiago",                                        store: ["CM"],            themes: ["italian"],                                                                       p: "S" },
    { name: "Cotija, aged",                                  store: ["CM"],            themes: ["latin"],                                                                         p: "S" },
    // Explorer
    { name: "Taleggio",                                      store: ["CM"],            themes: ["italian"],                                                                       p: "E" },
    { name: "Époisses (French washed-rind, pungent)",        store: ["CM"],            themes: ["french"],                                                                        p: "E" },
    { name: "Idiazábal (Spanish smoked sheep's milk)",       store: ["CM"],            themes: ["spanish"],                                                                       p: "E" },
    { name: "Mahón (Spanish cow's milk, semi-firm)",         store: ["CM"],            themes: ["spanish"],                                                                       p: "E" },
    { name: "Kasseri (Greek semi-hard sheep's milk)",        store: ["CM"],            themes: ["greek"],                                                                         p: "E" },
    { name: "Graviera (Greek aged cow's milk, nutty)",       store: ["CM"],            themes: ["greek"],                                                                         p: "E" },
    { name: "Kaşar peyniri (Turkish semi-hard yellow cheese)", store: ["AG"],          themes: ["turkish"],                                                                       p: "E" },
    { name: "Tulum peyniri (Turkish aged crumbly white cheese)", store: ["AG"],        themes: ["turkish"],                                                                       p: "E" },
    { name: "Nabulsi (Palestinian brined white cheese)",     store: ["SM"],            themes: ["levantine"],                                                                     p: "E" },
    { name: "Lighvan (Persian brined sheep's milk)",         store: ["SM"],            themes: ["persian","middleeastern"],                                                       p: "E" },
    { name: "Oaxacan string cheese",                         store: ["CM"],            themes: ["latin"],                                                                         p: "E" },
  ],

  fruits: [
    // Classic
    { name: "Red & green grapes",                            store: ["CM","SM"],       themes: ["american","french","italian","mediterranean","spanish","greek"],                 p: "C" },
    { name: "Sliced strawberries",                           store: ["CM","SM"],       themes: ["american","french"],                                                             p: "C" },
    { name: "Sliced Honeycrisp apple",                       store: ["CM"],            themes: ["american","french"],                                                             p: "C" },
    { name: "Sliced Bosc pear",                              store: ["CM"],            themes: ["american","french","italian"],                                                   p: "C" },
    { name: "Blackberries",                                  store: ["CM"],            themes: ["american","french"],                                                             p: "C" },
    { name: "Blueberries",                                   store: ["CM"],            themes: ["american"],                                                                      p: "C" },
    { name: "Medjool dates",                                 store: ["SM","AG"],       themes: ["middleeastern","levantine","northafrican","persian","mediterranean"],            p: "C" },
    { name: "Dried apricots",                                store: ["CM","SM","AG"],  themes: ["turkish","persian","middleeastern","mediterranean"],                             p: "C" },
    { name: "Pomegranate arils",                             store: ["CM","SM"],       themes: ["persian","levantine","middleeastern","northafrican","greek"],                   p: "C" },
    { name: "Sliced mango",                                  store: ["CM","SM"],       themes: ["latin"],                                                                         p: "C" },
    // Standard
    { name: "Fresh figs, halved",                            store: ["CM","SM"],       themes: ["mediterranean","french","italian","greek","levantine"],                         p: "S" },
    { name: "Dried Calimyrna figs",                          store: ["CM","SM"],       themes: ["mediterranean","turkish","persian","levantine"],                                 p: "S" },
    { name: "Dried sour cherries",                           store: ["CM","AG"],       themes: ["turkish","persian","mediterranean"],                                             p: "S" },
    { name: "Golden raisins",                                store: ["CM","AG"],       themes: ["northafrican","persian","mediterranean"],                                        p: "S" },
    { name: "Dried mandarin slices",                         store: ["CM","AG"],       themes: ["mediterranean","turkish","persian","northafrican"],                              p: "S" },
    { name: "Guava paste slices",                            store: ["CM"],            themes: ["latin"],                                                                         p: "S" },
    { name: "Sliced papaya",                                 store: ["CM"],            themes: ["latin"],                                                                         p: "S" },
    // Explorer
    { name: "Aloo bokhara (dried Persian plums)",            store: ["SM"],            themes: ["persian","middleeastern"],                                                       p: "E" },
    { name: "Lavashak (Persian fruit leather)",              store: ["SM"],            themes: ["persian"],                                                                       p: "E" },
    { name: "Zereshk (dried barberries)",                    store: ["SM"],            themes: ["persian"],                                                                       p: "E" },
  ],

  crackers: [
    // Classic
    { name: "Water crackers",                                store: ["CM"],            themes: ["american","french","italian"],                                                   p: "C" },
    { name: "Multigrain crackers",                           store: ["CM"],            themes: ["american","mediterranean"],                                                      p: "C" },
    { name: "Sesame seed crackers",                          store: ["CM","SM"],       themes: ["mediterranean","greek","middleeastern"],                                         p: "C" },
    // Standard
    { name: "Herb flatbread crackers",                       store: ["CM"],            themes: ["mediterranean","french","italian"],                                              p: "S" },
    { name: "Olive oil crackers",                            store: ["CM"],            themes: ["italian","spanish","mediterranean","greek"],                                     p: "S" },
    { name: "Raincoast crisps",                              store: ["CM"],            themes: ["american"],                                                                      p: "S" },
    { name: "Seeded rye crispbread",                         store: ["CM"],            themes: ["french","american"],                                                             p: "S" },
    // Explorer
    { name: "Taralli (Italian ring crackers)",               store: ["CM"],            themes: ["italian"],                                                                       p: "E" },
  ],

  breads: [
    // Classic
    { name: "Fresh pita bread",                              store: ["SM"],            themes: ["middleeastern","levantine","greek","mediterranean"],                             p: "C" },
    { name: "Pita chips",                                    store: ["CM","SM"],       themes: ["greek","middleeastern","levantine"],                                             p: "C" },
    { name: "Sourdough slices, toasted",                     store: ["CM"],            themes: ["american","french"],                                                             p: "C" },
    { name: "Corn tortilla chips",                           store: ["CM"],            themes: ["latin"],                                                                         p: "C" },
    // Standard
    { name: "Baguette slices",                               store: ["CM"],            themes: ["french","mediterranean"],                                                        p: "S" },
    { name: "Crostini, toasted",                             store: ["CM"],            themes: ["italian","mediterranean","french"],                                              p: "S" },
    { name: "Focaccia, sliced",                              store: ["CM"],            themes: ["italian","mediterranean"],                                                       p: "S" },
    { name: "Lavash (Armenian/Persian thin flatbread)",      store: ["AG","SM"],       themes: ["turkish","persian","levantine","middleeastern"],                                 p: "S" },
    { name: "Pide (Turkish flatbread)",                      store: ["AG"],            themes: ["turkish"],                                                                       p: "S" },
    // Explorer
    { name: "Barbari (Persian sesame-topped flatbread)",     store: ["SM"],            themes: ["persian"],                                                                       p: "E" },
    { name: "Sangak (Persian stone-baked flatbread)",        store: ["SM"],            themes: ["persian"],                                                                       p: "E" },
    { name: "Markook (Levantine paper-thin flatbread)",      store: ["SM"],            themes: ["levantine","middleeastern"],                                                     p: "E" },
  ],

  nuts: [
    // Classic
    { name: "Pistachios, roasted",                           store: ["CM","SM","AG"],  themes: ["persian","middleeastern","levantine","mediterranean"],                           p: "C" },
    { name: "Roasted cashews",                               store: ["CM","SM","AG"],  themes: ["persian","middleeastern","mediterranean"],                                       p: "C" },
    { name: "Spiced pecans",                                 store: ["CM"],            themes: ["american"],                                                                      p: "C" },
    { name: "Candied walnuts",                               store: ["CM"],            themes: ["american","french"],                                                             p: "C" },
    { name: "Roasted chickpeas",                             store: ["SM","AG"],       themes: ["middleeastern","levantine","northafrican","mediterranean"],                      p: "C" },
    { name: "Walnuts with honey",                            store: ["CM","SM"],       themes: ["greek","persian","mediterranean"],                                               p: "C" },
    // Standard
    { name: "Marcona almonds",                               store: ["CM"],            themes: ["spanish","mediterranean"],                                                       p: "S" },
    { name: "Spiced almonds",                                store: ["CM","SM"],       themes: ["northafrican","spanish","mediterranean"],                                        p: "S" },
    { name: "Pine nuts, toasted",                            store: ["CM","SM"],       themes: ["mediterranean","italian","levantine","middleeastern"],                           p: "S" },
    { name: "Pepitas (pumpkin seeds)",                       store: ["CM"],            themes: ["latin"],                                                                         p: "S" },
    { name: "Cajun spiced cashews",                          store: ["CM"],            themes: ["american"],                                                                      p: "S" },
    { name: "Mixed nuts, za'atar spiced",                    store: ["SM"],            themes: ["levantine","middleeastern"],                                                     p: "S" },
    // Explorer
    { name: "Turkish hazelnuts",                             store: ["AG"],            themes: ["turkish","mediterranean"],                                                       p: "E" },
    { name: "Tokhme (Persian roasted watermelon seeds)",     store: ["SM","AG"],       themes: ["persian","middleeastern"],                                                       p: "E" },
  ],

  spreads: [
    // Classic
    { name: "Wildflower honey",                              store: ["CM"],            themes: ["american","french","mediterranean"],                                             p: "C" },
    { name: "Hummus",                                        store: ["SM","CM"],       themes: ["middleeastern","levantine","greek","mediterranean"],                             p: "C" },
    { name: "Baba ghanoush (smoky eggplant dip)",            store: ["SM"],            themes: ["middleeastern","levantine","mediterranean"],                                     p: "C" },
    { name: "Labneh with za'atar",                           store: ["SM"],            themes: ["levantine","middleeastern"],                                                     p: "C" },
    { name: "Tahini",                                        store: ["SM","AG","CM"],  themes: ["middleeastern","levantine","greek","northafrican","persian"],                    p: "C" },
    { name: "Guacamole",                                     store: ["CM"],            themes: ["latin"],                                                                         p: "C" },
    { name: "Whole-grain mustard",                           store: ["CM"],            themes: ["american","french"],                                                             p: "C" },
    { name: "Pepper jelly",                                  store: ["CM"],            themes: ["american"],                                                                      p: "C" },
    { name: "Apple butter",                                  store: ["CM"],            themes: ["american"],                                                                      p: "C" },
    // Standard
    { name: "Tzatziki",                                      store: ["CM","SM"],       themes: ["greek","mediterranean"],                                                         p: "S" },
    { name: "Pesto",                                         store: ["CM"],            themes: ["italian"],                                                                       p: "S" },
    { name: "Fig jam",                                       store: ["CM"],            themes: ["french","italian","mediterranean","spanish"],                                    p: "S" },
    { name: "Tapenade (olive spread)",                       store: ["CM","SM"],       themes: ["french","mediterranean","greek"],                                                p: "S" },
    { name: "Harissa (North African chili paste)",           store: ["CM","SM"],       themes: ["northafrican","mediterranean"],                                                  p: "S" },
    { name: "Muhammara (red pepper-walnut dip)",             store: ["SM"],            themes: ["levantine","middleeastern","turkish"],                                           p: "S" },
    { name: "Toum (garlic cream)",                           store: ["SM"],            themes: ["levantine","middleeastern"],                                                     p: "S" },
    { name: "Pomegranate molasses",                          store: ["SM","AG"],       themes: ["levantine","middleeastern","persian","northafrican"],                            p: "S" },
    { name: "Mast-o-khiar (yogurt-cucumber dip)",            store: ["SM"],            themes: ["persian","middleeastern"],                                                       p: "S" },
    { name: "Truffle honey",                                 store: ["CM"],            themes: ["italian","french"],                                                              p: "S" },
    { name: "Apricot preserves",                             store: ["CM"],            themes: ["french","mediterranean"],                                                        p: "S" },
    { name: "Sun-dried tomato spread",                       store: ["CM"],            themes: ["italian","mediterranean"],                                                       p: "S" },
    { name: "Membrillo (quince paste)",                      store: ["CM"],            themes: ["spanish","mediterranean"],                                                       p: "S" },
    { name: "Mutabal (smoky eggplant & tahini dip)",         store: ["SM"],            themes: ["levantine","middleeastern"],                                                     p: "S" },
    { name: "Salsa verde",                                   store: ["CM"],            themes: ["latin"],                                                                         p: "S" },
    { name: "Olive oil + za'atar for dipping",               store: ["SM","AG"],       themes: ["levantine","middleeastern","mediterranean","greek"],                             p: "S" },
    { name: "Date molasses",                                 store: ["SM","AG"],       themes: ["persian","middleeastern","northafrican"],                                        p: "S" },
    // Explorer
    { name: "Romesco (Spanish roasted red pepper & almond sauce)", store: ["CM"],      themes: ["spanish","mediterranean"],                                                       p: "E" },
    { name: "Haydari (yogurt-herb dip)",                     store: ["AG","SM"],       themes: ["turkish"],                                                                       p: "E" },
    { name: "Biber salçası (pepper paste)",                  store: ["AG"],            themes: ["turkish","middleeastern"],                                                       p: "E" },
    { name: "Kashk (fermented whey dip)",                    store: ["SM"],            themes: ["persian"],                                                                       p: "E" },
    { name: "Chermoula (North African herb & spice sauce)",  store: ["SM"],            themes: ["northafrican"],                                                                  p: "E" },
    { name: "Skordalia (garlic dip)",                        store: ["CM"],            themes: ["greek"],                                                                         p: "E" },
  ],

  pickles: [
    // Classic
    { name: "Kalamata olives",                               store: ["CM","SM"],       themes: ["greek","mediterranean"],                                                         p: "C" },
    { name: "Mixed marinated olives",                        store: ["CM","SM"],       themes: ["mediterranean","spanish","french"],                                              p: "C" },
    { name: "Pickled jalapeños",                             store: ["CM"],            themes: ["latin","american"],                                                              p: "C" },
    { name: "Bread & butter pickles",                        store: ["CM"],            themes: ["american"],                                                                      p: "C" },
    { name: "Pickled turnips (pink)",                        store: ["SM","AG"],       themes: ["levantine","middleeastern","turkish"],                                           p: "C" },
    { name: "Pickled cucumbers, Middle Eastern style",       store: ["SM"],            themes: ["levantine","middleeastern"],                                                     p: "C" },
    { name: "Pickled garlic",                                store: ["SM","AG","CM"],  themes: ["middleeastern","levantine","persian","mediterranean"],                           p: "C" },
    // Standard
    { name: "Castelvetrano olives (Sicilian mild green)",    store: ["CM"],            themes: ["italian","mediterranean"],                                                       p: "S" },
    { name: "Cerignola olives (Southern Italian large)",     store: ["CM"],            themes: ["italian","mediterranean"],                                                       p: "S" },
    { name: "Manzanilla olives, stuffed",                    store: ["CM"],            themes: ["spanish"],                                                                       p: "S" },
    { name: "Cornichons (French tiny pickled gherkins)",     store: ["CM"],            themes: ["french","american"],                                                             p: "S" },
    { name: "Marinated artichoke hearts",                    store: ["CM"],            themes: ["italian","mediterranean","greek"],                                               p: "S" },
    { name: "Roasted red peppers",                           store: ["CM"],            themes: ["mediterranean","spanish","italian"],                                             p: "S" },
    { name: "Sun-dried tomatoes in oil",                     store: ["CM"],            themes: ["italian","mediterranean"],                                                       p: "S" },
    { name: "Pickled banana peppers",                        store: ["CM"],            themes: ["italian","american"],                                                            p: "S" },
    { name: "Peppadew peppers (South African sweet-hot)",    store: ["CM"],            themes: ["mediterranean","american"],                                                      p: "S" },
    { name: "Preserved lemons",                              store: ["SM","CM"],       themes: ["northafrican","persian","mediterranean"],                                        p: "S" },
    { name: "Pickled grape leaves",                          store: ["SM","AG"],       themes: ["greek","turkish","levantine"],                                                   p: "S" },
    // Explorer
    { name: "Turşu (Turkish mixed pickled vegetables)",      store: ["AG"],            themes: ["turkish","middleeastern"],                                                       p: "E" },
    { name: "Marinated mushrooms",                           store: ["CM"],            themes: ["italian","french","mediterranean"],                                              p: "E" },
    { name: "Torshi (Persian mixed pickles)",                store: ["SM"],            themes: ["persian"],                                                                       p: "E" },
  ],

  vegetables: [
    // Classic — all raw crudités, mostly everyday
    { name: "Cherry tomatoes",                               store: ["CM","SM"],       themes: ["italian","mediterranean","greek","levantine"],                                   p: "C" },
    { name: "Carrot sticks",                                 store: ["CM","SM"],       themes: ["american","french","mediterranean"],                                             p: "C" },
    { name: "Celery sticks",                                 store: ["CM"],            themes: ["american","french"],                                                             p: "C" },
    { name: "Cucumber spears",                               store: ["CM"],            themes: ["american","greek","mediterranean"],                                              p: "C" },
    { name: "Bell pepper strips",                            store: ["CM","SM"],       themes: ["american","latin","mediterranean"],                                              p: "C" },
    { name: "Persian cucumbers, sliced",                     store: ["CM","SM"],       themes: ["persian","levantine","middleeastern","greek","mediterranean"],                   p: "C" },
    { name: "Radishes, trimmed",                             store: ["CM","SM"],       themes: ["french","persian","levantine","middleeastern","mediterranean"],                  p: "C" },
    { name: "Snap peas",                                     store: ["CM"],            themes: ["american","french"],                                                             p: "C" },
    { name: "Broccoli florets",                              store: ["CM"],            themes: ["american","italian"],                                                            p: "C" },
    { name: "Cauliflower florets",                           store: ["CM"],            themes: ["american","mediterranean","levantine"],                                          p: "C" },
    { name: "Green onions / scallions",                      store: ["CM","SM"],       themes: ["persian","levantine","middleeastern","american"],                                p: "C" },
    { name: "Fresh mint sprigs",                             store: ["CM","SM"],       themes: ["persian","levantine","middleeastern","greek","northafrican"],                    p: "C" },
    // Standard
    { name: "Fresh basil leaves",                            store: ["CM"],            themes: ["italian","mediterranean","persian"],                                             p: "S" },
    { name: "Fresh dill",                                    store: ["CM","SM"],       themes: ["persian","greek","levantine"],                                                   p: "S" },
    // Explorer
    { name: "Fresh tarragon",                                store: ["CM","SM"],       themes: ["persian","french"],                                                              p: "E" },
    { name: "Endive leaves",                                 store: ["CM"],            themes: ["french","italian"],                                                              p: "E" },
  ],

  extras: [
    // Classic
    { name: "Local Texas wildflower honey",                  store: ["CM"],            themes: ["american"],                                                                      p: "C" },
    { name: "Za'atar (Middle Eastern herb & sesame blend)",  store: ["SM","AG"],       themes: ["levantine","middleeastern","turkish"],                                           p: "C" },
    { name: "Sumac (tart red berry spice, lemony flavor)",   store: ["SM","AG"],       themes: ["levantine","middleeastern","persian","turkish"],                                 p: "C" },
    { name: "Dolma (grape leaves stuffed with rice & herbs)",store: ["SM","AG"],       themes: ["greek","turkish","levantine"],                                                   p: "C" },
    { name: "Baklava pieces",                                store: ["SM","AG"],       themes: ["turkish","greek","middleeastern"],                                               p: "C" },
    { name: "Dried cranberries",                             store: ["CM"],            themes: ["american"],                                                                      p: "C" },
    // Standard
    { name: "Roasted garlic cloves",                         store: ["CM"],            themes: ["italian","mediterranean","french"],                                              p: "S" },
    { name: "Caperberries (large Mediterranean caper buds)", store: ["CM"],            themes: ["italian","mediterranean","spanish"],                                             p: "S" },
    { name: "Sesame halva (Middle Eastern sesame candy)",    store: ["SM","AG"],       themes: ["middleeastern","levantine","greek"],                                             p: "S" },
    { name: "Lokum (Turkish delight)",                       store: ["AG"],            themes: ["turkish"],                                                                       p: "S" },
    { name: "Marcona almonds, rosemary",                     store: ["CM"],            themes: ["spanish","mediterranean"],                                                       p: "S" },
    { name: "Dulce de leche (Latin caramel milk spread)",    store: ["CM"],            themes: ["latin"],                                                                         p: "S" },
    // Explorer
    { name: "Saffron honey",                                 store: ["SM"],            themes: ["persian","northafrican","mediterranean"],                                        p: "E" },
    { name: "Rose water candies",                            store: ["SM","AG"],       themes: ["persian","middleeastern"],                                                       p: "E" },
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
