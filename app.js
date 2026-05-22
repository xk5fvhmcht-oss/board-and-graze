// ═══════════════════════════════════════════
// OMAR'S BOARD & GRAZE — APP.JS v1.3.0
// ═══════════════════════════════════════════

// ── STATE ──
const state = {
  selectedThemes:  [],
  boardSize:       'M',
  mealRole:        'main',
  boardProfile:    'classic',
  headCount:       6,
  categoryLimits:  {},
  currentBoard:    {},
  // Persisted in localStorage — survive reset
  anchoredItems:   new Set(JSON.parse(localStorage.getItem('anchored') || '[]')),
  excludedItems:   new Set(JSON.parse(localStorage.getItem('excluded') || '[]')),
};

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

const STORE_NAMES   = { CM: 'Central Market', SM: "Sara's Mediterranean", AG: 'Altin Grocery' };
const STORE_ADDRESS = { CM: '5750 E Lovers Ln, Dallas TX', SM: '750 S Sherman St, Richardson TX', AG: '1201 N Central Expy #19, Plano TX' };

const PROFILE_LABELS = { C: 'Classic', S: 'Curated', E: 'Explorer' };

// ── DOM ──
const $ = id => document.getElementById(id);

const screens = { setup: $('screen-setup'), board: $('screen-board'), shopping: $('screen-shopping'), library: $('screen-library') };

// ── NAVIGATION ──
function showScreen(name) {
  Object.entries(screens).forEach(([k, el]) => el.classList.toggle('active', k === name));
  window.scrollTo(0, 0);
}

// ── PERSIST ──
function saveAnchored() { localStorage.setItem('anchored', JSON.stringify([...state.anchoredItems])); }
function saveExcluded() { localStorage.setItem('excluded', JSON.stringify([...state.excludedItems])); }

// ── ANCHOR INDICATOR on setup screen ──
function updateAnchorIndicator() {
  const count = state.anchoredItems.size;
  const el = $('anchor-indicator');
  if (count === 0) { el.style.display = 'none'; return; }
  el.style.display = 'flex';
  $('anchor-indicator-text').textContent = `${count} item${count !== 1 ? 's' : ''} anchored — always on your board`;
}

$('btn-go-library').addEventListener('click', () => { renderLibrary(); showScreen('library'); });

// ── THEME GRID ──
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
  document.querySelectorAll('.theme-tile').forEach(tile =>
    tile.classList.toggle('selected', state.selectedThemes.includes(tile.dataset.id))
  );
  const clashes = themesClash(state.selectedThemes);
  const warn = $('clash-warning');
  if (clashes.length > 0) {
    warn.style.display = 'flex';
    $('clash-text').textContent = 'These combinations may not pair well: ' + clashes.join(', ') + '. Your board will still roll — but flavors may feel mismatched.';
  } else {
    warn.style.display = 'none';
  }
  const canRoll = state.selectedThemes.length > 0;
  const btn = $('btn-roll');
  btn.disabled = !canRoll;
  $('roll-hint').textContent = canRoll
    ? state.selectedThemes.length === 1
      ? THEMES.find(t => t.id === state.selectedThemes[0]).label + ' board'
      : state.selectedThemes.length + ' themes selected'
    : 'Select at least one theme';
}

// ── SIZE / ROLE / PROFILE ──
function initSizeButtons() {
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.boardSize = btn.dataset.size;
      state.categoryLimits = {};
      updateSliders();
    });
  });
}

function initRoleButtons() {
  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mealRole = btn.dataset.role;
    });
  });
}

function initProfileButtons() {
  document.querySelectorAll('.profile-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.profile-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.boardProfile = btn.dataset.profile;
    });
  });
}

// ── ROLL ──
$('btn-roll').addEventListener('click', rollAndShow);
$('btn-reroll-all').addEventListener('click', rollAndShow);

function getCategoryCount(category) {
  if (state.categoryLimits[category] !== undefined) return state.categoryLimits[category];
  return BOARD_SIZES[state.boardSize].itemsPerCategory;
}

