// ============================================================
// CHARCUTERIE RANDOMIZER — DATA MODEL
// All items are pork-free by design.
// Stores: CM = Central Market, SM = Sara's Mediterranean, AG = Altin Grocery
// Themes: american, latin, mediterranean, french, italian, spanish,
//         greek, turkish, middleeastern, northafrican, persian, levantine
// ============================================================

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

// Theme compatibility matrix.
// Pairs listed here trigger a warning in the UI.
// Logic: geographic/culinary distance is too large for a coherent board.
const THEME_CLASHES = [
  ["american", "middleeastern"],
  ["american", "persian"],
  ["american", "levantine"],
  ["american", "northafrican"],
  ["american", "turkish"],
  ["latin",    "northafrican"],
  ["latin",    "persian"],
  ["latin",    "middleeastern"],
  ["latin",    "levantine"],
  ["latin",    "turkish"],
  ["french",   "middleeastern"],
  ["french",   "persian"],
  ["french",   "northafrican"],
];

// Natural pairings — shown as a soft suggestion (optional, informational only)
const THEME_AFFINITIES = [
  ["mediterranean", "greek", "italian"],
  ["middleeastern", "levantine", "northafrican", "turkish"],
  ["french", "italian", "spanish"],
  ["persian", "levantine", "middleeastern"],
  ["turkish", "greek", "middleeastern"],
];

// Board size → items per category
const BOARD_SIZES = {
  S: { label: "Small",  description: "1–2 people",  itemsPerCategory: 1 },
  M: { label: "Medium", description: "3–5 people",  itemsPerCategory: 2 },
  L: { label: "Large",  description: "6–10 people", itemsPerCategory: 4 },
};

// Meal role modes — drives all serving quantity math
const MEAL_ROLES = {
  appetizer: {
    label: "Appetizer",
    description: "Light — before a meal",
    icon: "🥂",
  },
  main: {
    label: "Main Course",
    description: "This is the meal",
    icon: "🍽️",
  },
  grazing: {
    label: "Grazing Table",
    description: "Extended gathering, people return",
    icon: "🎉",
  },
};

// Serving guidance per category, per person, per meal role
// Quantities are per person. When multiple items share a category,
// divide total by item count to get per-item quantity.
// unit: "oz" | "pieces" | "tbsp"
const SERVING_GUIDANCE = {
  meats: {
    unit: "oz",
    appetizer: 1.5,
    main:       4,
    grazing:    6,
    tip: "Serve at room temperature. Slice thin. Fan or fold on the board.",
  },
  cheeses: {
    unit: "oz",
    appetizer: 1.5,
    main:       3,
    grazing:    4,
    tip: "Pull from fridge 30–45 min before serving. Offer a mix of soft, semi-firm, and aged.",
  },
  fruits: {
    unit: "oz",
    appetizer: 2,
    main:       3,
    grazing:    4,
    tip: "Mix fresh and dried. Fresh figs and grapes add visual height.",
  },
  crackers: {
    unit: "pieces",
    appetizer: 4,
    main:       10,
    grazing:    14,
    tip: "Offer at least two textures — one neutral, one seeded or spiced.",
  },
  breads: {
    unit: "pieces",
    appetizer: 2,
    main:       4,
    grazing:    6,
    tip: "Warm pita just before serving. Slice baguette at an angle.",
  },
  nuts: {
    unit: "oz",
    appetizer: 0.5,
    main:       1.5,
    grazing:    2,
    tip: "Use as gap-fillers and height builders on the board. Roast if unroasted.",
  },
  spreads: {
    unit: "tbsp",
    appetizer: 1,
    main:       2,
    grazing:    3,
    tip: "Serve in small bowls or ramekins. Label unfamiliar ones (harissa, muhammara).",
  },
  pickles: {
    unit: "oz",
    appetizer: 0.75,
    main:       1.5,
    grazing:    2,
    tip: "Drain well before plating. Pickled turnips add striking color.",
  },
  extras: {
    unit: "tbsp",
    appetizer: 0.5,
    main:       1,
    grazing:    2,
    tip: "Honey and jams go near cheese. Za'atar and sumac go near bread and labneh.",
  },
  vegetables: {
    unit: "oz",
    appetizer: 1.5,
    main:       3,
    grazing:    4,
    tip: "Keep raw veg cold until serving. Use as visual color breaks on the board. Serve near dips.",
  },
};

