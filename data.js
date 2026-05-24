// ============================================================
// OMAR'S BOARD & GRAZE — DATA.JS
// Version 1.6.0
// "Built on a Levantine American palate —
//  where hummus and cheddar belong on the same board."
//
// All items pork-free. Board-ready, no cooking required.
// Stores: CM = Central Market, SM = Sara's Mediterranean, AG = Altin Grocery
// Profiles: C = Classic, S = Standard, E = Explorer
// Families: foundational (multiple per board OK) | exclusive (one per board max)
// ============================================================

const APP_VERSION = "1.6.0";

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

const THEME_CLASHES = [
  ["american", "levantine"],   ["american", "gulf"],
  ["american", "persian"],     ["american", "northafrican"],
  ["american", "moroccan"],    ["american", "turkish"],
  ["american", "armenian"],    ["american", "egyptian"],
  ["latin", "levantine"],      ["latin", "gulf"],
  ["latin", "persian"],        ["latin", "northafrican"],
  ["latin", "moroccan"],       ["latin", "turkish"],
  ["latin", "armenian"],       ["latin", "egyptian"],
  ["latin", "indian"],
  ["french", "levantine"],     ["french", "persian"],
  ["french", "northafrican"],  ["french", "moroccan"],
  ["french", "gulf"],          ["french", "egyptian"],
  ["italian", "gulf"],         ["italian", "levantine"],
  ["italian", "persian"],      ["italian", "northafrican"],
  ["italian", "moroccan"],     ["italian", "indian"],
  ["spanish", "gulf"],         ["spanish", "levantine"],
  ["spanish", "persian"],      ["spanish", "northafrican"],
  ["spanish", "moroccan"],     ["spanish", "indian"],
  ["indian", "french"],        ["indian", "italian"],
  ["indian", "spanish"],       ["indian", "moroccan"],
  ["moroccan", "american"],    ["moroccan", "latin"],
];

