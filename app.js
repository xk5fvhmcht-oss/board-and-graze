// ═══════════════════════════════════════════
// BOARD & GRAZE — APP.JS
// ═══════════════════════════════════════════

// ── STATE ──
const state = {
  selectedThemes:  [],
  boardSize:       'M',
  mealRole:        'main',
  headCount:       6,
  categoryLimits:  {}, // category → override count (null = use boardSize default)
  currentBoard:    {}, // category → [items]
  excludedItems:   new Set(JSON.parse(localStorage.getItem('excluded') || '[]')),
};

// Category display names + icons
const CAT_META = {
  meats:      { label: 'Meats',      icon: '🥩' },
  cheeses:    { label: 'Cheeses',    icon: '🧀' },
  fruits:     { label: 'Fruits',     icon: '🍇' },
  crackers:   { label: 'Crackers',   icon: '🫙' },
  breads:     { label: 'Breads',     icon: '🫓' },
  nuts:       { label: 'Nuts',       icon: '🫘' },
  spreads:    { label: 'Spreads',    icon: '🍯' },
  pickles:    { label: 'Pickles',    icon: '🫒' },
  vegetables: { label: 'Vegetables', icon: '🥕' },
  extras:     { label: 'Extras',     icon: '✨' },
};

const STORE_NAMES = {
  CM: 'Central Market',
  SM: "Sara's Mediterranean",
  AG: 'Altin Grocery',
};

const STORE_ADDRESS = {
  CM: '5750 E Lovers Ln, Dallas, TX',
  SM: '750 S Sherman St, Richardson, TX',
  AG: '1201 N Central Expy #19, Plano, TX',
};

// ── DOM REFS ──
const $ = id => document.getElementById(id);

// Screens
const screens = {
  setup:    $('screen-setup'),
  board:    $('screen-board'),
  shopping: $('screen-shopping'),
};

// ── SCREEN NAVIGATION ──
function showScreen(name) {
  Object.entries(screens).forEach(([k, el]) => {
    el.classList.toggle('active', k === name);
  });
  window.scrollTo(0, 0);
}

// ── INIT THEME GRID ──
function initThemeGrid() {
  const grid = $('theme-grid');
  grid.innerHTML = '';
  THEMES.forEach(theme => {
    const tile = document.createElement('button');
    tile.className = 'theme-tile';
    tile.dataset.id = theme.id;
    tile.innerHTML = `<span class="theme-flag">${theme.flag}</span><span class="theme-name">${theme.label}</span>`;
    tile.addEventListener('click', () => toggleTheme(theme.id));
    grid.appendChild(tile);
  });
}

function toggleTheme(id) {
  const idx = state.selectedThemes.indexOf(id);
  if (idx === -1) state.selectedThemes.push(id);
  else state.selectedThemes.splice(idx, 1);
  updateThemeUI();
}

function updateThemeUI() {
  // Update tile states
  document.querySelectorAll('.theme-tile').forEach(tile => {
    tile.classList.toggle('selected', state.selectedThemes.includes(tile.dataset.id));
  });

  // Check clashes
  const clashes = themesClash(state.selectedThemes);
  const warn = $('clash-warning');
  if (clashes.length > 0) {
    warn.style.display = 'flex';
    $('clash-text').textContent =
      'These combinations may not pair well: ' + clashes.join(', ') +
      '. Your board will still roll — but flavors may feel mismatched.';
  } else {
    warn.style.display = 'none';
  }

  // Update roll button
  const canRoll = state.selectedThemes.length > 0;
  const btn = $('btn-roll');
  btn.disabled = !canRoll;
  $('roll-hint').textContent = canRoll
    ? state.selectedThemes.length === 1
      ? THEMES.find(t => t.id === state.selectedThemes[0]).label + ' board'
      : state.selectedThemes.length + ' themes selected'
    : 'Select at least one theme';
}

// ── BOARD SIZE ──
function initSizeButtons() {
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.boardSize = btn.dataset.size;
      // Reset category limits to new default
      state.categoryLimits = {};
      updateSliders();
    });
  });
}

