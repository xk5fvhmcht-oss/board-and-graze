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
  const levantineThemes = ['levantine','gulf','turkish','persian','northafrican','moroccan','armenian','egyptian'];
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

// ═══════════════════════════════════════════
// BOARD LAYOUT GUIDE — v1.4.0
// Numbers + icons, no item names on diagram
// ═══════════════════════════════════════════

// Distinct colors per category — no duplicates
const ZONE_COLORS = {
  meats:      { fill: '#f7ece0', stroke: '#c8784a', label: '#7a3a10' },
  cheeses:    { fill: '#fdf8e8', stroke: '#d4a830', label: '#7a5a0a' },
  spreads:    { fill: '#e8f2e8', stroke: '#6a9e6a', label: '#1a4a1a' },
  breads:     { fill: '#f8f0e4', stroke: '#b89060', label: '#5a3a10' },
  crackers:   { fill: '#f0ece0', stroke: '#a08858', label: '#4a3008' },
  fruits:     { fill: '#fde8e8', stroke: '#d07070', label: '#7a1a1a' },
  nuts:       { fill: '#ede4d0', stroke: '#9a7840', label: '#4a3000' },
  pickles:    { fill: '#deeede', stroke: '#509050', label: '#1a4a10' },
  vegetables: { fill: '#e4f4e4', stroke: '#70b870', label: '#1a5a1a' },
  extras:     { fill: '#f0e8f8', stroke: '#9868c0', label: '#40187a' },
};

// Numbered category order — consistent across all layouts
const CAT_ORDER = ['spreads','meats','cheeses','breads','crackers','fruits','nuts','pickles','vegetables','extras'];

// Layout zones per board size
// x,y = top-left corner as fraction of board dimensions
// w,h = width/height as fraction
// shape: rect | ramekin | organic | scatter
const LAYOUTS = {
  S: {
    boardShape: 'oval', boardW: 340, boardH: 220,
    zones: [
      { cat: 'spreads',    shape: 'ramekin', cx: 0.50, cy: 0.42, r: 0.09 },
      { cat: 'meats',      shape: 'rect',    x: 0.08,  y: 0.20,  w: 0.20, h: 0.30 },
      { cat: 'cheeses',    shape: 'rect',    x: 0.72,  y: 0.18,  w: 0.20, h: 0.32 },
      { cat: 'breads',     shape: 'rect',    x: 0.28,  y: 0.68,  w: 0.44, h: 0.20 },
      { cat: 'crackers',   shape: 'rect',    x: 0.08,  y: 0.58,  w: 0.16, h: 0.22 },
      { cat: 'fruits',     shape: 'organic', x: 0.74,  y: 0.55,  w: 0.16, h: 0.30 },
      { cat: 'nuts',       shape: 'scatter', x: 0.74,  y: 0.20,  w: 0.14, h: 0.20 },
      { cat: 'pickles',    shape: 'scatter', x: 0.08,  y: 0.54,  w: 0.16, h: 0.14 },
      { cat: 'vegetables', shape: 'rect',    x: 0.32,  y: 0.16,  w: 0.18, h: 0.22 },
      { cat: 'extras',     shape: 'rect',    x: 0.54,  y: 0.16,  w: 0.14, h: 0.18 },
    ]
  },
  M: {
    boardShape: 'oval', boardW: 380, boardH: 260,
    zones: [
      { cat: 'spreads',    shape: 'ramekin', cx: 0.36, cy: 0.44, r: 0.085 },
      { cat: 'spreads',    shape: 'ramekin', cx: 0.62, cy: 0.44, r: 0.085 },
      { cat: 'meats',      shape: 'rect',    x: 0.06,  y: 0.16,  w: 0.22, h: 0.36 },
      { cat: 'cheeses',    shape: 'rect',    x: 0.72,  y: 0.14,  w: 0.22, h: 0.38 },
      { cat: 'breads',     shape: 'rect',    x: 0.24,  y: 0.70,  w: 0.26, h: 0.20 },
      { cat: 'crackers',   shape: 'rect',    x: 0.52,  y: 0.70,  w: 0.22, h: 0.20 },
      { cat: 'fruits',     shape: 'organic', x: 0.72,  y: 0.56,  w: 0.18, h: 0.30 },
      { cat: 'nuts',       shape: 'scatter', x: 0.06,  y: 0.58,  w: 0.16, h: 0.16 },
      { cat: 'pickles',    shape: 'scatter', x: 0.72,  y: 0.10,  w: 0.18, h: 0.16 },
      { cat: 'vegetables', shape: 'rect',    x: 0.32,  y: 0.12,  w: 0.22, h: 0.22 },
      { cat: 'extras',     shape: 'rect',    x: 0.56,  y: 0.12,  w: 0.14, h: 0.18 },
    ]
  },
  L: {
    boardShape: 'rect', boardW: 420, boardH: 300,
    zones: [
      { cat: 'spreads',    shape: 'ramekin', cx: 0.28, cy: 0.42, r: 0.075 },
      { cat: 'spreads',    shape: 'ramekin', cx: 0.50, cy: 0.42, r: 0.075 },
      { cat: 'spreads',    shape: 'ramekin', cx: 0.72, cy: 0.42, r: 0.075 },
      { cat: 'meats',      shape: 'rect',    x: 0.04,  y: 0.08,  w: 0.22, h: 0.44 },
      { cat: 'cheeses',    shape: 'rect',    x: 0.74,  y: 0.08,  w: 0.22, h: 0.44 },
      { cat: 'breads',     shape: 'rect',    x: 0.04,  y: 0.66,  w: 0.28, h: 0.26 },
      { cat: 'crackers',   shape: 'rect',    x: 0.68,  y: 0.66,  w: 0.28, h: 0.26 },
      { cat: 'fruits',     shape: 'organic', x: 0.34,  y: 0.62,  w: 0.32, h: 0.30 },
      { cat: 'nuts',       shape: 'scatter', x: 0.04,  y: 0.56,  w: 0.20, h: 0.10 },
      { cat: 'pickles',    shape: 'scatter', x: 0.76,  y: 0.56,  w: 0.20, h: 0.10 },
      { cat: 'vegetables', shape: 'rect',    x: 0.28,  y: 0.06,  w: 0.44, h: 0.22 },
      { cat: 'extras',     shape: 'rect',    x: 0.36,  y: 0.32,  w: 0.28, h: 0.14 },
    ]
  }
};