function rollAndShow() {
  const board = {};

  for (const category of Object.keys(ITEMS)) {
    // Get anchored items for this category
    const anchored = ITEMS[category].filter(item =>
      state.anchoredItems.has(item.name) && !state.excludedItems.has(item.name)
    );

    const n = getCategoryCount(category);

    // Get eligible pool (respects theme + profile + exclusions, minus already anchored)
    const eligible = getEligibleItems(category, state.selectedThemes, state.boardProfile)
      .filter(item => !state.excludedItems.has(item.name) && !state.anchoredItems.has(item.name));

    // Anchors always included, then fill remaining slots from pool
    // Anchors don't count against slot limit
    const rolled = eligible.length > 0 && n > 0
      ? pickRandom(eligible, Math.min(n, eligible.length))
      : [];

    board[category] = [...anchored, ...rolled];
  }

  state.currentBoard = board;
  renderBoard();
  showScreen('board');
}

// ── RENDER BOARD ──
function renderBoard() {
  const main = $('board-main');
  main.innerHTML = '';

  const profLabel = PROFILES[state.boardProfile].icon + ' ' + PROFILES[state.boardProfile].label;
  $('board-meta').textContent = `${BOARD_SIZES[state.boardSize].label} · ${MEAL_ROLES[state.mealRole].label} · ${state.headCount} guests · ${profLabel}`;

  // Levantine breakfast line
  const levantineThemes = ['levantine','middleeastern','turkish','persian','northafrican'];
  const hasLevantine = state.selectedThemes.some(t => levantineThemes.includes(t));
  let taglineEl = document.getElementById('board-tagline');
  if (!taglineEl) {
    taglineEl = document.createElement('p');
    taglineEl.id = 'board-tagline';
    taglineEl.style.cssText = 'text-align:center;font-size:12px;color:#a8937a;font-style:italic;font-family:Playfair Display,Georgia,serif;padding:6px 20px 2px;';
    $('board-main').parentNode.insertBefore(taglineEl, $('board-main'));
  }
  taglineEl.textContent = hasLevantine ? 'In the Levant, this is called breakfast.' : '';

  Object.entries(state.currentBoard).forEach(([category, items]) => {
    const meta = CAT_META[category];
    const n = items.length;
    const servingInfo = n > 0 ? calcServing(category, state.mealRole, state.headCount, n) : null;
    const tip = SERVING_GUIDANCE[category]?.tip;

    const card = document.createElement('div');
    card.className = 'cat-card';
    if (getCategoryCount(category) === 0 && items.length === 0) card.classList.add('excluded');

    const header = document.createElement('div');
    header.className = 'cat-header';
    header.innerHTML = `
      <span class="cat-name">${meta.icon} ${meta.label}</span>
      ${servingInfo ? `<span class="cat-serving">${servingInfo.imperial}${servingInfo.metric ? ' / ' + servingInfo.metric : ''} each</span>` : '<span class="cat-serving">—</span>'}
    `;
    card.appendChild(header);

    const itemsEl = document.createElement('div');
    itemsEl.className = 'cat-items';

    if (items.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-cat';
      empty.textContent = getCategoryCount(category) === 0 ? 'Category excluded — adjust in Customize' : 'No matching items for selected themes';
      itemsEl.appendChild(empty);
    } else {
      items.forEach(item => itemsEl.appendChild(buildItemRow(item, category)));
    }
    card.appendChild(itemsEl);

    if (tip && items.length > 0) {
      const tipEl = document.createElement('div');
      tipEl.className = 'cat-tip';
      tipEl.textContent = tip;
      card.appendChild(tipEl);
    }

    main.appendChild(card);
  });

  // Presentation items section
  const presSection = document.createElement('div');
  presSection.className = 'cat-card';
  presSection.style.background = 'linear-gradient(135deg, #faf7f0, #f5efe6)';
  presSection.style.borderStyle = 'dashed';

  const presHeader = document.createElement('div');
  presHeader.className = 'cat-header';
  presHeader.innerHTML = '<span class="cat-name">🌸 Presentation</span><span class="cat-serving">when you find them</span>';
  presSection.appendChild(presHeader);

  const presItems = document.createElement('div');
  presItems.className = 'cat-items';

  PRESENTATION_ITEMS.forEach(item => {
    const row = document.createElement('div');
    row.style.cssText = 'padding:4px 0;border-bottom:1px dashed var(--border);';
    row.innerHTML = `
      <div style="font-size:14px;color:var(--ink);">${item.name}</div>
      <div style="font-size:11px;color:var(--ink-faint);margin-top:2px;font-style:italic;">${item.note}</div>
      <div style="margin-top:3px;">${item.store.map(s => `<span class="store-badge store-${s}">${s}</span>`).join(' ')}</div>
    `;
    presItems.appendChild(row);
  });

  presSection.appendChild(presItems);

  const presTip = document.createElement('div');
  presTip.className = 'cat-tip';
  presTip.textContent = "Not food — these make your board look like something. Buy what you find, skip what you don't.";
  presSection.appendChild(presTip);

  main.appendChild(presSection);
}