// ── MEAL ROLE ──
function initRoleButtons() {
  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mealRole = btn.dataset.role;
    });
  });
}

// ── ROLL ──
$('btn-roll').addEventListener('click', () => {
  rollAndShow();
});

$('btn-reroll-all').addEventListener('click', () => {
  rollAndShow();
});

function getCategoryCount(category) {
  if (state.categoryLimits[category] !== undefined) return state.categoryLimits[category];
  return BOARD_SIZES[state.boardSize].itemsPerCategory;
}

function rollAndShow() {
  const board = {};
  for (const category of Object.keys(ITEMS)) {
    const n = getCategoryCount(category);
    if (n === 0) { board[category] = []; continue; }
    const eligible = getEligibleItems(category, state.selectedThemes)
      .filter(item => !state.excludedItems.has(item.name));
    board[category] = eligible.length > 0
      ? pickRandom(eligible, Math.min(n, eligible.length))
      : [];
  }
  state.currentBoard = board;
  renderBoard();
  showScreen('board');
}

// ── RENDER BOARD ──
function renderBoard() {
  const main = $('board-main');
  main.innerHTML = '';

  // Board meta
  const themes = state.selectedThemes.map(id => THEMES.find(t => t.id === id).label).join(', ');
  $('board-meta').textContent = `${BOARD_SIZES[state.boardSize].label} · ${MEAL_ROLES[state.mealRole].label} · ${state.headCount} guests`;

  Object.entries(state.currentBoard).forEach(([category, items]) => {
    const meta = CAT_META[category];
    const n = items.length;
    const servingInfo = n > 0 ? calcServing(category, state.mealRole, state.headCount, n) : null;
    const tip = SERVING_GUIDANCE[category]?.tip;

    const card = document.createElement('div');
    card.className = 'cat-card';
    if (getCategoryCount(category) === 0) card.classList.add('excluded');

    // Header
    const header = document.createElement('div');
    header.className = 'cat-header';
    header.innerHTML = `
      <span class="cat-name">${meta.icon} ${meta.label}</span>
      ${servingInfo
        ? `<span class="cat-serving">${servingInfo.imperial}${servingInfo.metric ? ' / ' + servingInfo.metric : ''} each</span>`
        : '<span class="cat-serving">—</span>'
      }
    `;
    card.appendChild(header);

    // Items
    const itemsEl = document.createElement('div');
    itemsEl.className = 'cat-items';

    if (items.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-cat';
      empty.textContent = getCategoryCount(category) === 0
        ? 'Category excluded — adjust in Customize'
        : 'No matching items for selected themes';
      itemsEl.appendChild(empty);
    } else {
      items.forEach(item => {
        itemsEl.appendChild(buildItemRow(item, category));
      });
    }
    card.appendChild(itemsEl);

    // Tip
    if (tip && items.length > 0) {
      const tipEl = document.createElement('div');
      tipEl.className = 'cat-tip';
      tipEl.textContent = tip;
      card.appendChild(tipEl);
    }

    main.appendChild(card);
  });
}

function buildItemRow(item, category) {
  const row = document.createElement('div');
  row.className = 'item-row';
  row.dataset.itemName = item.name;

  const left = document.createElement('div');
  left.className = 'item-left';

  const name = document.createElement('div');
  name.className = 'item-name';
  name.textContent = item.name;

  const meta = document.createElement('div');
  meta.className = 'item-meta';
  item.store.forEach(s => {
    const badge = document.createElement('span');
    badge.className = `store-badge store-${s}`;
    badge.textContent = s;
    meta.appendChild(badge);
  });

  left.appendChild(name);
  left.appendChild(meta);

  // Action buttons
  const actions = document.createElement('div');
  actions.className = 'item-actions';

  // Re-roll single item
  const rerollBtn = document.createElement('button');
  rerollBtn.className = 'btn-reroll-item';
  rerollBtn.title = 'Roll a different item';
  rerollBtn.setAttribute('aria-label', 'Roll a different item');
  rerollBtn.innerHTML = '↻';
  rerollBtn.addEventListener('click', () => rerollItem(category, item.name, row));

  // Hide item
  const hideBtn = document.createElement('button');
  hideBtn.className = 'btn-hide-item';
  hideBtn.title = "Don't show again";
  hideBtn.setAttribute('aria-label', "Don't show this item again");
  hideBtn.innerHTML = '✕';
  hideBtn.addEventListener('click', () => hideItem(item.name, category, row));

  actions.appendChild(rerollBtn);
  actions.appendChild(hideBtn);
  row.appendChild(left);
  row.appendChild(actions);
  return row;
}

