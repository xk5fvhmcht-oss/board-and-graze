# Omar's Board & Graze

> *Built on a Levantine American palate — where hummus and cheddar belong on the same board.*

A charcuterie board randomizer built for Dallas. Pork-free by design, sourced from three local stores, rooted in two food cultures.

## Live App
**https://xk5fvhmcht-oss.github.io/board-and-graze/**

Install on iPhone: open in Safari → Share → Add to Home Screen

## Version
**v1.4.0**

## Stores
| Code | Store | Location |
|---|---|---|
| CM | Central Market | 5750 E Lovers Ln, Dallas TX |
| SM | Sara's Mediterranean Market | 750 S Sherman St, Richardson TX |
| AG | Altin Grocery | 1201 N Central Expy #19, Plano TX |

## Features
- **12 cultural themes** with flag tiles — American, Latin, Mediterranean, French, Italian, Spanish, Greek, Turkish, Middle Eastern, North African, Persian, Levantine
- **Theme clash warnings** — incompatible flavor combinations flagged before you roll
- **3 board sizes** — Small (1/cat), Medium (2/cat), Large (4/cat)
- **3 meal roles** — Appetizer, Main Course, Grazing Table
- **3 board personalities** — 🧺 Classic, 🌿 Curated, 🌶️ Explorer (built on a Levantine American palate)
- **Headcount-aware serving sizes** — imperial and metric, auto-converts oz→lb and tbsp→cups
- **Per-category sliders** — set any category to 0 to exclude
- **⚓ Anchor system** — anchor items to always appear on your board, regardless of theme or profile
- **Item Library** — browse all 191 items, anchor or exclude from one place, profile and store badges on every item
- **Anchor indicator** — shows active anchors on the setup screen
- **Re-roll individual items** — swap one item without re-rolling the whole board
- **"Don't show again"** — excludes items permanently, manageable in the library
- **Shopping list** — grouped by store with quantities in imperial and metric
- **Board supplies checklist** — on every shopping list printout
- **Presentation items** — coming in next version
- **Board layout guide** — coming in next version
- **Share board** — native share sheet on iOS, clipboard fallback
- **Print shopping list** — clean print stylesheet
- **PWA** — installs to iOS home screen, works fully offline

## Item counts (v1.3.1)
| Category | Items |
|---|---|
| Meats | 16 |
| Cheeses | 38 |
| Fruits | 20 |
| Crackers | 8 |
| Breads | 13 |
| Nuts | 14 |
| Spreads | 32 |
| Pickles | 21 |
| Vegetables | 16 |
| Extras | 14 |
| **Total** | **191** |

All items are **pork-free** and **board-ready** — no cooking required.

## Board Personality Profiles
Items are tagged C / S / E based on a Levantine American palate:
- **C — Classic** — everyday on a Levantine American table. Hummus, labneh, pita, cheddar, grapes.
- **S — Curated** — elevated but approachable. Brie, bresaola, muhammara, preserved lemons.
- **E — Explorer** — specialty deep cuts. Époisses, lighvan, kashk, torshi, tulum peyniri.

## Deploy to GitHub Pages
1. Push repo to GitHub
2. Settings → Pages → Source: `main` branch, `/ (root)`
3. Live at `https://[username].github.io/[repo-name]/`

## File Structure
| File | Purpose |
|---|---|
| `index.html` | App structure — 4 screens + customize panel |
| `style.css` | All styling — rustic warm parchment palette |
| `app.js` | All logic — rolling, anchors, library, shopping list |
| `data.js` | 191 items, themes, serving math, helpers |
| `sw.js` | Service worker — offline + PWA |
| `manifest.json` | PWA config |

## Version History
| Version | Changes |
|---|---|
| 1.0.0 | Initial release — themes, board size, roll engine, shopping list, PWA |
| 1.1.0 | Meats rebuild, English translations, presentation category, dual units |
| 1.2.0 | Board personality profiles (Classic/Curated/Explorer), Levantine American palate tagline |
| 1.3.0 | Anchor system, Item Library, anchor indicator, "In the Levant, this is called breakfast" |
| 1.3.1 | Shanklish + Taboon bread added, service worker fixed, manifest updated |
| 1.4.0 | Board Layout Guide — dynamic SVG diagram, zone map, step-by-step assembly guide |