function buildItemRow(item, category) {
  const row = document.createElement('div');
  row.className = 'item-row';
  row.dataset.itemName = item.name;

  const isAnchored = state.anchoredItems.has(item.name);

  const left = document.createElement('div');
  left.className = 'item-left';

  const name = document.createElement('div');
  name.className = 'item-name';
  name.textContent = item.name;

  const meta = document.createElement('div');
  meta.className = 'item-meta';

  if (isAnchored) {
    const badge = document.createElement('span');
    badge.className = 'anchor-badge';
    badge.textContent = '⚓ anchored';
    meta.appendChild(badge);
  }

  item.store.forEach(s => {
    const badge = document.createElement('span');
    badge.className = `store-badge store-${s}`;
    badge.textContent = s;
    meta.appendChild(badge);
  });

  left.appendChild(name);
  left.appendChild(meta);

  const actions = document.createElement('div');
  actions.className = 'item-actions';

  // Anchor button
  const anchorBtn = document.createElement('button');
  anchorBtn.className = 'btn-anchor-item' + (isAnchored ? ' active' : '');
  anchorBtn.title = isAnchored ? 'Remove anchor' : 'Anchor this item';
  anchorBtn.setAttribute('aria-label', isAnchored ? 'Remove anchor' : 'Anchor this item');
  anchorBtn.innerHTML = '⚓';
  anchorBtn.addEventListener('click', () => toggleAnchorItem(item.name, anchorBtn, row));

  // Reroll button (hidden if anchored)
  const rerollBtn = document.createElement('button');
  rerollBtn.className = 'btn-reroll-item';
  rerollBtn.title = 'Roll a different item';
  rerollBtn.setAttribute('aria-label', 'Roll a different item');
  rerollBtn.innerHTML = '↻';
  rerollBtn.style.display = isAnchored ? 'none' : 'flex';
  rerollBtn.addEventListener('click', () => rerollItem(category, item.name, row));

  // Hide button (hidden if anchored)
  const hideBtn = document.createElement('button');
  hideBtn.className = 'btn-hide-item';
  hideBtn.title = "Don't show again";
  hideBtn.setAttribute('aria-label', "Don't show this item again");
  hideBtn.innerHTML = '✕';
  hideBtn.style.display = isAnchored ? 'none' : 'flex';
  hideBtn.addEventListener('click', () => hideItem(item.name, category, row));

  actions.appendChild(anchorBtn);
  actions.appendChild(rerollBtn);
  actions.appendChild(hideBtn);
  row.appendChild(left);
  row.appendChild(actions);
  return row;
}

// ── ANCHOR ITEM (from board screen) ──
function toggleAnchorItem(name, btn, row) {
  if (state.anchoredItems.has(name)) {
    state.anchoredItems.delete(name);
  } else {
    state.anchoredItems.add(name);
    state.excludedItems.delete(name); // can't be both
  }
  saveAnchored();
  saveExcluded();
  updateAnchorIndicator();
  // Re-render the row to reflect new state
  const category = findCategoryForItem(name);
  if (category) {
    const item = ITEMS[category].find(i => i.name === name);
    if (item) {
      const newRow = buildItemRow(item, category);
      row.parentNode.replaceChild(newRow, row);
    }
  }
}

function findCategoryForItem(name) {
  for (const [cat, items] of Object.entries(ITEMS)) {
    if (items.find(i => i.name === name)) return cat;
  }
  return null;
}

// ── REROLL SINGLE ITEM ──
function rerollItem(category, currentName, rowEl) {
  const allItems = state.currentBoard[category].map(i => i.name);
  const eligible = getEligibleItems(category, state.selectedThemes, state.boardProfile)
    .filter(item => !state.excludedItems.has(item.name) && !state.anchoredItems.has(item.name) && !allItems.includes(item.name));
  if (eligible.length === 0) return;
  const newItem = pickRandom(eligible, 1)[0];
  const idx = state.currentBoard[category].findIndex(i => i.name === currentName);
  if (idx !== -1) state.currentBoard[category][idx] = newItem;
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
  state.anchoredItems.delete(name);
  saveExcluded();
  saveAnchored();
  updateAnchorIndicator();

  const allItems = state.currentBoard[category].map(i => i.name);
  const eligible = getEligibleItems(category, state.selectedThemes, state.boardProfile)
    .filter(item => !state.excludedItems.has(item.name) && !state.anchoredItems.has(item.name) && !allItems.includes(item.name));

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
      const idx = state.currentBoard[category].findIndex(i => i.name === name);
      if (idx !== -1) state.currentBoard[category].splice(idx, 1);
      rowEl.remove();
    }
  }, 150);
}