// ── REROLL SINGLE ITEM ──
function rerollItem(category, currentName, rowEl) {
  const allItems = state.currentBoard[category].map(i => i.name);
  const eligible = getEligibleItems(category, state.selectedThemes)
    .filter(item => !state.excludedItems.has(item.name) && !allItems.includes(item.name));

  if (eligible.length === 0) return; // nothing else to pick

  const newItem = pickRandom(eligible, 1)[0];
  const idx = state.currentBoard[category].findIndex(i => i.name === currentName);
  if (idx !== -1) state.currentBoard[category][idx] = newItem;

  // Animate swap
  rowEl.style.opacity = '0';
  rowEl.style.transition = 'opacity 0.15s';
  setTimeout(() => {
    const newRow = buildItemRow(newItem, category);
    rowEl.parentNode.replaceChild(newRow, rowEl);
    newRow.style.opacity = '0';
    newRow.style.transition = 'opacity 0.15s';
    requestAnimationFrame(() => { newRow.style.opacity = '1'; });
  }, 150);
}

// ── HIDE ITEM ──
function hideItem(name, category, rowEl) {
  state.excludedItems.add(name);
  saveExcluded();

  // Replace with a new item if possible
  const allItems = state.currentBoard[category].map(i => i.name);
  const eligible = getEligibleItems(category, state.selectedThemes)
    .filter(item => !state.excludedItems.has(item.name) && !allItems.includes(item.name));

  rowEl.style.opacity = '0';
  rowEl.style.transition = 'opacity 0.15s, transform 0.15s';
  rowEl.style.transform = 'translateX(20px)';

  setTimeout(() => {
    if (eligible.length > 0) {
      const newItem = pickRandom(eligible, 1)[0];
      const idx = state.currentBoard[category].findIndex(i => i.name === name);
      if (idx !== -1) state.currentBoard[category][idx] = newItem;
      const newRow = buildItemRow(newItem, category);
      rowEl.parentNode.replaceChild(newRow, rowEl);
      newRow.style.opacity = '0';
      newRow.style.transition = 'opacity 0.15s';
      requestAnimationFrame(() => { newRow.style.opacity = '1'; });
    } else {
      // Remove from board
      const idx = state.currentBoard[category].findIndex(i => i.name === name);
      if (idx !== -1) state.currentBoard[category].splice(idx, 1);
      rowEl.remove();
    }
  }, 150);

  updateExcludedPanel();
}

function saveExcluded() {
  localStorage.setItem('excluded', JSON.stringify([...state.excludedItems]));
}

// ── SHOPPING LIST ──
$('btn-shopping-list').addEventListener('click', () => {
  renderShoppingList();
  showScreen('shopping');
});