// ============================================================
// BOARD SUPPLIES CHECKLIST
// Printed on the shopping list — not food items
// ============================================================
const BOARD_SUPPLIES = [
  { item: "Wooden or slate serving board",    note: "Large enough for your board size" },
  { item: "Small ramekins or bowls (3-5)",    note: "For dips, spreads, honey, olives" },
  { item: "Cheese knives (2-3)",              note: "One per soft cheese, one for hard" },
  { item: "Small spreaders (2-3)",            note: "For labneh, hummus, butter" },
  { item: "Cocktail picks or toothpicks",     note: "For meats, olives, and small bites" },
  { item: "Small serving spoons",             note: "For dips and loose items like nuts" },
  { item: "Parchment or wax paper",           note: "For lining the board (optional)" },
  { item: "Labels or small cards",            note: "Name unfamiliar items for guests" },
];

// ============================================================
// HELPER: Calculate per-item quantity given headcount, meal role,
// category, and how many items are selected in that category.
// Returns { imperial: "3 oz", metric: "85 g" } or { imperial: "12 pieces", metric: null }
// ============================================================
function calcServing(category, mealRole, headCount, itemCount) {
  const g = SERVING_GUIDANCE[category];
  if (!g || itemCount === 0) return null;

  const totalPerPerson = g[mealRole];
  const total = totalPerPerson * headCount;
  const perItem = total / itemCount;
  const unit = g.unit;

  let imperial, metric;

  if (unit === "pieces") {
    const count = Math.max(1, Math.round(perItem));
    imperial = count + " " + (count === 1 ? "piece" : "pieces");
    metric = null;

  } else if (unit === "tbsp") {
    // 1 tbsp = 14.787 ml
    const roundedTbsp = Math.round(perItem * 2) / 2;
    if (roundedTbsp >= 16) {
      const cups = Math.round((roundedTbsp / 16) * 4) / 4;
      imperial = cups + (cups === 1 ? " cup" : " cups");
    } else {
      imperial = roundedTbsp + " tbsp";
    }
    const ml = Math.round(perItem * 14.787);
    if (ml >= 1000) {
      metric = (Math.round((ml / 1000) * 10) / 10) + " L";
    } else {
      metric = (Math.round(ml / 5) * 5) + " ml";
    }

  } else {
    // oz — 1 oz = 28.3495 g
    const roundedOz = Math.round(perItem * 2) / 2;
    if (roundedOz >= 16) {
      const lb = Math.round((roundedOz / 16) * 4) / 4;
      imperial = lb + (lb === 1 ? " lb" : " lbs");
    } else {
      imperial = roundedOz + " oz";
    }
    const grams = Math.round(perItem * 28.3495);
    if (grams >= 1000) {
      metric = (Math.round((grams / 1000) * 10) / 10) + " kg";
    } else {
      metric = (Math.round(grams / 5) * 5) + " g";
    }
  }

  return { imperial, metric };
}

// ============================================================
// ITEMS
// Each item: { name, store[], themes[], category, note? }
// store: "CM" | "SM" | "AG"
// All items are pork-free by design.
// ============================================================