// ── SHOPPING LIST ──
$('btn-shopping-list').addEventListener('click', () => { renderShoppingList(); showScreen('shopping'); });

function renderShoppingList() {
  const main = $('shopping-main');
  main.innerHTML = '';

  const themes = state.selectedThemes.map(id => THEMES.find(t => t.id === id).label).join(', ');
  const summary = document.createElement('div');
  summary.className = 'shop-summary';
  summary.innerHTML = `
    <div class="shop-summary-title">Omar's Board &amp; Graze</div>
    <div class="shop-summary-row">🎭 Themes: ${themes}</div>
    <div class="shop-summary-row">📏 Size: ${BOARD_SIZES[state.boardSize].label} · ${MEAL_ROLES[state.mealRole].label}</div>
    <div class="shop-summary-row">👥 Guests: ${state.headCount}</div>
    <div class="shop-summary-row">${PROFILES[state.boardProfile].icon} Profile: ${PROFILES[state.boardProfile].label}</div>
  `;
  main.appendChild(summary);

  const byStore = { CM: [], SM: [], AG: [] };
  const seen = new Set();

  Object.entries(state.currentBoard).forEach(([category, items]) => {
    items.forEach(item => {
      if (seen.has(item.name)) return;
      seen.add(item.name);
      const n = state.currentBoard[category].length;
      const serving = calcServing(category, state.mealRole, state.headCount, n);
      const isAnchored = state.anchoredItems.has(item.name);
      const primaryStore = item.store[0];
      if (byStore[primaryStore]) {
        byStore[primaryStore].push({ ...item, category, serving, isAnchored });
      }
    });
  });

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
        <div class="shop-item-name">${item.isAnchored ? '⚓ ' : ''}${item.name}</div>
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

  // Board supplies
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

  // Presentation items section
  const presSection = document.createElement('div');
  presSection.className = 'shop-supplies';
  presSection.style.marginTop = '16px';
  presSection.style.borderStyle = 'dashed';
  presSection.innerHTML = '<div class="shop-supplies-title">🌸 Presentation & Garnish</div><p style="font-size:11px;color:var(--ink-faint);font-style:italic;margin-bottom:10px;">Buy when you find them — not required, but they make the board.</p>';

  PRESENTATION_ITEMS.forEach(item => {
    const row = document.createElement('div');
    row.className = 'supply-row';
    const storeText = item.store.map(s => STORE_NAMES[s].split(' ')[0]).join(', ');
    row.innerHTML = `
      <div style="flex:1;">
        <div class="supply-name">${item.name}</div>
        <div class="supply-note">${item.note}</div>
      </div>
      <div style="font-size:10px;color:var(--ink-faint);flex-shrink:0;">${storeText}</div>
    `;
    presSection.appendChild(row);
  });

  main.appendChild(presSection);
}

// ── ITEM LIBRARY ──
$('btn-library').addEventListener('click', () => { renderLibrary(); showScreen('library'); });
$('btn-back-library').addEventListener('click', () => { updateAnchorIndicator(); showScreen('setup'); });