// Affinity groups — used by Surprise Me to pick coherent theme combos
const THEME_AFFINITIES = [
  ["levantine", "gulf", "persian", "turkish"],
  ["levantine", "gulf", "egyptian", "moroccan"],
  ["french", "italian", "spanish", "mediterranean"],
  ["greek", "turkish", "levantine", "mediterranean"],
  ["persian", "armenian", "turkish"],
  ["moroccan", "northafrican", "mediterranean"],
  ["gulf", "indian"],
  ["armenian", "levantine", "persian"],
  ["egyptian", "moroccan", "northafrican"],
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

// ============================================================
// FAMILY SYSTEM
// type: "foundational" — multiple per board fine
//       "exclusive"    — one per board maximum (initial roll only)
// ============================================================
const FAMILIES = {
  // FOUNDATIONAL — variety within family is desirable
  olive:          { type: "foundational", label: "Olives" },
  fresh_fruit:    { type: "foundational", label: "Fresh Fruit" },
  dried_fruit:    { type: "foundational", label: "Dried Fruit" },
  nut:            { type: "foundational", label: "Nuts" },
  fresh_veg:      { type: "foundational", label: "Fresh Vegetables" },
  fresh_herb:     { type: "foundational", label: "Fresh Herbs" },
  cheese_aged:    { type: "foundational", label: "Aged Cheese" },
  cheese_fresh:   { type: "foundational", label: "Fresh Cheese" },
  cheese_brined:  { type: "foundational", label: "Brined Cheese" },
  cheese_soft:    { type: "foundational", label: "Soft-Ripened Cheese" },
  flatbread:      { type: "foundational", label: "Flatbread" },
  cracker:        { type: "foundational", label: "Crackers" },
  cured_meat:     { type: "foundational", label: "Cured Meat" },
  deli_meat:      { type: "foundational", label: "Deli Meat" },
  sweet:          { type: "foundational", label: "Sweets" },
  spice_blend:    { type: "foundational", label: "Spice Blends" },

  // EXCLUSIVE — one per board maximum
  date:           { type: "exclusive", label: "Dates" },
  fig:            { type: "exclusive", label: "Figs" },
  eggplant_dip:   { type: "exclusive", label: "Eggplant Dip" },
  yogurt_dip:     { type: "exclusive", label: "Yogurt Dip" },
  legume_dip:     { type: "exclusive", label: "Legume Dip" },
  garlic_dip:     { type: "exclusive", label: "Garlic Dip" },
  pepper_spread:  { type: "exclusive", label: "Pepper Spread" },
  honey:          { type: "exclusive", label: "Honey" },
  pickled_veg:    { type: "exclusive", label: "Pickled Vegetables" },
  marinated_veg:  { type: "exclusive", label: "Marinated Vegetables" },
  mortadella:     { type: "exclusive", label: "Mortadella" },
  fruit_leather:  { type: "exclusive", label: "Fruit Leather/Paste" },
  chutney:        { type: "exclusive", label: "Chutney" },
  jam:            { type: "exclusive", label: "Jam/Preserves" },
  halva:          { type: "exclusive", label: "Halva" },
};

const SERVING_GUIDANCE = {
  meats:      { unit: "oz", appetizer: 1.5, main: 4,  grazing: 6,  tip: "Serve at room temperature. Slice thin. Fan or fold on the board." },
  cheeses:    { unit: "oz", appetizer: 1.5, main: 3,  grazing: 4,  tip: "Pull from fridge 30–45 min before serving. Offer a mix of soft, semi-firm, and aged." },
  fruits:     { unit: "oz", appetizer: 2,   main: 3,  grazing: 4,  tip: "Mix fresh and dried. Fresh figs and grapes add visual height." },
  crackers:   { unit: "pieces", appetizer: 4, main: 10, grazing: 14, tip: "Offer at least two textures — one neutral, one seeded or spiced." },
  breads:     { unit: "pieces", appetizer: 2, main: 4,  grazing: 6,  tip: "Warm pita just before serving. Slice baguette at an angle." },
  nuts:       { unit: "oz", appetizer: 0.5, main: 1.5, grazing: 2,  tip: "Use as gap-fillers and height builders. Roast if unroasted." },
  spreads:    { unit: "tbsp", appetizer: 1, main: 2,  grazing: 3,  tip: "Serve in small ramekins. Label unfamiliar ones for guests." },
  pickles:    { unit: "oz", appetizer: 0.75, main: 1.5, grazing: 2, tip: "Drain well before plating. Pickled turnips add striking color." },
  vegetables: { unit: "oz", appetizer: 1.5, main: 3,  grazing: 4,  tip: "Keep raw veg cold until serving. Use as color breaks near dips." },
  extras:     { unit: "tbsp", appetizer: 0.5, main: 1, grazing: 2, tip: "Honey and jams go near cheese. Za'atar and sumac go near bread and labneh." },
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
// f: family key from FAMILIES
// p: "C" | "S" | "E" — board profile
// ============================================================

const ITEMS = {

  meats: [
    { name: "Smoked turkey breast",                          store: ["CM"],            themes: ["american","levantine","gulf"],                                                    p: "C", f: "deli_meat" },
    { name: "Roast beef, thinly sliced",                     store: ["CM"],            themes: ["american","levantine","gulf"],                                                    p: "C", f: "deli_meat" },
    { name: "Smoked chicken breast",                         store: ["CM"],            themes: ["american","levantine","gulf"],                                                    p: "C", f: "deli_meat" },
    { name: "Corned beef",                                   store: ["CM"],            themes: ["american","levantine","gulf"],                                                    p: "C", f: "deli_meat" },
    { name: "Beef mortadella, sliced",                       store: ["CM","SM","AG"],  themes: ["levantine","gulf","turkish","northafrican","persian","italian","mediterranean","armenian","egyptian"], p: "C", f: "mortadella" },
    { name: "Poultry mortadella, sliced",                    store: ["SM","AG"],       themes: ["levantine","gulf","turkish","northafrican","persian","egyptian"],                 p: "C", f: "mortadella" },
    { name: "Beef bologna, sliced",                          store: ["CM","SM","AG"],  themes: ["levantine","gulf","turkish","american","egyptian"],                               p: "C", f: "deli_meat" },
    { name: "Beef pastrami, sliced",                         store: ["CM","SM","AG"],  themes: ["levantine","gulf","american","armenian","egyptian"],                              p: "C", f: "cured_meat" },
    { name: "Beef sujuk, dry-cured, sliced",                 store: ["SM","AG"],       themes: ["turkish","levantine","gulf","armenian"],                                          p: "C", f: "cured_meat" },
    { name: "Beef salami",                                   store: ["CM","SM","AG"],  themes: ["italian","mediterranean","levantine","gulf","armenian"],                          p: "S", f: "cured_meat" },
    { name: "Beef pepperoni",                                store: ["CM","SM"],       themes: ["italian","mediterranean","american"],                                             p: "S", f: "cured_meat" },
    { name: "Beef basturma, sliced",                         store: ["SM","AG"],       themes: ["turkish","levantine","gulf","persian","armenian"],                                p: "S", f: "cured_meat" },
    { name: "Beef bresaola (Italian air-dried beef)",        store: ["CM"],            themes: ["italian","mediterranean"],                                                        p: "S", f: "cured_meat" },
    { name: "Smoked duck breast",                            store: ["CM"],            themes: ["french","mediterranean"],                                                         p: "E", f: "deli_meat" },
    { name: "Duck rillettes (French shredded duck confit)",  store: ["CM"],            themes: ["french"],                                                                         p: "E", f: "deli_meat" },
    { name: "Chicken liver mousse",                          store: ["CM"],            themes: ["french"],                                                                         p: "E", f: "deli_meat" },
  ],

  cheeses: [
    { name: "Aged white cheddar",                            store: ["CM"],            themes: ["american"],                                                                       p: "C", f: "cheese_aged" },
    { name: "Pepper jack",                                   store: ["CM"],            themes: ["american","latin"],                                                               p: "C", f: "cheese_aged" },
    { name: "Colby jack",                                    store: ["CM"],            themes: ["american"],                                                                       p: "C", f: "cheese_aged" },
    { name: "Cream cheese block",                            store: ["CM"],            themes: ["american"],                                                                       p: "C", f: "cheese_fresh" },
    { name: "Feta (sheep's milk)",                           store: ["CM","SM"],       themes: ["greek","mediterranean","levantine","gulf","egyptian"],                            p: "C", f: "cheese_brined" },
    { name: "Labneh (strained yogurt cheese)",               store: ["SM","AG"],       themes: ["levantine","gulf","persian","northafrican","moroccan","armenian","egyptian"],     p: "C", f: "cheese_fresh" },
    { name: "Beyaz peynir (white cheese)",                   store: ["AG","SM"],       themes: ["turkish","levantine","gulf"],                                                     p: "C", f: "cheese_brined" },
    { name: "Halloumi (Cypriot firm grilling cheese)",       store: ["CM","SM"],       themes: ["greek","levantine","gulf"],                                                       p: "C", f: "cheese_brined" },
    { name: "Shanklish (aged labneh balls in za'atar)",      store: ["SM"],            themes: ["levantine","gulf"],                                                               p: "C", f: "cheese_aged" },
    { name: "Chechil (Armenian braided string cheese)",      store: ["SM","AG"],       themes: ["armenian","levantine","turkish"],                                                 p: "C", f: "cheese_brined" },
    { name: "Paneer, fresh cubed",                           store: ["CM"],            themes: ["indian"],                                                                         p: "C", f: "cheese_fresh" },
    { name: "Brie de Meaux",                                 store: ["CM"],            themes: ["french","mediterranean"],                                                         p: "S", f: "cheese_soft" },
    { name: "Camembert",                                     store: ["CM"],            themes: ["french"],                                                                         p: "S", f: "cheese_soft" },
    { name: "Manchego (6-month aged)",                       store: ["CM"],            themes: ["spanish","mediterranean"],                                                        p: "S", f: "cheese_aged" },
    { name: "Parmigiano Reggiano",                           store: ["CM"],            themes: ["italian","mediterranean"],                                                        p: "S", f: "cheese_aged" },
    { name: "Grana Padano",                                  store: ["CM"],            themes: ["italian","mediterranean"],                                                        p: "S", f: "cheese_aged" },
    { name: "Burrata",                                       store: ["CM"],            themes: ["italian","mediterranean"],                                                        p: "S", f: "cheese_fresh" },
    { name: "Smoked gouda",                                  store: ["CM"],            themes: ["american","mediterranean"],                                                       p: "S", f: "cheese_aged" },
    { name: "Whipped feta",                                  store: ["CM","SM"],       themes: ["greek","mediterranean","levantine","egyptian"],                                   p: "S", f: "cheese_fresh" },
    { name: "Akkawi (Levantine mild white cheese)",          store: ["SM"],            themes: ["levantine","gulf","egyptian"],                                                    p: "S", f: "cheese_brined" },
    { name: "Panir (fresh Persian cheese, similar to feta)", store: ["SM"],            themes: ["persian"],                                                                        p: "S", f: "cheese_fresh" },
    { name: "Queso fresco",                                  store: ["CM"],            themes: ["latin"],                                                                          p: "S", f: "cheese_fresh" },
    { name: "Chèvre (fresh goat cheese)",                    store: ["CM","SM"],       themes: ["french","mediterranean","moroccan"],                                              p: "S", f: "cheese_fresh" },
    { name: "Comté (French aged cow's milk)",                store: ["CM"],            themes: ["french"],                                                                         p: "S", f: "cheese_aged" },
    { name: "Roquefort",                                     store: ["CM"],            themes: ["french"],                                                                         p: "S", f: "cheese_aged" },
    { name: "Pecorino Romano",                               store: ["CM"],            themes: ["italian","mediterranean","greek"],                                                p: "S", f: "cheese_aged" },
    { name: "Asiago",                                        store: ["CM"],            themes: ["italian"],                                                                        p: "S", f: "cheese_aged" },
    { name: "Cotija, aged",                                  store: ["CM"],            themes: ["latin"],                                                                          p: "S", f: "cheese_aged" },
    { name: "Taleggio",                                      store: ["CM"],            themes: ["italian"],                                                                        p: "E", f: "cheese_soft" },
    { name: "Époisses (French washed-rind, pungent)",        store: ["CM"],            themes: ["french"],                                                                         p: "E", f: "cheese_soft" },
    { name: "Idiazábal (Spanish smoked sheep's milk)",       store: ["CM"],            themes: ["spanish"],                                                                        p: "E", f: "cheese_aged" },
    { name: "Mahón (Spanish cow's milk, semi-firm)",         store: ["CM"],            themes: ["spanish"],                                                                        p: "E", f: "cheese_aged" },
    { name: "Kasseri (Greek semi-hard sheep's milk)",        store: ["CM"],            themes: ["greek"],                                                                          p: "E", f: "cheese_aged" },
    { name: "Graviera (Greek aged cow's milk, nutty)",       store: ["CM"],            themes: ["greek"],                                                                          p: "E", f: "cheese_aged" },
    { name: "Kaşar peyniri (Turkish semi-hard yellow cheese)", store: ["AG"],          themes: ["turkish"],                                                                        p: "E", f: "cheese_aged" },
    { name: "Tulum peyniri (Turkish aged crumbly white cheese)", store: ["AG"],        themes: ["turkish"],                                                                        p: "E", f: "cheese_aged" },
    { name: "Nabulsi (Palestinian brined white cheese)",     store: ["SM"],            themes: ["levantine"],                                                                      p: "E", f: "cheese_brined" },
    { name: "Lighvan (Persian brined sheep's milk)",         store: ["SM"],            themes: ["persian","gulf"],                                                                 p: "E", f: "cheese_brined" },
    { name: "Rumi (Egyptian aged hard cheese)",              store: ["SM"],            themes: ["egyptian"],                                                                       p: "E", f: "cheese_aged" },
    { name: "Smen (aged Moroccan fermented butter)",         store: ["CM"],            themes: ["moroccan"],                                                                       p: "E", f: "cheese_aged" },
    { name: "Oaxacan string cheese",                         store: ["CM"],            themes: ["latin"],                                                                          p: "E", f: "cheese_brined" },
  ],

  fruits: [
    // Fresh — foundational
    { name: "Red & green grapes",                            store: ["CM","SM"],       themes: ["american","french","italian","mediterranean","spanish","greek","armenian"],       p: "C", f: "fresh_fruit" },
    { name: "Sliced strawberries",                           store: ["CM","SM"],       themes: ["american","french"],                                                              p: "C", f: "fresh_fruit" },
    { name: "Sliced Honeycrisp apple",                       store: ["CM"],            themes: ["american","french"],                                                              p: "C", f: "fresh_fruit" },
    { name: "Sliced Bosc pear",                              store: ["CM"],            themes: ["american","french","italian"],                                                    p: "C", f: "fresh_fruit" },
    { name: "Blackberries",                                  store: ["CM"],            themes: ["american","french"],                                                              p: "C", f: "fresh_fruit" },
    { name: "Blueberries",                                   store: ["CM"],            themes: ["american"],                                                                       p: "C", f: "fresh_fruit" },
    { name: "Pomegranate arils",                             store: ["CM","SM"],       themes: ["persian","levantine","gulf","northafrican","greek","armenian","moroccan"],        p: "C", f: "fresh_fruit" },
    { name: "Sliced mango",                                  store: ["CM","SM"],       themes: ["latin","indian"],                                                                 p: "C", f: "fresh_fruit" },
    { name: "Sliced papaya",                                 store: ["CM"],            themes: ["latin"],                                                                          p: "S", f: "fresh_fruit" },
    // Dates — exclusive family
    { name: "Medjool dates",                                 store: ["SM","AG"],       themes: ["levantine","gulf","persian","moroccan","northafrican","mediterranean","armenian","egyptian"], p: "C", f: "date" },
    { name: "Ajwa dates (Saudi, dark & earthy)",             store: ["SM","AG"],       themes: ["gulf","levantine","persian"],                                                     p: "S", f: "date" },
    { name: "Barhi dates (Iraqi, butterscotch-sweet)",       store: ["SM","AG"],       themes: ["gulf","levantine"],                                                               p: "S", f: "date" },
    { name: "Deglet Noor dates (North African, firm & nutty)", store: ["CM","SM"],     themes: ["northafrican","moroccan","mediterranean"],                                        p: "C", f: "date" },
    // Figs — exclusive
    { name: "Fresh figs, halved",                            store: ["CM","SM"],       themes: ["mediterranean","french","italian","greek","levantine","moroccan"],                p: "S", f: "fig" },
    { name: "Dried Calimyrna figs",                          store: ["CM","SM"],       themes: ["mediterranean","turkish","persian","levantine","armenian"],                       p: "S", f: "fig" },
    // Dried fruits — foundational (variety is good)
    { name: "Dried apricots",                                store: ["CM","SM","AG"],  themes: ["turkish","persian","gulf","mediterranean","armenian","moroccan"],                 p: "C", f: "dried_fruit" },
    { name: "Dried sour cherries",                           store: ["CM","AG"],       themes: ["turkish","persian","mediterranean","armenian"],                                   p: "S", f: "dried_fruit" },
    { name: "Golden raisins",                                store: ["CM","AG"],       themes: ["northafrican","persian","mediterranean","moroccan"],                              p: "S", f: "dried_fruit" },
    { name: "Dried mandarin slices",                         store: ["CM","AG"],       themes: ["mediterranean","turkish","persian","northafrican","moroccan"],                    p: "S", f: "dried_fruit" },
    // Fruit pastes / leathers — exclusive
    { name: "Guava paste slices",                            store: ["CM"],            themes: ["latin"],                                                                          p: "S", f: "fruit_leather" },
    { name: "Lavashak (Persian fruit leather)",              store: ["SM"],            themes: ["persian"],                                                                        p: "E", f: "fruit_leather" },
    // Explorer
    { name: "Aloo bokhara (dried Persian plums)",            store: ["SM"],            themes: ["persian","gulf"],                                                                 p: "E", f: "dried_fruit" },
    { name: "Zereshk (dried barberries)",                    store: ["SM"],            themes: ["persian"],                                                                        p: "E", f: "dried_fruit" },
  ],

  crackers: [
    { name: "Water crackers",                                store: ["CM"],            themes: ["american","french","italian"],                                                    p: "C", f: "cracker" },
    { name: "Multigrain crackers",                           store: ["CM"],            themes: ["american","mediterranean"],                                                       p: "C", f: "cracker" },
    { name: "Sesame seed crackers",                          store: ["CM","SM"],       themes: ["mediterranean","greek","levantine","gulf","egyptian"],                            p: "C", f: "cracker" },
    { name: "Papadum (Indian crispy lentil crackers)",       store: ["CM"],            themes: ["indian"],                                                                         p: "C", f: "cracker" },
    { name: "Herb flatbread crackers",                       store: ["CM"],            themes: ["mediterranean","french","italian"],                                               p: "S", f: "cracker" },
    { name: "Olive oil crackers",                            store: ["CM"],            themes: ["italian","spanish","mediterranean","greek"],                                      p: "S", f: "cracker" },
    { name: "Raincoast crisps",                              store: ["CM"],            themes: ["american"],                                                                       p: "S", f: "cracker" },
    { name: "Seeded rye crispbread",                         store: ["CM"],            themes: ["french","american"],                                                              p: "S", f: "cracker" },
    { name: "Taralli (Italian ring crackers)",               store: ["CM"],            themes: ["italian"],                                                                        p: "E", f: "cracker" },
  ],

  breads: [
    { name: "Fresh pita bread",                              store: ["SM"],            themes: ["levantine","gulf","greek","mediterranean","egyptian"],                            p: "C", f: "flatbread" },
    { name: "Pita chips",                                    store: ["CM","SM"],       themes: ["greek","levantine","gulf","egyptian"],                                            p: "C", f: "cracker" },
    { name: "Sourdough slices, toasted",                     store: ["CM"],            themes: ["american","french"],                                                              p: "C", f: "flatbread" },
    { name: "Corn tortilla chips",                           store: ["CM"],            themes: ["latin"],                                                                          p: "C", f: "cracker" },
    { name: "Aish baladi (Egyptian whole wheat pita)",       store: ["SM","CM"],       themes: ["egyptian","levantine","gulf"],                                                    p: "C", f: "flatbread" },
    { name: "Naan, sliced",                                  store: ["CM"],            themes: ["indian"],                                                                         p: "C", f: "flatbread" },
    { name: "Baguette slices",                               store: ["CM"],            themes: ["french","mediterranean"],                                                         p: "S", f: "flatbread" },
    { name: "Crostini, toasted",                             store: ["CM"],            themes: ["italian","mediterranean","french"],                                               p: "S", f: "flatbread" },
    { name: "Focaccia, sliced",                              store: ["CM"],            themes: ["italian","mediterranean"],                                                        p: "S", f: "flatbread" },
    { name: "Lavash (Armenian/Persian thin flatbread)",      store: ["AG","SM"],       themes: ["turkish","persian","levantine","gulf","armenian"],                                p: "S", f: "flatbread" },
    { name: "Pide (Turkish flatbread)",                      store: ["AG"],            themes: ["turkish"],                                                                        p: "S", f: "flatbread" },
    { name: "Msemen (Moroccan layered flatbread)",           store: ["SM"],            themes: ["moroccan","northafrican"],                                                        p: "S", f: "flatbread" },
    { name: "Samoon (Iraqi diamond-shaped bread)",           store: ["SM","AG"],       themes: ["gulf","levantine"],                                                               p: "S", f: "flatbread" },
    { name: "Barbari (Persian sesame-topped flatbread)",     store: ["SM"],            themes: ["persian"],                                                                        p: "E", f: "flatbread" },
    { name: "Sangak (Persian stone-baked flatbread)",        store: ["SM"],            themes: ["persian"],                                                                        p: "E", f: "flatbread" },
    { name: "Markook (Levantine paper-thin flatbread)",      store: ["SM"],            themes: ["levantine","gulf"],                                                               p: "E", f: "flatbread" },
    { name: "Harcha (Moroccan semolina griddle bread)",      store: ["SM"],            themes: ["moroccan"],                                                                       p: "E", f: "flatbread" },
  ],

  nuts: [
    { name: "Pistachios, roasted",                           store: ["CM","SM","AG"],  themes: ["persian","levantine","gulf","mediterranean","armenian","moroccan"],               p: "C", f: "nut" },
    { name: "Roasted cashews",                               store: ["CM","SM","AG"],  themes: ["persian","levantine","gulf","mediterranean","indian"],                            p: "C", f: "nut" },
    { name: "Spiced pecans",                                 store: ["CM"],            themes: ["american"],                                                                       p: "C", f: "nut" },
    { name: "Candied walnuts",                               store: ["CM"],            themes: ["american","french"],                                                              p: "C", f: "nut" },
    { name: "Roasted chickpeas",                             store: ["SM","AG"],       themes: ["levantine","gulf","northafrican","moroccan","mediterranean","egyptian"],           p: "C", f: "nut" },
    { name: "Walnuts with honey",                            store: ["CM","SM"],       themes: ["greek","persian","mediterranean","armenian"],                                     p: "C", f: "nut" },
    { name: "Marcona almonds",                               store: ["CM"],            themes: ["spanish","mediterranean"],                                                        p: "S", f: "nut" },
    { name: "Spiced almonds",                                store: ["CM","SM"],       themes: ["northafrican","spanish","mediterranean","moroccan"],                              p: "S", f: "nut" },
    { name: "Pine nuts, toasted",                            store: ["CM","SM"],       themes: ["mediterranean","italian","levantine","gulf"],                                     p: "S", f: "nut" },
    { name: "Pepitas (pumpkin seeds)",                       store: ["CM"],            themes: ["latin"],                                                                          p: "S", f: "nut" },
    { name: "Cajun spiced cashews",                          store: ["CM"],            themes: ["american"],                                                                       p: "S", f: "nut" },
    { name: "Mixed nuts, za'atar spiced",                    store: ["SM"],            themes: ["levantine","gulf"],                                                               p: "S", f: "nut" },
    { name: "Masala spiced nuts",                            store: ["CM"],            themes: ["indian"],                                                                         p: "S", f: "nut" },
    { name: "Khaleeji nuts (cardamom & saffron spiced)",     store: ["AG","SM"],       themes: ["gulf"],                                                                           p: "S", f: "nut" },
    { name: "Turkish hazelnuts",                             store: ["AG"],            themes: ["turkish","mediterranean"],                                                        p: "E", f: "nut" },
    { name: "Tokhme (Persian roasted watermelon seeds)",     store: ["SM","AG"],       themes: ["persian","gulf"],                                                                 p: "E", f: "nut" },
  ],

  spreads: [
    // Honey — exclusive
    { name: "Wildflower honey",                              store: ["CM"],            themes: ["american","french","mediterranean"],                                              p: "C", f: "honey" },
    { name: "Truffle honey",                                 store: ["CM"],            themes: ["italian","french"],                                                               p: "S", f: "honey" },
    { name: "Saffron honey",                                 store: ["SM"],            themes: ["persian","gulf","northafrican","moroccan","mediterranean"],                       p: "E", f: "honey" },
    // Legume dips — exclusive
    { name: "Hummus",                                        store: ["SM","CM"],       themes: ["levantine","gulf","greek","mediterranean","egyptian"],                            p: "C", f: "legume_dip" },
    { name: "Bissara (Egyptian fava bean dip)",              store: ["SM"],            themes: ["egyptian","moroccan","northafrican"],                                             p: "S", f: "legume_dip" },
    // Eggplant dips — exclusive
    { name: "Baba ghanoush (smoky eggplant dip)",            store: ["SM"],            themes: ["levantine","gulf","mediterranean","egyptian"],                                    p: "C", f: "eggplant_dip" },
    { name: "Mutabal (smoky eggplant & tahini dip)",         store: ["SM"],            themes: ["levantine","gulf"],                                                               p: "S", f: "eggplant_dip" },
    { name: "Zaalouk (Moroccan eggplant-tomato dip)",        store: ["SM","CM"],       themes: ["moroccan","northafrican"],                                                        p: "S", f: "eggplant_dip" },
    // Yogurt dips — exclusive
    { name: "Labneh with za'atar",                           store: ["SM"],            themes: ["levantine","gulf","armenian"],                                                    p: "C", f: "yogurt_dip" },
    { name: "Tzatziki",                                      store: ["CM","SM"],       themes: ["greek","mediterranean"],                                                          p: "S", f: "yogurt_dip" },
    { name: "Mast-o-khiar (yogurt-cucumber dip)",            store: ["SM"],            themes: ["persian","gulf"],                                                                 p: "S", f: "yogurt_dip" },
    { name: "Haydari (yogurt-herb dip)",                     store: ["AG","SM"],       themes: ["turkish"],                                                                        p: "E", f: "yogurt_dip" },
    { name: "Kashk (fermented whey dip)",                    store: ["SM"],            themes: ["persian"],                                                                        p: "E", f: "yogurt_dip" },
    // Pepper spreads — exclusive
    { name: "Harissa (North African chili paste)",           store: ["CM","SM"],       themes: ["northafrican","moroccan","mediterranean"],                                        p: "S", f: "pepper_spread" },
    { name: "Muhammara (red pepper-walnut dip)",             store: ["SM"],            themes: ["levantine","gulf","turkish","armenian"],                                          p: "S", f: "pepper_spread" },
    { name: "Biber salçası (pepper paste)",                  store: ["AG"],            themes: ["turkish","gulf"],                                                                 p: "E", f: "pepper_spread" },
    { name: "Romesco (Spanish roasted red pepper & almond sauce)", store: ["CM"],      themes: ["spanish","mediterranean"],                                                        p: "E", f: "pepper_spread" },
    // Garlic dips — exclusive
    { name: "Toum (garlic cream)",                           store: ["SM"],            themes: ["levantine","gulf"],                                                               p: "S", f: "garlic_dip" },
    { name: "Skordalia (garlic dip)",                        store: ["CM"],            themes: ["greek"],                                                                          p: "E", f: "garlic_dip" },
    // Jams/preserves — exclusive
    { name: "Fig jam",                                       store: ["CM"],            themes: ["french","italian","mediterranean","spanish"],                                     p: "S", f: "jam" },
    { name: "Apricot preserves",                             store: ["CM"],            themes: ["french","mediterranean","moroccan"],                                              p: "S", f: "jam" },
    { name: "Pepper jelly",                                  store: ["CM"],            themes: ["american"],                                                                       p: "C", f: "jam" },
    { name: "Apple butter",                                  store: ["CM"],            themes: ["american"],                                                                       p: "C", f: "jam" },
    // Chutneys — exclusive
    { name: "Mango chutney",                                 store: ["CM"],            themes: ["indian"],                                                                         p: "C", f: "chutney" },
    { name: "Mint-cilantro chutney",                         store: ["CM"],            themes: ["indian"],                                                                         p: "C", f: "chutney" },
    { name: "Tamarind-date chutney",                         store: ["CM"],            themes: ["indian"],                                                                         p: "S", f: "chutney" },
    // Nut spreads — exclusive
    { name: "Amlou (Moroccan almond-argan spread)",          store: ["CM"],            themes: ["moroccan"],                                                                       p: "S", f: "pepper_spread" },
    // Other spreads — foundational
    { name: "Tahini",                                        store: ["SM","AG","CM"],  themes: ["levantine","gulf","greek","northafrican","persian","moroccan","egyptian"],        p: "C", f: "legume_dip" },
    { name: "Guacamole",                                     store: ["CM"],            themes: ["latin"],                                                                          p: "C", f: "eggplant_dip" },
    { name: "Whole-grain mustard",                           store: ["CM"],            themes: ["american","french"],                                                              p: "C", f: "jam" },
    { name: "Pesto",                                         store: ["CM"],            themes: ["italian"],                                                                        p: "S", f: "jam" },
    { name: "Tapenade (olive spread)",                       store: ["CM","SM"],       themes: ["french","mediterranean","greek"],                                                 p: "S", f: "olive" },
    { name: "Pomegranate molasses",                          store: ["SM","AG"],       themes: ["levantine","gulf","persian","northafrican","moroccan","armenian"],                p: "S", f: "jam" },
    { name: "Sun-dried tomato spread",                       store: ["CM"],            themes: ["italian","mediterranean"],                                                        p: "S", f: "jam" },
    { name: "Argan oil for dipping",                         store: ["CM"],            themes: ["moroccan"],                                                                       p: "S", f: "honey" },
    { name: "Salsa verde",                                   store: ["CM"],            themes: ["latin"],                                                                          p: "S", f: "pepper_spread" },
    { name: "Olive oil + za'atar for dipping",               store: ["SM","AG"],       themes: ["levantine","gulf","mediterranean","greek"],                                       p: "S", f: "honey" },
    { name: "Date molasses",                                 store: ["SM","AG"],       themes: ["persian","gulf","northafrican"],                                                  p: "S", f: "honey" },
    { name: "Membrillo (quince paste)",                      store: ["CM"],            themes: ["spanish","mediterranean"],                                                        p: "S", f: "jam" },
    { name: "Chermoula (North African herb & spice sauce)",  store: ["SM"],            themes: ["northafrican","moroccan"],                                                        p: "E", f: "pepper_spread" },
  ],

  pickles: [
    // Olives — foundational (variety welcome)
    { name: "Kalamata olives",                               store: ["CM","SM"],       themes: ["greek","mediterranean"],                                                          p: "C", f: "olive" },
    { name: "Mixed marinated olives",                        store: ["CM","SM"],       themes: ["mediterranean","spanish","french","moroccan"],                                    p: "C", f: "olive" },
    { name: "Castelvetrano olives (Sicilian mild green)",    store: ["CM"],            themes: ["italian","mediterranean"],                                                        p: "S", f: "olive" },
    { name: "Cerignola olives (Southern Italian large)",     store: ["CM"],            themes: ["italian","mediterranean"],                                                        p: "S", f: "olive" },
    { name: "Manzanilla olives, stuffed",                    store: ["CM"],            themes: ["spanish"],                                                                        p: "S", f: "olive" },
    { name: "Souri/Syrian olives (Levantine oil-cured)",     store: ["SM"],            themes: ["levantine","gulf","mediterranean"],                                               p: "C", f: "olive" },
    { name: "Moroccan oil-cured olives (wrinkled, dry-cured)", store: ["SM"],          themes: ["moroccan","northafrican","mediterranean"],                                        p: "S", f: "olive" },
    { name: "Nabali olives (Palestinian green)",             store: ["SM"],            themes: ["levantine","gulf"],                                                               p: "S", f: "olive" },
    // Pickled veg — exclusive (one style per board)
    { name: "Pickled turnips (pink)",                        store: ["SM","AG"],       themes: ["levantine","gulf","turkish","armenian","egyptian"],                               p: "C", f: "pickled_veg" },
    { name: "Pickled cucumbers, Middle Eastern style",       store: ["SM"],            themes: ["levantine","gulf","egyptian"],                                                    p: "C", f: "pickled_veg" },
    { name: "Pickled jalapeños",                             store: ["CM"],            themes: ["latin","american"],                                                               p: "C", f: "pickled_veg" },
    { name: "Bread & butter pickles",                        store: ["CM"],            themes: ["american"],                                                                       p: "C", f: "pickled_veg" },
    { name: "Pickled banana peppers",                        store: ["CM"],            themes: ["italian","american"],                                                             p: "S", f: "pickled_veg" },
    { name: "Cornichons (French tiny pickled gherkins)",     store: ["CM"],            themes: ["french","american"],                                                              p: "S", f: "pickled_veg" },
    { name: "Turşu (Turkish mixed pickled vegetables)",      store: ["AG"],            themes: ["turkish","gulf"],                                                                 p: "E", f: "pickled_veg" },
    { name: "Torshi (Persian mixed pickles)",                store: ["SM"],            themes: ["persian","gulf","armenian"],                                                      p: "E", f: "pickled_veg" },
    // Marinated veg — exclusive
    { name: "Marinated artichoke hearts",                    store: ["CM"],            themes: ["italian","mediterranean","greek"],                                                p: "S", f: "marinated_veg" },
    { name: "Roasted red peppers",                           store: ["CM"],            themes: ["mediterranean","spanish","italian","moroccan"],                                   p: "S", f: "marinated_veg" },
    { name: "Sun-dried tomatoes in oil",                     store: ["CM"],            themes: ["italian","mediterranean"],                                                        p: "S", f: "marinated_veg" },
    { name: "Marinated mushrooms",                           store: ["CM"],            themes: ["italian","french","mediterranean"],                                               p: "E", f: "marinated_veg" },
    // Other pickled
    { name: "Pickled garlic",                                store: ["SM","AG","CM"],  themes: ["levantine","gulf","persian","mediterranean","armenian"],                          p: "C", f: "pickled_veg" },
    { name: "Pickled grape leaves",                          store: ["SM","AG"],       themes: ["greek","turkish","levantine","gulf","armenian"],                                  p: "S", f: "marinated_veg" },
    { name: "Preserved lemons",                              store: ["SM","CM"],       themes: ["northafrican","persian","mediterranean","moroccan"],                              p: "S", f: "marinated_veg" },
    { name: "Peppadew peppers (South African sweet-hot)",    store: ["CM"],            themes: ["mediterranean","american"],                                                       p: "S", f: "pickled_veg" },
    { name: "Pickled mango (aam ka achar)",                  store: ["CM"],            themes: ["indian"],                                                                         p: "S", f: "pickled_veg" },
  ],

  vegetables: [
    { name: "Cherry tomatoes",                               store: ["CM","SM"],       themes: ["italian","mediterranean","greek","levantine","gulf"],                             p: "C", f: "fresh_veg" },
    { name: "Carrot sticks",                                 store: ["CM","SM"],       themes: ["american","french","mediterranean"],                                              p: "C", f: "fresh_veg" },
    { name: "Celery sticks",                                 store: ["CM"],            themes: ["american","french"],                                                              p: "C", f: "fresh_veg" },
    { name: "Cucumber spears",                               store: ["CM"],            themes: ["american","greek","mediterranean"],                                               p: "C", f: "fresh_veg" },
    { name: "Bell pepper strips",                            store: ["CM","SM"],       themes: ["american","latin","mediterranean","indian"],                                      p: "C", f: "fresh_veg" },
    { name: "Persian cucumbers, sliced",                     store: ["CM","SM"],       themes: ["persian","levantine","gulf","greek","mediterranean"],                             p: "C", f: "fresh_veg" },
    { name: "Radishes, trimmed",                             store: ["CM","SM"],       themes: ["french","persian","levantine","gulf","mediterranean","moroccan"],                 p: "C", f: "fresh_veg" },
    { name: "Snap peas",                                     store: ["CM"],            themes: ["american","french"],                                                              p: "C", f: "fresh_veg" },
    { name: "Broccoli florets",                              store: ["CM"],            themes: ["american","italian"],                                                             p: "C", f: "fresh_veg" },
    { name: "Cauliflower florets",                           store: ["CM"],            themes: ["american","mediterranean","levantine","gulf","indian"],                           p: "C", f: "fresh_veg" },
    { name: "Green onions / scallions",                      store: ["CM","SM"],       themes: ["persian","levantine","gulf","american","armenian"],                               p: "C", f: "fresh_veg" },
    // Fresh herbs — foundational (variety welcome)
    { name: "Fresh mint sprigs",                             store: ["CM","SM"],       themes: ["persian","levantine","gulf","greek","northafrican","moroccan","armenian"],        p: "C", f: "fresh_herb" },
    { name: "Fresh basil leaves",                            store: ["CM"],            themes: ["italian","mediterranean","persian"],                                              p: "S", f: "fresh_herb" },
    { name: "Fresh dill",                                    store: ["CM","SM"],       themes: ["persian","greek","levantine","armenian"],                                         p: "S", f: "fresh_herb" },
    { name: "Fresh tarragon",                                store: ["CM","SM"],       themes: ["persian","french","armenian"],                                                    p: "E", f: "fresh_herb" },
    { name: "Endive leaves",                                 store: ["CM"],            themes: ["french","italian"],                                                               p: "E", f: "fresh_veg" },
  ],

  extras: [
    // Honey — exclusive
    { name: "Local Texas wildflower honey",                  store: ["CM"],            themes: ["american"],                                                                       p: "C", f: "honey" },
    // Spice blends — foundational (different blends complement each other)
    { name: "Za'atar (Middle Eastern herb & sesame blend)",  store: ["SM","AG"],       themes: ["levantine","gulf","turkish","armenian","egyptian"],                               p: "C", f: "spice_blend" },
    { name: "Sumac (tart red berry spice, lemony flavor)",   store: ["SM","AG"],       themes: ["levantine","gulf","persian","turkish","armenian"],                                p: "C", f: "spice_blend" },
    { name: "Dukkah (Egyptian nut & spice blend)",           store: ["CM"],            themes: ["egyptian","moroccan","mediterranean"],                                            p: "S", f: "spice_blend" },
    { name: "Aleppo pepper flakes",                          store: ["SM","AG"],       themes: ["armenian","levantine","turkish"],                                                 p: "S", f: "spice_blend" },
    // Sweets — foundational (different sweets can coexist)
    { name: "Dolma (grape leaves stuffed with rice & herbs)", store: ["SM","AG"],      themes: ["greek","turkish","levantine","gulf","armenian"],                                  p: "C", f: "sweet" },
    { name: "Baklava pieces",                                store: ["SM","AG"],       themes: ["turkish","greek","levantine","gulf","armenian"],                                  p: "C", f: "sweet" },
    { name: "Dried cranberries",                             store: ["CM"],            themes: ["american"],                                                                       p: "C", f: "dried_fruit" },
    { name: "Roasted garlic cloves",                         store: ["CM"],            themes: ["italian","mediterranean","french"],                                               p: "S", f: "fresh_veg" },
    { name: "Caperberries (large Mediterranean caper buds)", store: ["CM"],            themes: ["italian","mediterranean","spanish"],                                              p: "S", f: "pickled_veg" },
    // Halva — exclusive
    { name: "Sesame halva (Middle Eastern sesame candy)",    store: ["SM","AG"],       themes: ["levantine","gulf","greek","egyptian"],                                            p: "S", f: "halva" },
    { name: "Omani halwa (Gulf saffron & cardamom sweet)",   store: ["AG"],            themes: ["gulf"],                                                                           p: "E", f: "halva" },
    // Other sweets
    { name: "Lokum (Turkish delight)",                       store: ["AG"],            themes: ["turkish","gulf"],                                                                 p: "S", f: "sweet" },
    { name: "Marcona almonds, rosemary",                     store: ["CM"],            themes: ["spanish","mediterranean"],                                                        p: "S", f: "nut" },
    { name: "Dulce de leche (Latin caramel milk spread)",    store: ["CM"],            themes: ["latin"],                                                                          p: "S", f: "jam" },
    { name: "Luqaimat (Gulf sweet dumplings, date syrup)",   store: ["AG"],            themes: ["gulf"],                                                                           p: "E", f: "sweet" },
    { name: "Rose water candies",                            store: ["SM","AG"],       themes: ["persian","gulf"],                                                                 p: "E", f: "sweet" },
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

// Smart roll — respects exclusive family constraints on initial roll
function rollBoard(selectedThemeIds, boardSize, boardProfile) {
  const n = BOARD_SIZES[boardSize].itemsPerCategory;
  const result = {};

  for (const category of Object.keys(ITEMS)) {
    const eligible = getEligibleItems(category, selectedThemeIds, boardProfile)
      .filter(item => item.f); // must have family tag

    if (eligible.length === 0) { result[category] = []; continue; }

    // Separate exclusive vs foundational items
    const exclusive   = eligible.filter(i => FAMILIES[i.f]?.type === 'exclusive');
    const foundational = eligible.filter(i => FAMILIES[i.f]?.type === 'foundational');

    // Shuffle both pools
    const shuffledEx  = [...exclusive].sort(() => Math.random() - 0.5);
    const shuffledFnd = [...foundational].sort(() => Math.random() - 0.5);

    const selected = [];
    const usedFamilies = new Set();

    // First pass — pick exclusive items (one per family)
    for (const item of shuffledEx) {
      if (selected.length >= n) break;
      if (!usedFamilies.has(item.f)) {
        selected.push(item);
        usedFamilies.add(item.f);
      }
    }

    // Second pass — fill remaining slots with foundational items
    for (const item of shuffledFnd) {
      if (selected.length >= n) break;
      selected.push(item);
    }

    result[category] = selected;
  }

  return result;
}

// Surprise Me — pick compatible themes, avoid all clashes
function surpriseThemes() {
  const allIds = THEMES.map(t => t.id);

  // Pick a random affinity group and select 1-3 themes from it
  const affinityGroup = THEME_AFFINITIES[Math.floor(Math.random() * THEME_AFFINITIES.length)];
  const shuffled = [...affinityGroup].sort(() => Math.random() - 0.5);

  // Pick 1 to 3 themes from the affinity group
  const count = Math.floor(Math.random() * 2) + 1; // 1 or 2
  const chosen = shuffled.slice(0, count);

  // Verify no clashes (shouldn't happen with affinities but safety check)
  const clashes = themesClash(chosen);
  if (clashes.length > 0) return [shuffled[0]]; // fallback to single theme

  return chosen;
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