const ITEMS = {

  // ----------------------------------------------------------
  meats: [
    // American
    { name: "Smoked turkey breast",           store: ["CM"],            themes: ["american"] },
    { name: "Roast beef, thinly sliced",      store: ["CM"],            themes: ["american"] },
    { name: "Smoked chicken breast",          store: ["CM"],            themes: ["american"] },
    { name: "Corned beef",                    store: ["CM"],            themes: ["american"] },

    // Latin
    { name: "Beef chorizo",                   store: ["CM"],            themes: ["latin", "spanish"] },
    { name: "Cured beef longaniza",           store: ["CM"],            themes: ["latin"] },

    // Italian / Mediterranean
    { name: "Beef bresaola",                  store: ["CM"],            themes: ["italian", "mediterranean"] },
    { name: "Turkey mortadella",              store: ["CM", "SM"],      themes: ["italian", "mediterranean"] },
    { name: "Beef salami",                    store: ["CM"],            themes: ["italian", "mediterranean"] },
    { name: "Halal beef pepperoni",           store: ["CM", "SM"],      themes: ["italian", "mediterranean"] },

    // Spanish
    { name: "Lomo embuchado (beef)",          store: ["CM"],            themes: ["spanish", "mediterranean"] },

    // Turkish
    { name: "Sucuk (beef sausage)",           store: ["AG", "SM"],      themes: ["turkish", "middleeastern"] },
    { name: "Turkish pastırma",               store: ["AG"],            themes: ["turkish", "middleeastern"] },
    { name: "Halal beef sujuk, sliced",       store: ["SM", "AG"],      themes: ["turkish", "middleeastern", "levantine"] },

    // Middle Eastern / Levantine
    { name: "Smoked beef basturma",           store: ["SM", "AG"],      themes: ["middleeastern", "levantine", "persian", "turkish"] },

    // Persian

    // North African

    // French
    { name: "Duck rillettes",                 store: ["CM"],            themes: ["french"] },
    { name: "Smoked duck breast",             store: ["CM"],            themes: ["french", "mediterranean"] },
    { name: "Chicken liver mousse",           store: ["CM"],            themes: ["french"] },

    // Greek
  ],

  // ----------------------------------------------------------
  cheeses: [
    // American
    { name: "Aged white cheddar",             store: ["CM"],            themes: ["american"] },
    { name: "Smoked gouda",                   store: ["CM"],            themes: ["american", "mediterranean"] },
    { name: "Pepper jack",                    store: ["CM"],            themes: ["american", "latin"] },
    { name: "Colby jack",                     store: ["CM"],            themes: ["american"] },
    { name: "Cream cheese block",             store: ["CM"],            themes: ["american"] },

    // French
    { name: "Brie de Meaux",                  store: ["CM"],            themes: ["french", "mediterranean"] },
    { name: "Camembert",                      store: ["CM"],            themes: ["french"] },
    { name: "Comté",                          store: ["CM"],            themes: ["french"] },
    { name: "Époisses",                       store: ["CM"],            themes: ["french"] },
    { name: "Chèvre (fresh goat cheese)",     store: ["CM", "SM"],      themes: ["french", "mediterranean"] },
    { name: "Roquefort",                      store: ["CM"],            themes: ["french"] },

    // Italian
    { name: "Parmigiano Reggiano",            store: ["CM"],            themes: ["italian", "mediterranean"] },
    { name: "Pecorino Romano",                store: ["CM"],            themes: ["italian", "mediterranean", "greek"] },
    { name: "Burrata",                        store: ["CM"],            themes: ["italian", "mediterranean"] },
    { name: "Taleggio",                       store: ["CM"],            themes: ["italian"] },
    { name: "Grana Padano",                   store: ["CM"],            themes: ["italian"] },
    { name: "Asiago",                         store: ["CM"],            themes: ["italian"] },

    // Spanish
    { name: "Manchego (6-month)",             store: ["CM"],            themes: ["spanish", "mediterranean"] },
    { name: "Mahón",                          store: ["CM"],            themes: ["spanish"] },
    { name: "Idiazábal",                      store: ["CM"],            themes: ["spanish"] },

    // Greek
    { name: "Feta (sheep's milk)",            store: ["CM", "SM"],      themes: ["greek", "mediterranean", "levantine", "middleeastern"] },
    { name: "Halloumi",                       store: ["CM", "SM"],      themes: ["greek", "levantine", "middleeastern"] },
    { name: "Kasseri",                        store: ["CM"],            themes: ["greek"] },
    { name: "Graviera",                       store: ["CM"],            themes: ["greek"] },
    { name: "Whipped feta",                   store: ["CM", "SM"],      themes: ["greek", "mediterranean", "levantine"] },

    // Turkish
    { name: "Beyaz peynir (white cheese)",    store: ["AG", "SM"],      themes: ["turkish", "middleeastern"] },
    { name: "Kaşar peyniri",                  store: ["AG"],            themes: ["turkish"] },
    { name: "Tulum peyniri",                  store: ["AG"],            themes: ["turkish"] },

    // Middle Eastern / Levantine
    { name: "Labneh (strained yogurt)",       store: ["SM", "AG"],      themes: ["middleeastern", "levantine", "persian", "northafrican"] },
    { name: "Akkawi cheese",                  store: ["SM"],            themes: ["levantine", "middleeastern"] },
    { name: "Nabulsi cheese",                 store: ["SM"],            themes: ["levantine"] },

    // Persian
    { name: "Lighvan cheese",                 store: ["SM"],            themes: ["persian", "middleeastern"] },
    { name: "Panir (fresh)",                  store: ["SM"],            themes: ["persian"] },

    // Latin
    { name: "Queso fresco",                   store: ["CM"],            themes: ["latin"] },
    { name: "Cotija, aged",                   store: ["CM"],            themes: ["latin"] },
    { name: "Oaxacan string cheese",          store: ["CM"],            themes: ["latin"] },
  ],

  // ----------------------------------------------------------
  fruits: [
    // Fresh — American / French / European
    { name: "Red & green grapes",             store: ["CM", "SM"],      themes: ["american", "french", "italian", "mediterranean", "spanish", "greek"] },
    { name: "Sliced strawberries",            store: ["CM", "SM"],      themes: ["american", "french"] },
    { name: "Sliced Honeycrisp apple",        store: ["CM"],            themes: ["american", "french"] },
    { name: "Sliced Bosc pear",               store: ["CM"],            themes: ["american", "french", "italian"] },
    { name: "Blackberries",                   store: ["CM"],            themes: ["american", "french"] },
    { name: "Blueberries",                    store: ["CM"],            themes: ["american"] },
    { name: "Fresh figs, halved",             store: ["CM", "SM"],      themes: ["mediterranean", "french", "italian", "greek", "levantine"] },
    { name: "Pomegranate arils",              store: ["CM", "SM"],      themes: ["persian", "levantine", "middleeastern", "northafrican", "greek"] },
    { name: "Sliced mango",                   store: ["CM", "SM"],      themes: ["latin"] },
    { name: "Sliced papaya",                  store: ["CM"],            themes: ["latin"] },

    // Dried fruits
    { name: "Dried Calimyrna figs",           store: ["CM", "SM"],      themes: ["mediterranean", "turkish", "persian", "levantine"] },
    { name: "Medjool dates",                  store: ["SM", "AG"],      themes: ["middleeastern", "levantine", "northafrican", "persian", "mediterranean"] },
    { name: "Dried apricots",                 store: ["CM", "SM", "AG"],themes: ["turkish", "persian", "middleeastern", "mediterranean"] },
    { name: "Dried sour cherries",            store: ["CM", "AG"],      themes: ["turkish", "persian", "mediterranean"] },
    { name: "Golden raisins",                 store: ["CM", "AG"],      themes: ["northafrican", "persian", "mediterranean"] },
    { name: "Dried mandarin slices",          store: ["CM", "AG"],      themes: ["mediterranean", "turkish", "persian", "northafrican"] },
    { name: "Aloo bokhara (dried Persian plums)", store: ["SM"],        themes: ["persian", "middleeastern"] },
    { name: "Lavashak (Persian fruit leather)",   store: ["SM"],        themes: ["persian"] },
    { name: "Dried barberries (zereshk)",     store: ["SM"],            themes: ["persian"] },

    // Pastes / preserved fruit
    { name: "Membrillo (quince paste)",       store: ["CM"],            themes: ["spanish", "mediterranean", "french"] },
    { name: "Guava paste slices",             store: ["CM"],            themes: ["latin"] },
  ],

  // ----------------------------------------------------------
  crackers: [
    { name: "Water crackers",                 store: ["CM"],            themes: ["american", "french", "italian"] },
    { name: "Raincoast crisps",               store: ["CM"],            themes: ["american"] },
    { name: "Prairie Harvest date crisps",    store: ["CM"],            themes: ["american", "mediterranean"] },
    { name: "Seeded rye crispbread",          store: ["CM"],            themes: ["french", "american"] },
    { name: "Herb flatbread crackers",        store: ["CM"],            themes: ["mediterranean", "french", "italian"] },
    { name: "Sesame seed crackers",           store: ["CM", "SM"],      themes: ["mediterranean", "greek", "middleeastern"] },
    { name: "Multigrain crackers",            store: ["CM"],            themes: ["american", "mediterranean"] },
    { name: "Olive oil crackers",             store: ["CM"],            themes: ["italian", "spanish", "mediterranean", "greek"] },
    { name: "Taralli (Italian ring crackers)",store: ["CM"],            themes: ["italian"] },
    { name: "Paprika-spiced crackers",        store: ["CM"],            themes: ["spanish", "latin"] },
  ],

  // ----------------------------------------------------------
  breads: [
    { name: "Crostini, toasted",              store: ["CM"],            themes: ["italian", "mediterranean", "french"] },
    { name: "Sourdough slices, toasted",      store: ["CM"],            themes: ["american", "french"] },
    { name: "Baguette slices",                store: ["CM"],            themes: ["french", "mediterranean"] },
    { name: "Focaccia, sliced",               store: ["CM"],            themes: ["italian", "mediterranean"] },
    { name: "Fresh pita bread",               store: ["SM"],            themes: ["middleeastern", "levantine", "greek", "mediterranean"] },
    { name: "Pita chips",                     store: ["CM", "SM"],      themes: ["greek", "middleeastern", "levantine"] },
    { name: "Lavash crackers",                store: ["AG", "SM"],      themes: ["turkish", "persian", "levantine", "middleeastern"] },
    { name: "Sangak bread, sliced",           store: ["SM"],            themes: ["persian"] },
    { name: "Markook (flatbread)",            store: ["SM"],            themes: ["levantine", "middleeastern"] },
    { name: "Corn tortilla chips",            store: ["CM"],            themes: ["latin"] },
    { name: "Tostones (plantain chips)",      store: ["CM"],            themes: ["latin"] },
    { name: "Pan de cristal",                 store: ["CM"],            themes: ["spanish"] },
    { name: "Pide (Turkish flatbread)",       store: ["AG"],            themes: ["turkish"] },
    { name: "Barbari bread, sliced",          store: ["SM"],            themes: ["persian"] },
  ],

  // ----------------------------------------------------------
  nuts: [
    { name: "Marcona almonds",                store: ["CM"],            themes: ["spanish", "mediterranean"] },
    { name: "Candied walnuts",                store: ["CM"],            themes: ["american", "french"] },
    { name: "Spiced pecans",                  store: ["CM"],            themes: ["american"] },
    { name: "Pistachios, roasted",            store: ["CM", "SM", "AG"],themes: ["persian", "middleeastern", "levantine", "mediterranean"] },
    { name: "Pine nuts, toasted",             store: ["CM", "SM"],      themes: ["mediterranean", "italian", "levantine", "middleeastern"] },
    { name: "Turkish hazelnuts",              store: ["AG"],            themes: ["turkish", "mediterranean"] },
    { name: "Roasted chickpeas",              store: ["SM", "AG"],      themes: ["middleeastern", "levantine", "northafrican", "mediterranean"] },
    { name: "Spiced almonds",                 store: ["CM", "SM"],      themes: ["northafrican", "spanish", "mediterranean"] },
    { name: "Walnuts with honey",             store: ["CM", "SM"],      themes: ["greek", "persian", "mediterranean"] },
    { name: "Mixed nuts, za'atar spiced",     store: ["SM"],            themes: ["levantine", "middleeastern"] },
    { name: "Pepitas (pumpkin seeds)",        store: ["CM"],            themes: ["latin"] },
    { name: "Cajun spiced cashews",           store: ["CM"],            themes: ["american"] },
    { name: "Roasted cashews",                store: ["CM", "SM", "AG"],themes: ["persian", "middleeastern", "mediterranean"] },
    { name: "Tokhme (roasted watermelon seeds)", store: ["SM", "AG"],  themes: ["persian", "middleeastern"] },
    { name: "Tokhme kadoo (roasted pumpkin seeds)", store: ["SM", "AG"], themes: ["persian", "middleeastern"] },
  ],

  // ----------------------------------------------------------
  spreads: [
    // American / French
    { name: "Wildflower honey",               store: ["CM"],            themes: ["american", "french", "mediterranean"] },
    { name: "Fig jam",                        store: ["CM"],            themes: ["french", "italian", "mediterranean", "spanish"] },
    { name: "Whole-grain mustard",            store: ["CM"],            themes: ["american", "french"] },
    { name: "Pepper jelly",                   store: ["CM"],            themes: ["american"] },
    { name: "Apple butter",                   store: ["CM"],            themes: ["american"] },
    { name: "Truffle honey",                  store: ["CM"],            themes: ["italian", "french"] },
    { name: "Apricot preserves",              store: ["CM"],            themes: ["french", "mediterranean"] },

    // Mediterranean / Spanish / Italian
    { name: "Romesco sauce",                  store: ["CM"],            themes: ["spanish", "mediterranean"] },
    { name: "Tapenade (olive spread)",        store: ["CM", "SM"],      themes: ["french", "mediterranean", "greek"] },
    { name: "Sun-dried tomato spread",        store: ["CM"],            themes: ["italian", "mediterranean"] },
    { name: "Pesto",                          store: ["CM"],            themes: ["italian"] },
    { name: "Quince paste (membrillo)",       store: ["CM"],            themes: ["spanish", "mediterranean"] },
    { name: "Olive oil + za'atar for dipping",store: ["SM", "AG"],      themes: ["levantine", "middleeastern", "mediterranean", "greek"] },

    // Middle Eastern / Levantine
    { name: "Hummus",                         store: ["SM", "CM"],      themes: ["middleeastern", "levantine", "greek", "mediterranean"] },
    { name: "Baba ghanoush",                  store: ["SM"],            themes: ["middleeastern", "levantine", "mediterranean"] },
    { name: "Mutabal (tahini + eggplant)",    store: ["SM"],            themes: ["levantine", "middleeastern"] },
    { name: "Muhammara (red pepper-walnut)",  store: ["SM"],            themes: ["levantine", "middleeastern", "turkish"] },
    { name: "Labneh with za'atar",            store: ["SM"],            themes: ["levantine", "middleeastern"] },
    { name: "Toum (garlic cream)",            store: ["SM"],            themes: ["levantine", "middleeastern"] },
    { name: "Tahini",                         store: ["SM", "AG", "CM"],themes: ["middleeastern", "levantine", "greek", "northafrican", "persian"] },
    { name: "Pomegranate molasses",           store: ["SM", "AG"],      themes: ["levantine", "middleeastern", "persian", "northafrican"] },

    // Persian / North African
    { name: "Kashk (fermented whey dip)",     store: ["SM"],            themes: ["persian"] },
    { name: "Harissa paste",                  store: ["CM", "SM"],      themes: ["northafrican", "mediterranean"] },
    { name: "Chermoula sauce",                store: ["SM"],            themes: ["northafrican"] },
    { name: "Date molasses",                  store: ["SM", "AG"],      themes: ["persian", "middleeastern", "northafrican"] },
    { name: "Mast-o-khiar (yogurt-cucumber)", store: ["SM"],            themes: ["persian", "middleeastern"] },

    // Turkish
    { name: "Biber salçası (pepper paste)",   store: ["AG"],            themes: ["turkish", "middleeastern"] },
    { name: "Haydari (yogurt-herb dip)",      store: ["AG", "SM"],      themes: ["turkish"] },

    // Greek
    { name: "Tzatziki",                       store: ["CM", "SM"],      themes: ["greek", "mediterranean"] },
    { name: "Skordalia (garlic dip)",         store: ["CM"],            themes: ["greek"] },

    // Latin
    { name: "Guacamole",                      store: ["CM"],            themes: ["latin"] },
    { name: "Black bean dip",                 store: ["CM"],            themes: ["latin"] },
    { name: "Salsa verde",                    store: ["CM"],            themes: ["latin"] },
  ],

  // ----------------------------------------------------------
  // Pickles: brined, marinated, oil-cured, and preserved items
  // includes olives, marinated vegetables, and roasted/preserved veg
  // ----------------------------------------------------------
  pickles: [
    // Western / American / French
    { name: "Cornichons",                     store: ["CM"],            themes: ["french", "american"] },
    { name: "Bread & butter pickles",         store: ["CM"],            themes: ["american"] },
    { name: "Pickled jalapeños",              store: ["CM"],            themes: ["latin", "american"] },
    { name: "Peppadew peppers",               store: ["CM"],            themes: ["mediterranean", "american"] },
    { name: "Pickled banana peppers",         store: ["CM"],            themes: ["italian", "american"] },

    // Olives
    { name: "Castelvetrano olives",           store: ["CM"],            themes: ["italian", "mediterranean"] },
    { name: "Kalamata olives",                store: ["CM", "SM"],      themes: ["greek", "mediterranean"] },
    { name: "Cerignola olives",               store: ["CM"],            themes: ["italian", "mediterranean"] },
    { name: "Mixed marinated olives",         store: ["CM", "SM"],      themes: ["mediterranean", "spanish", "french"] },
    { name: "Manzanilla olives, stuffed",     store: ["CM"],            themes: ["spanish"] },

    // Marinated / roasted vegetables (moved from extras)
    { name: "Marinated artichoke hearts",     store: ["CM"],            themes: ["italian", "mediterranean", "greek"] },
    { name: "Roasted red peppers",            store: ["CM"],            themes: ["mediterranean", "spanish", "italian"] },
    { name: "Sun-dried tomatoes in oil",      store: ["CM"],            themes: ["italian", "mediterranean"] },
    { name: "Marinated mushrooms",            store: ["CM"],            themes: ["italian", "french", "mediterranean"] },

    // Middle Eastern / Levantine / Turkish
    { name: "Turşu (Turkish pickled veg)",    store: ["AG"],            themes: ["turkish", "middleeastern"] },
    { name: "Pickled turnips (pink)",         store: ["SM", "AG"],      themes: ["levantine", "middleeastern", "turkish"] },
    { name: "Pickled grape leaves",           store: ["SM", "AG"],      themes: ["greek", "turkish", "levantine"] },
    { name: "Pickled cucumbers (Middle Eastern)", store: ["SM"],        themes: ["levantine", "middleeastern"] },
    { name: "Pickled garlic",                 store: ["SM", "AG", "CM"],themes: ["middleeastern", "levantine", "persian", "mediterranean"] },

    // Persian / North African
    { name: "Preserved lemons",               store: ["SM", "CM"],      themes: ["northafrican", "persian", "mediterranean"] },
    { name: "Torshi (Persian mixed pickles)", store: ["SM"],            themes: ["persian"] },
  ],

  // ----------------------------------------------------------
  // Vegetables: fresh and raw only (crudités)
  // Marinated / roasted veg live in Pickles
  // ----------------------------------------------------------
  vegetables: [
    { name: "Persian cucumbers, sliced",      store: ["CM", "SM"],      themes: ["persian", "levantine", "middleeastern", "greek", "mediterranean"] },
    { name: "Cherry tomatoes",                store: ["CM", "SM"],      themes: ["italian", "mediterranean", "greek", "levantine"] },
    { name: "Radishes, trimmed",              store: ["CM", "SM"],      themes: ["french", "persian", "levantine", "middleeastern", "mediterranean"] },
    { name: "Carrot sticks",                  store: ["CM", "SM"],      themes: ["american", "french", "mediterranean"] },
    { name: "Celery sticks",                  store: ["CM"],            themes: ["american", "french"] },
    { name: "Bell pepper strips",             store: ["CM", "SM"],      themes: ["american", "latin", "mediterranean"] },
    { name: "Snap peas",                      store: ["CM"],            themes: ["american", "french"] },
    { name: "Cucumber spears",                store: ["CM"],            themes: ["american", "greek", "mediterranean"] },
    { name: "Endive leaves",                  store: ["CM"],            themes: ["french", "italian"] },
    { name: "Broccoli florets",               store: ["CM"],            themes: ["american", "italian"] },
    { name: "Cauliflower florets",            store: ["CM"],            themes: ["american", "mediterranean", "levantine"] },
    { name: "Green onions / scallions",       store: ["CM", "SM"],      themes: ["persian", "levantine", "middleeastern", "american"] },
    { name: "Fresh mint sprigs",              store: ["CM", "SM"],      themes: ["persian", "levantine", "middleeastern", "greek", "northafrican"] },
    { name: "Fresh tarragon",                 store: ["CM", "SM"],      themes: ["persian", "french"] },
    { name: "Fresh basil leaves",             store: ["CM"],            themes: ["italian", "mediterranean", "persian"] },
    { name: "Fresh dill",                     store: ["CM", "SM"],      themes: ["persian", "greek", "levantine"] },
    { name: "Sliced radishes with butter",    store: ["CM"],            themes: ["french"] },
  ],

  // ----------------------------------------------------------
  extras: [
    // American / French
    { name: "Local Texas wildflower honey",   store: ["CM"],            themes: ["american"] },
    { name: "Dijon mustard",                  store: ["CM"],            themes: ["french", "american"] },
    { name: "Dried cranberries",              store: ["CM"],            themes: ["american"] },
    { name: "Caperberries",                   store: ["CM"],            themes: ["italian", "mediterranean", "spanish"] },
    { name: "Roasted garlic cloves",          store: ["CM"],            themes: ["italian", "mediterranean", "french"] },

    // Greek / Turkish / Middle Eastern
    { name: "Za'atar spice blend",            store: ["SM", "AG"],      themes: ["levantine", "middleeastern", "turkish"] },
    { name: "Sumac",                          store: ["SM", "AG"],      themes: ["levantine", "middleeastern", "persian", "turkish"] },
    { name: "Grape leaves (dolma, stuffed)",  store: ["SM", "AG"],      themes: ["greek", "turkish", "levantine"] },
    { name: "Turkish delight (lokum)",        store: ["AG"],            themes: ["turkish"] },
    { name: "Baklava pieces",                 store: ["SM", "AG"],      themes: ["turkish", "greek", "middleeastern"] },
    { name: "Sesame halva",                   store: ["SM", "AG"],      themes: ["middleeastern", "levantine", "greek"] },

    // Persian / North African
    { name: "Saffron honey",                  store: ["SM"],            themes: ["persian", "northafrican", "mediterranean"] },
    { name: "Rose water candies",             store: ["SM", "AG"],      themes: ["persian", "middleeastern"] },
    { name: "Ras el hanout spice",            store: ["SM"],            themes: ["northafrican"] },

    // Sabzi khordan — Persian fresh herb platter essentials
    { name: "Sabzi khordan (Persian herb platter: mint, tarragon, basil, dill, radish, scallion)", store: ["SM"], themes: ["persian"] },
    { name: "Walnuts with fresh herbs (noon-o-panir style)", store: ["SM"], themes: ["persian"] },

    // Spanish / Latin
    { name: "Marcona almonds, rosemary",      store: ["CM"],            themes: ["spanish", "mediterranean"] },
    { name: "Tajín chili-lime powder",        store: ["CM"],            themes: ["latin"] },
    { name: "Dulce de leche",                 store: ["CM"],            themes: ["latin"] },
    { name: "Chamoy sauce",                   store: ["CM"],            themes: ["latin"] },
    { name: "Edible flowers (garnish)",       store: ["CM"],            themes: ["french", "mediterranean", "persian", "american"] },
  ],
};

// ============================================================
// HELPER: Check if two themes clash
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
  return clashes; // empty array = no clashes
}

// ============================================================
// HELPER: Get eligible items for a category given selected themes
// ============================================================
function getEligibleItems(category, selectedThemeIds) {
  return ITEMS[category].filter(item =>
    item.themes.some(t => selectedThemeIds.includes(t))
  );
}

// ============================================================
// HELPER: Pick N random unique items from an array
// ============================================================
function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// ============================================================
// HELPER: Roll a full board
// Returns { category: [items] } or { category: null } if not enough items
// ============================================================
function rollBoard(selectedThemeIds, boardSize) {
  const n = BOARD_SIZES[boardSize].itemsPerCategory;
  const result = {};
  for (const category of Object.keys(ITEMS)) {
    const eligible = getEligibleItems(category, selectedThemeIds);
    result[category] = eligible.length > 0 ? pickRandom(eligible, Math.min(n, eligible.length)) : [];
  }
  return result;
}