function renderLibrary() {
  const main = $('library-main');
  main.innerHTML = '';

  const totalAnchored = state.anchoredItems.size;
  const totalExcluded = state.excludedItems.size;
  const totalItems    = Object.values(ITEMS).reduce((a, b) => a + b.length, 0);

  // Update meta
  $('library-meta').textContent = `${totalItems} items · ${totalAnchored} anchored · ${totalExcluded} excluded`;

  // Summary strip
  const summary = document.createElement('div');
  summary.className = 'library-summary';
  summary.innerHTML = `
    <span class="lib-summary-pill total"><b>${totalItems}</b> items</span>
    <span class="lib-summary-pill anchored"><b>${totalAnchored}</b> ⚓ anchored</span>
    <span class="lib-summary-pill excluded"><b>${totalExcluded}</b> ✕ excluded</span>
  `;
  main.appendChild(summary);

  // Quick actions
  if (totalAnchored > 0 || totalExcluded > 0) {
    const actions = document.createElement('div');
    actions.className = 'library-actions';
    if (totalAnchored > 0) {
      const btn = document.createElement('button');
      btn.className = 'lib-action-btn';
      btn.textContent = 'Release all anchors';
      btn.addEventListener('click', () => { state.anchoredItems.clear(); saveAnchored(); renderLibrary(); });
      actions.appendChild(btn);
    }
    if (totalExcluded > 0) {
      const btn = document.createElement('button');
      btn.className = 'lib-action-btn';
      btn.textContent = 'Restore all excluded';
      btn.addEventListener('click', () => { state.excludedItems.clear(); saveExcluded(); renderLibrary(); });
      actions.appendChild(btn);
    }
    main.appendChild(actions);
  }

  // Category blocks
  Object.entries(ITEMS).forEach(([category, items]) => {
    const meta = CAT_META[category];
    const anchoredCount = items.filter(i => state.anchoredItems.has(i.name)).length;
    const excludedCount = items.filter(i => state.excludedItems.has(i.name)).length;

    const block = document.createElement('div');
    block.className = 'lib-category';

    // Header
    const header = document.createElement('div');
    header.className = 'lib-cat-header';

    const badges = [];
    if (anchoredCount > 0) badges.push(`<span class="lib-cat-badge anch">⚓ ${anchoredCount}</span>`);
    if (excludedCount > 0) badges.push(`<span class="lib-cat-badge excl">✕ ${excludedCount}</span>`);
    badges.push(`<span class="lib-cat-badge total">${items.length}</span>`);

    header.innerHTML = `
      <span class="lib-cat-title">${meta.icon} ${meta.label}</span>
      <div class="lib-cat-counts">${badges.join('')}</div>
      <span class="lib-cat-chevron" id="chev-${category}">›</span>
    `;

    // Items list
    const itemsList = document.createElement('div');
    itemsList.className = 'lib-items';
    itemsList.id = `lib-items-${category}`;

    items.forEach(item => {
      itemsList.appendChild(buildLibraryItemRow(item, category));
    });

    header.addEventListener('click', () => {
      const isOpen = itemsList.classList.toggle('open');
      const chev = document.getElementById(`chev-${category}`);
      if (chev) chev.classList.toggle('open', isOpen);
    });

    block.appendChild(header);
    block.appendChild(itemsList);
    main.appendChild(block);
  });
}