function renderShoppingList() {
  const main = $('shopping-main');
  main.innerHTML = '';

  // Summary card
  const themes = state.selectedThemes.map(id => THEMES.find(t => t.id === id).label).join(', ');
  const summary = document.createElement('div');
  summary.className = 'shop-summary';
  summary.innerHTML = `
    <div class="shop-summary-title">Board & Graze Shopping List</div>
    <div class="shop-summary-row">🎭 Themes: ${themes}</div>
    <div class="shop-summary-row">📏 Size: ${BOARD_SIZES[state.boardSize].label} · ${MEAL_ROLES[state.mealRole].label}</div>
    <div class="shop-summary-row">👥 Guests: ${state.headCount}</div>
  `;
  main.appendChild(summary);

  // Group items by store
  const byStore = { CM: [], SM: [], AG: [] };
  Object.entries(state.currentBoard).forEach(([category, items]) => {
    items.forEach(item => {
      const n = state.currentBoard[category].length;
      const serving = calcServing(category, state.mealRole, state.headCount, n);
      item.store.forEach(s => {
        if (!byStore[s]) byStore[s] = [];
        // Avoid duplicate if item is at multiple stores — list at first store only
        if (!byStore[s].find(i => i.name === item.name)) {
          byStore[s].push({ ...item, category, serving });
        }
      });
    });
  });

  // Deduplicate: if item appears at multiple stores, assign to first store only
  const seen = new Set();
  ['CM', 'SM', 'AG'].forEach(store => {
    byStore[store] = byStore[store].filter(item => {
      if (seen.has(item.name)) return false;
      seen.add(item.name);
      return true;
    });
  });

  // Render per-store sections
  ['CM', 'SM', 'AG'].forEach(store => {
    const items = byStore[store];
    if (items.length === 0) return;

    const section = document.createElement('div');
    section.className = 'shop-section';

    section.innerHTML = `
      <div class="shop-store-header">
        <div>
          <div class="shop-store-name">${STORE_NAMES[store]}</div>
          <div class="shop-store-sub">${STORE_ADDRESS[store]}</div>
        </div>
      </div>
    `;

    items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'shop-item';

      const check = document.createElement('div');
      check.className = 'shop-check';
      check.addEventListener('click', () => check.classList.toggle('checked'));

      const left = document.createElement('div');
      left.className = 'shop-item-left';
      left.innerHTML = `
        <div class="shop-item-name">${item.name}</div>
        <div class="shop-item-cat">${CAT_META[item.category].icon} ${CAT_META[item.category].label}</div>
      `;

      const qty = document.createElement('div');
      qty.className = 'shop-qty';
      if (item.serving) {
        qty.innerHTML = `${item.serving.imperial}${item.serving.metric ? '<div class="shop-qty-metric">' + item.serving.metric + '</div>' : ''}`;
      } else {
        qty.textContent = '—';
      }

      row.appendChild(check);
      row.appendChild(left);
      row.appendChild(qty);
      section.appendChild(row);
    });

    main.appendChild(section);
  });

  // Board supplies section
  const supplies = document.createElement('div');
  supplies.className = 'shop-supplies';
  supplies.innerHTML = `<div class="shop-supplies-title">You'll also need</div>`;
  BOARD_SUPPLIES.forEach(s => {
    const row = document.createElement('div');
    row.className = 'supply-row';
    row.innerHTML = `<span class="supply-name">${s.item}</span><span class="supply-note">${s.note}</span>`;
    supplies.appendChild(row);
  });
  main.appendChild(supplies);
}

// ── PRINT ──
$('btn-print').addEventListener('click', () => window.print());

// ── BACK BUTTONS ──
$('btn-back').addEventListener('click', () => showScreen('setup'));
$('btn-back-shop').addEventListener('click', () => showScreen('board'));

// ── CUSTOMIZE PANEL ──
$('btn-customize').addEventListener('click', openCustomize);
$('btn-close-customize').addEventListener('click', closeCustomize);
$('panel-overlay').addEventListener('click', closeCustomize);

function openCustomize() {
  $('panel-customize').hidden = false;
  updateSliders();
  updateExcludedPanel();
}

function closeCustomize() {
  $('panel-customize').hidden = true;
}

// ── HEADCOUNT STEPPER ──
$('stepper-down').addEventListener('click', () => {
  if (state.headCount > 1) { state.headCount--; $('stepper-val').textContent = state.headCount; }
});
$('stepper-up').addEventListener('click', () => {
  if (state.headCount < 30) { state.headCount++; $('stepper-val').textContent = state.headCount; }
});