// Get zone number for a category (1-based, from CAT_ORDER)
function zoneNumber(cat) { return CAT_ORDER.indexOf(cat) + 1; }

// Circled number characters ①–⑩
function circledNum(n) {
  const nums = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩'];
  return nums[n - 1] || String(n);
}

function drawBoardSVG(layout, board) {
  const { boardW, boardH, boardShape, zones } = layout;
  const pad = 22;
  const svgW = boardW + pad * 2;
  const svgH = boardH + pad * 2 + (boardShape === 'oval' ? 18 : 0);

  const boardFill = '#f5efe6';
  const boardStroke = '#c8b090';

  let svg = `<svg viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg" class="layout-board-svg">`;

  svg += `<defs>
    <filter id="bshadow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(44,31,14,0.18)"/>
    </filter>
    <filter id="zshadow">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="rgba(44,31,14,0.12)"/>
    </filter>
  </defs>`;

  const bx = pad, by = pad, bw = boardW, bh = boardH;

  // Board background
  if (boardShape === 'oval') {
    svg += `<ellipse cx="${bx+bw/2}" cy="${by+bh/2}" rx="${bw/2}" ry="${bh/2}"
      fill="${boardFill}" stroke="${boardStroke}" stroke-width="3" filter="url(#bshadow)"/>`;
    // Wood grain
    for (let i = 1; i < 6; i++) {
      const gy = by + (bh/6)*i;
      svg += `<line x1="${bx+30}" y1="${gy}" x2="${bx+bw-30}" y2="${gy}"
        stroke="${boardStroke}" stroke-width="0.6" opacity="0.25"/>`;
    }
    // Handle
    svg += `<ellipse cx="${bx+bw/2}" cy="${by+bh+14}" rx="22" ry="7"
      fill="${boardFill}" stroke="${boardStroke}" stroke-width="2"/>`;
  } else {
    svg += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="14"
      fill="${boardFill}" stroke="${boardStroke}" stroke-width="3" filter="url(#bshadow)"/>`;
    for (let i = 1; i < 7; i++) {
      const gy = by + (bh/7)*i;
      svg += `<line x1="${bx+14}" y1="${gy}" x2="${bx+bw-14}" y2="${gy}"
        stroke="${boardStroke}" stroke-width="0.6" opacity="0.25"/>`;
    }
  }

  // Track which categories we've already numbered (spreads can have multiple ramekins)
  const catNumbered = {};

  zones.forEach(zone => {
    const col = ZONE_COLORS[zone.cat] || { fill:'#f0ece8', stroke:'#c0b0a0', label:'#6b5540' };
    const num = zoneNumber(zone.cat);
    const icon = CAT_META[zone.cat]?.icon || '';
    const isFirstOfCat = !catNumbered[zone.cat];
    catNumbered[zone.cat] = true;

    if (zone.shape === 'ramekin') {
      const cx = pad + zone.cx * boardW;
      const cy = pad + zone.cy * boardH;
      const r  = zone.r * Math.min(boardW, boardH);
      // Outer ring
      svg += `<circle cx="${cx}" cy="${cy}" r="${r}"
        fill="${col.fill}" stroke="${col.stroke}" stroke-width="2" filter="url(#zshadow)"/>`;
      // Inner ring
      svg += `<circle cx="${cx}" cy="${cy}" r="${r*0.6}"
        fill="${col.fill}" stroke="${col.stroke}" stroke-width="1" opacity="0.5"/>`;
      // Number + icon stacked
      const fontSize = Math.max(10, r * 0.7);
      svg += `<text x="${cx}" y="${cy - r*0.08}" text-anchor="middle" dominant-baseline="middle"
        font-family="Lato,sans-serif" font-size="${fontSize}" font-weight="900"
        fill="${col.label}">${circledNum(num)}</text>`;
      if (r > 22) {
        svg += `<text x="${cx}" y="${cy + r*0.48}" text-anchor="middle" dominant-baseline="middle"
          font-size="${Math.max(8, r*0.55)}">${icon}</text>`;
      }

    } else {
      const zx = pad + zone.x * boardW;
      const zy = pad + zone.y * boardH;
      const zw = zone.w * boardW;
      const zh = zone.h * boardH;
      const cx = zx + zw/2;
      const cy = zy + zh/2;

      if (zone.shape === 'rect') {
        svg += `<rect x="${zx}" y="${zy}" width="${zw}" height="${zh}" rx="7"
          fill="${col.fill}" stroke="${col.stroke}" stroke-width="1.8" filter="url(#zshadow)"/>`;
      } else if (zone.shape === 'organic') {
        svg += `<ellipse cx="${cx}" cy="${cy}" rx="${zw/2}" ry="${zh/2}"
          fill="${col.fill}" stroke="${col.stroke}" stroke-width="1.8" filter="url(#zshadow)"/>`;
      } else if (zone.shape === 'scatter') {
        svg += `<rect x="${zx}" y="${zy}" width="${zw}" height="${zh}" rx="8"
          fill="${col.fill}" stroke="${col.stroke}" stroke-width="1.5" stroke-dasharray="4,2"/>`;
        // Scatter dots
        [[0.2,0.35],[0.5,0.25],[0.8,0.4],[0.35,0.7],[0.65,0.65]].slice(0,4).forEach(([dx,dy]) => {
          svg += `<circle cx="${zx+dx*zw}" cy="${zy+dy*zh}" r="2.5"
            fill="${col.stroke}" opacity="0.6"/>`;
        });
      }

      // Number circle badge — top left corner of zone
      const badgeR = Math.min(zw, zh) * 0.22;
      const badgeX = zx + badgeR + 4;
      const badgeY = zy + badgeR + 4;
      svg += `<circle cx="${badgeX}" cy="${badgeY}" r="${badgeR}"
        fill="${col.stroke}" opacity="0.9"/>`;
      svg += `<text x="${badgeX}" y="${badgeY}" text-anchor="middle" dominant-baseline="middle"
        font-family="Lato,sans-serif" font-size="${Math.max(7, badgeR*1.1)}" font-weight="900"
        fill="white">${num}</text>`;

      // Icon centered in zone
      const iconSize = Math.min(zw, zh) * 0.45;
      if (iconSize >= 10) {
        svg += `<text x="${cx + badgeR*0.3}" y="${cy + 2}" text-anchor="middle" dominant-baseline="middle"
          font-size="${Math.max(10, iconSize)}">${icon}</text>`;
      }
    }
  });

  svg += '</svg>';
  return svg;
}

function buildAssemblySteps(board) {
  const hasLevantine = state.selectedThemes.some(t =>
    ['levantine','gulf','turkish','persian','northafrican','moroccan','armenian','egyptian'].includes(t)
  );
  const steps = [
    {
      title: 'Start with ramekins',
      body: 'Place your small bowls first. They anchor the board — everything builds around them.',
      items: board.spreads?.map(i => i.name).join(', ') || ''
    },
    {
      title: 'Place your cheeses',
      body: 'Set cheeses at different points. Soft cheeses near center, hard cheeses toward edges. Leave space around each for guests to cut.',
      items: board.cheeses?.map(i => i.name).join(', ') || ''
    },
    {
      title: 'Layer in the meats',
      body: 'Fan sliced meats near the cheeses. Fold mortadella and bologna into roses. Stack basturma and sujuk in small piles.',
      items: board.meats?.map(i => i.name).join(', ') || ''
    },
    {
      title: 'Fill the edges with bread & crackers',
      body: hasLevantine
        ? 'Tuck pita wedges and lavash along the edges — these are your scoops. Stack crackers separately in a corner.'
        : "Arrange crackers and bread slices along the board edges. Fan them out so they're easy to grab.",
      items: [...(board.breads?.map(i=>i.name)||[]), ...(board.crackers?.map(i=>i.name)||[])].join(', ')
    },
    {
      title: 'Add fruits for color',
      body: 'Cluster grapes in one corner. Scatter dates and dried fruits near cheeses. Stack sliced pear or figs for height.',
      items: board.fruits?.map(i => i.name).join(', ') || ''
    },
    {
      title: 'Scatter nuts and pickles',
      body: 'Nuts fill gaps anywhere. Pickles and olives go near meats. Pink pickled turnips near labneh for color contrast.',
      items: [...(board.nuts?.map(i=>i.name)||[]), ...(board.pickles?.map(i=>i.name)||[])].join(', ')
    },
    {
      title: 'Add vegetables along the rim',
      body: 'Line crisp vegetables along the board edge near dips. Persian cucumbers and radishes add structure and color.',
      items: board.vegetables?.map(i => i.name).join(', ') || ''
    },
    {
      title: 'Finish with extras',
      body: "Drizzle honey near aged cheeses. Place za'atar and sumac near bread and labneh. Small touches where the board looks bare.",
      items: board.extras?.map(i => i.name).join(', ') || ''
    },
    {
      title: 'Presentation layer',
      body: "Tuck fresh herb sprigs between sections. Add edible flowers if you found them. Honeycomb near an aged cheese.",
      items: 'Rosemary, thyme, edible flowers, honeycomb — see Presentation section on your board'
    }
  ];
  return steps.filter(s => s.items.length > 0 || s.title === 'Presentation layer');
}

function renderLayoutGuide() {
  const main = $('layout-main');
  main.innerHTML = '';

  const layout = LAYOUTS[state.boardSize];
  const board  = state.currentBoard;

  $('layout-meta').textContent = `${BOARD_SIZES[state.boardSize].label} · ${state.selectedThemes.map(id => THEMES.find(t=>t.id===id)?.label).join(', ')}`;

  // ── SVG DIAGRAM ──
  const wrap = document.createElement('div');
  wrap.className = 'layout-board-wrap';
  wrap.innerHTML = drawBoardSVG(layout, board);
  main.appendChild(wrap);

  // ── NUMBERED LEGEND ──
  const legendLabel = document.createElement('div');
  legendLabel.className = 'layout-section-label';
  legendLabel.textContent = 'Zone reference';
  main.appendChild(legendLabel);

  const legend = document.createElement('div');
  legend.className = 'layout-legend';
  const legendGrid = document.createElement('div');
  legendGrid.className = 'layout-legend-grid';
  legendGrid.style.gridTemplateColumns = '1fr';
  legendGrid.style.gap = '6px';

  CAT_ORDER.forEach((cat, i) => {
    const col  = ZONE_COLORS[cat];
    const meta = CAT_META[cat];
    const items = (board[cat] || []).map(item => item.name).join(', ');
    if (!items) return;

    const row = document.createElement('div');
    row.className = 'layout-legend-item';
    row.style.cssText = 'align-items:flex-start; gap:10px; padding:6px 0; border-bottom:1px dashed var(--border);';
    row.innerHTML = `
      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;min-width:52px;">
        <div style="width:22px;height:22px;border-radius:50%;background:${col.stroke};
          display:flex;align-items:center;justify-content:center;
          font-size:11px;font-weight:900;color:white;flex-shrink:0;">${i+1}</div>
        <span style="font-size:18px;line-height:1;">${meta.icon}</span>
      </div>
      <div style="flex:1;">
        <div style="font-size:12px;font-weight:700;color:var(--ink);margin-bottom:2px;">${meta.label}</div>
        <div style="font-size:11px;color:var(--ink-muted);line-height:1.4;">${items}</div>
      </div>
    `;
    legendGrid.appendChild(row);
  });

  legend.appendChild(legendGrid);
  main.appendChild(legend);

  // ── ASSEMBLY STEPS ──
  const stepsLabel = document.createElement('div');
  stepsLabel.className = 'layout-section-label';
  stepsLabel.textContent = 'How to build it — step by step';
  main.appendChild(stepsLabel);

  const tips = document.createElement('div');
  tips.className = 'layout-tips';
  buildAssemblySteps(board).forEach((step, i) => {
    const card = document.createElement('div');
    card.className = 'layout-tip-card';
    card.innerHTML = `
      <div class="layout-tip-step">${i+1}</div>
      <div class="layout-tip-content">
        <div class="layout-tip-title">${step.title}</div>
        <div class="layout-tip-body">${step.body}</div>
        ${step.items ? `<div class="layout-tip-items">Your board: ${step.items}</div>` : ''}
      </div>
    `;
    tips.appendChild(card);
  });
  main.appendChild(tips);

  // ── GENERAL PRINCIPLES ──
  const genLabel = document.createElement('div');
  genLabel.className = 'layout-section-label';
  genLabel.textContent = 'General principles';
  main.appendChild(genLabel);

  const genList = document.createElement('div');
  genList.className = 'layout-tips';
  [
    ['🌡️', 'Pull meats and cheeses from the fridge 30–45 minutes before serving. Cold kills flavor.'],
    ['📐', 'Odd numbers look better than even. Three cheese wedges, five olive clusters.'],
    ['🎨', 'Think in color — dark olives next to pale labneh, pink turnips next to white cheese.'],
    ['📏', 'Vary the height. Stack crackers, fold meats, leave whole figs uncut for visual drama.'],
    ["🏷️", "Label anything unfamiliar. Guests appreciate knowing what they're about to try."],
    ["🫙", "Fill the board completely — gaps make it look unfinished. Nuts and herbs are your gap-fillers."],
  ].forEach(([icon, tip]) => {
    const card = document.createElement('div');
    card.className = 'layout-tip-card';
    card.innerHTML = `
      <div class="layout-tip-step" style="background:var(--ink-muted);font-size:14px;">${icon}</div>
      <div class="layout-tip-content"><div class="layout-tip-body">${tip}</div></div>
    `;
    genList.appendChild(card);
  });
  main.appendChild(genList);
}

// Navigation
screens.layout = $('screen-layout');
$('btn-layout').addEventListener('click', () => { renderLayoutGuide(); showScreen('layout'); });
$('btn-back-layout').addEventListener('click', () => showScreen('board'));
$('btn-print-layout').addEventListener('click', () => window.print());