function buildLibraryItemRow(item, category) {
  const isAnchored = state.anchoredItems.has(item.name);
  const isExcluded = state.excludedItems.has(item.name);

  const row = document.createElement('div');
  row.className = 'lib-item-row' + (isAnchored ? ' is-anchored' : '') + (isExcluded ? ' is-excluded' : '');
  row.id = `lib-row-${item.name.replace(/[^a-z0-9]/gi, '_')}`;

  const info = document.createElement('div');
  info.className = 'lib-item-info';

  const name = document.createElement('div');
  name.className = 'lib-item-name' + (isExcluded ? ' is-excluded' : '');
  name.textContent = item.name;

  const tags = document.createElement('div');
  tags.className = 'lib-item-tags';

  // Profile badge
  const pb = document.createElement('span');
  pb.className = `lib-profile-badge ${item.p}`;
  pb.textContent = PROFILE_LABELS[item.p];
  tags.appendChild(pb);

  // Store badges
  item.store.forEach(s => {
    const sb = document.createElement('span');
    sb.className = `lib-store-tag ${s}`;
    sb.textContent = s;
    tags.appendChild(sb);
  });

  info.appendChild(name);
  info.appendChild(tags);

  // Buttons
  const btns = document.createElement('div');
  btns.className = 'lib-item-btns';

  // Anchor button
  const anchorBtn = document.createElement('button');
  anchorBtn.className = 'lib-btn anchor-btn' + (isAnchored ? ' active' : '');
  anchorBtn.title = isAnchored ? 'Remove anchor' : 'Anchor — always on board';
  anchorBtn.innerHTML = '⚓';
  anchorBtn.addEventListener('click', () => {
    if (state.anchoredItems.has(item.name)) {
      state.anchoredItems.delete(item.name);
    } else {
      state.anchoredItems.add(item.name);
      state.excludedItems.delete(item.name);
    }
    saveAnchored();
    saveExcluded();
    // Re-render just this row
    const newRow = buildLibraryItemRow(item, category);
    row.parentNode.replaceChild(newRow, row);
    // Update summary
    const totalAnchored = state.anchoredItems.size;
    const totalExcluded = state.excludedItems.size;
    const totalItems    = Object.values(ITEMS).reduce((a, b) => a + b.length, 0);
    $('library-meta').textContent = `${totalItems} items · ${totalAnchored} anchored · ${totalExcluded} excluded`;
  });

  // Exclude button
  const excludeBtn = document.createElement('button');
  excludeBtn.className = 'lib-btn exclude-btn' + (isExcluded ? ' active' : '');
  excludeBtn.title = isExcluded ? 'Restore item' : "Never show — exclude";
  excludeBtn.innerHTML = isExcluded ? '↩' : '✕';
  excludeBtn.addEventListener('click', () => {
    if (state.excludedItems.has(item.name)) {
      state.excludedItems.delete(item.name);
    } else {
      state.excludedItems.add(item.name);
      state.anchoredItems.delete(item.name);
    }
    saveExcluded();
    saveAnchored();
    const newRow = buildLibraryItemRow(item, category);
    row.parentNode.replaceChild(newRow, row);
    const totalAnchored = state.anchoredItems.size;
    const totalExcluded = state.excludedItems.size;
    const totalItems    = Object.values(ITEMS).reduce((a, b) => a + b.length, 0);
    $('library-meta').textContent = `${totalItems} items · ${totalAnchored} anchored · ${totalExcluded} excluded`;
  });

  btns.appendChild(anchorBtn);
  btns.appendChild(excludeBtn);
  row.appendChild(info);
  row.appendChild(btns);
  return row;
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

function openCustomize() { $('panel-customize').hidden = false; updateSliders(); }
function closeCustomize() { $('panel-customize').hidden = true; }

// ── HEADCOUNT ──
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
  Object.entries(CAT_META).forEach(([category, meta]) => {
    const defaultVal = BOARD_SIZES[state.boardSize].itemsPerCategory;
    const currentVal = state.categoryLimits[category] !== undefined ? state.categoryLimits[category] : defaultVal;
    const row = document.createElement('div');
    row.className = 'slider-row';
    const label = document.createElement('span');
    label.className = 'slider-cat-name' + (currentVal === 0 ? ' zero' : '');
    label.textContent = `${meta.icon} ${meta.label}`;
    label.id = `slider-label-${category}`;
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'cat-slider';
    slider.min = 0; slider.max = 6; slider.step = 1; slider.value = currentVal;
    const valDisplay = document.createElement('span');
    valDisplay.className = 'slider-val' + (currentVal === 0 ? ' zero' : '');
    valDisplay.textContent = currentVal;
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

function updateSliders() { initSliders(); }

// ── SHARE ──
$('btn-share').addEventListener('click', async () => {
  const themes = state.selectedThemes.map(id => THEMES.find(t => t.id === id).label).join(', ');
  const lines = [`🧀 Omar's Board & Graze — ${themes}`, `${BOARD_SIZES[state.boardSize].label} · ${MEAL_ROLES[state.mealRole].label} · ${state.headCount} guests`, ''];
  Object.entries(state.currentBoard).forEach(([cat, items]) => {
    if (items.length > 0) {
      const prefix = items.map(i => (state.anchoredItems.has(i.name) ? '⚓ ' : '') + i.name).join(', ');
      lines.push(`${CAT_META[cat].icon} ${CAT_META[cat].label}: ${prefix}`);
    }
  });
  const text = lines.join('\n');
  if (navigator.share) {
    try { await navigator.share({ title: "Omar's Board & Graze", text }); } catch {}
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
  state.boardProfile    = 'classic';
  state.categoryLimits  = {};
  state.currentBoard    = {};
  // Anchors and excludes survive reset intentionally

  document.querySelectorAll('.size-btn').forEach(b => b.classList.toggle('active', b.dataset.size === 'M'));
  document.querySelectorAll('.role-btn').forEach(b => b.classList.toggle('active', b.dataset.role === 'main'));
  document.querySelectorAll('.profile-btn').forEach(b => b.classList.toggle('active', b.dataset.profile === 'classic'));

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
  initProfileButtons();
  initSliders();
  $('stepper-val').textContent = state.headCount;
  updateAnchorIndicator();
  const vEl = $('app-version');
  if (vEl) vEl.textContent = 'v' + APP_VERSION;
}

init();