// ── CATEGORY SLIDERS ──
function initSliders() {
  const container = $('cat-sliders');
  container.innerHTML = '';
  const maxVal = 6;

  Object.entries(CAT_META).forEach(([category, meta]) => {
    const defaultVal = BOARD_SIZES[state.boardSize].itemsPerCategory;
    const currentVal = state.categoryLimits[category] !== undefined
      ? state.categoryLimits[category]
      : defaultVal;

    const row = document.createElement('div');
    row.className = 'slider-row';
    row.id = `slider-row-${category}`;

    const label = document.createElement('span');
    label.className = 'slider-cat-name' + (currentVal === 0 ? ' zero' : '');
    label.textContent = `${meta.icon} ${meta.label}`;
    label.id = `slider-label-${category}`;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'cat-slider';
    slider.min = 0;
    slider.max = maxVal;
    slider.step = 1;
    slider.value = currentVal;
    slider.setAttribute('aria-label', `${meta.label} items`);

    const valDisplay = document.createElement('span');
    valDisplay.className = 'slider-val' + (currentVal === 0 ? ' zero' : '');
    valDisplay.textContent = currentVal;
    valDisplay.id = `slider-val-${category}`;

    slider.addEventListener('input', () => {
      const v = parseInt(slider.value);
      state.categoryLimits[category] = v;
      valDisplay.textContent = v;
      valDisplay.className = 'slider-val' + (v === 0 ? ' zero' : '');
      label.className = 'slider-cat-name' + (v === 0 ? ' zero' : '');
    });

    row.appendChild(label);
    row.appendChild(slider);
    row.appendChild(valDisplay);
    container.appendChild(row);
  });
}

function updateSliders() {
  // Re-init to reflect current boardSize defaults
  initSliders();
}

// ── EXCLUDED ITEMS PANEL ──
function updateExcludedPanel() {
  const section = $('excluded-section');
  const list = $('excluded-list');

  if (state.excludedItems.size === 0) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  list.innerHTML = '';

  [...state.excludedItems].sort().forEach(name => {
    const row = document.createElement('div');
    row.className = 'excluded-item';
    row.innerHTML = `<span>${name}</span>`;

    const restoreBtn = document.createElement('button');
    restoreBtn.className = 'btn-restore';
    restoreBtn.textContent = 'Restore';
    restoreBtn.addEventListener('click', () => {
      state.excludedItems.delete(name);
      saveExcluded();
      updateExcludedPanel();
    });

    row.appendChild(restoreBtn);
    list.appendChild(row);
  });
}

$('btn-restore-all').addEventListener('click', () => {
  state.excludedItems.clear();
  saveExcluded();
  updateExcludedPanel();
});

// ── SHARE ──
$('btn-share').addEventListener('click', async () => {
  const themes = state.selectedThemes.map(id => THEMES.find(t => t.id === id).label).join(', ');
  const lines = [`🧀 Omar's Board & Graze — ${themes}`, `${BOARD_SIZES[state.boardSize].label} board · ${MEAL_ROLES[state.mealRole].label} · ${state.headCount} guests`, ''];
  Object.entries(state.currentBoard).forEach(([cat, items]) => {
    if (items.length > 0) {
      lines.push(`${CAT_META[cat].icon} ${CAT_META[cat].label}: ${items.map(i => i.name).join(', ')}`);
    }
  });
  const text = lines.join('\n');

  if (navigator.share) {
    try {
      await navigator.share({ title: "Omar's Board & Graze", text });
    } catch {}
  } else {
    await navigator.clipboard.writeText(text);
    const btn = $('btn-share');
    const original = btn.innerHTML;
    btn.innerHTML = '✓';
    setTimeout(() => { btn.innerHTML = original; }, 1500);
  }
});

// ── RESET ──
function resetApp() {
  state.selectedThemes  = [];
  state.boardSize       = 'M';
  state.mealRole        = 'main';
  state.categoryLimits  = {};
  state.currentBoard    = {};

  // Reset size buttons
  document.querySelectorAll('.size-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.size === 'M')
  );

  // Reset role buttons
  document.querySelectorAll('.role-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.role === 'main')
  );

  updateThemeUI();
  updateSliders();
  showScreen('setup');
}

$('btn-reset').addEventListener('click', resetApp);

// ── BOOTSTRAP ──
function init() {
  initThemeGrid();
  initSizeButtons();
  initRoleButtons();
  initSliders();
  $('stepper-val').textContent = state.headCount;
}

init();
