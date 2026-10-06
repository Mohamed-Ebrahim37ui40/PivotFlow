const PI = Math.PI;

// ===== Always English (Latin) digits, whatever the language =====
function toLatin(str) {
  return String(str)
    .replace(/[\u0660-\u0669]/g, d => d.charCodeAt(0) - 0x0660)
    .replace(/[\u06F0-\u06F9]/g, d => d.charCodeAt(0) - 0x06F0)
    .replace(/[\u066B\u060C]/g, '.')
    .replace(/\u066C/g, '');
}
function num(v) { return parseFloat(toLatin(v)); }
function fixDigits(el) {
  const v = toLatin(el.value);
  if (v !== el.value) el.value = v;
}
const MAX_WHEELS = 20; // safety cap for UI
let currentNumWheels = 9; // updated from area / tower / track width

// Custom spans array (null = not using custom)
let customSpansPerWheel = null; // array of numbers, length = currentNumWheels

const i18n = {
  en: {
    dir: 'ltr', lang: 'en', btn: 'ع',
    title: 'Pivot Area Calculator',
    subtitle: 'Tracks per wheel = Common tower length ÷ Track width',
    inputs: '📌 Inputs',
    brand: 'Pivot Brand',
    area: 'Pivot Area (Feddan)',
    spanwidth: 'Track Width (m)',
    totalspans: '📊 Total Tracks for Half Pivot',
    radius: 'Radius (m)',
    tower: 'Tower Length (m)',
    spansper: 'Tracks per Wheel',
    perwheel: '📋 Area per Wheel',
    autofill: '⚡ Auto-fill',
    clear: '🗑️ Clear',
    colWheel: 'Wheel #',
    colSpans: 'Number of tracks',
    colArea: 'Wheel Area (Feddan)',
    total: 'Total',
    note: 'Tracks/wheel = Common tower length ÷ Track width<br>Last wheel takes the remaining tracks from total area',
    wheel: 'Wheel',
    alertMax: 'Wheel {n}: maximum tracks is {m}',
    warnTitle: '⚠️ Warning',
    warnOk: 'OK',
    customTitle: 'Custom Tracks per Wheel',
    customSub: 'Enter tracks or tower length for each wheel',
    customH2: '⚙️ Tracks / Tower length per wheel',
    customSave: '💾 Save & Return',
    customCancel: 'Cancel',
    customNote: 'Uses main page data (area, total tracks, radius, track width). Auto-fill uses 54 m tower length. Last wheel = remaining from half pivot.',
    customMode: 'Input mode',
    customName: 'Brand name',
    defaultBrandName: 'My brand',
    deleteBrand: '🗑️ Delete',
    confirmDelete: 'Delete this brand?',
    customAutofill: '⚡ Auto-fill',
    customClear: '🗑️ Clear',
    alertRemaining: 'Last wheel must be the remaining value: {v}',
    plantTitle: '🌱 Planting',
    avgJumbo: 'Average jumbo weight (kg)',
    totalJumbos: 'Total number of jumbos',
    seedQty: 'Total seed planted (ton)',
    plantRate: 'Planting rate (ton / feddan)',
    plantNote: 'Seed (ton) = jumbos × weight (kg) ÷ 1000 · Rate = seed ÷ total area',
    harvestTitle: '🚜 Harvest',
    harvested: 'Harvested jumbos',
    harvestRate: 'Harvest rate (jumbos / feddan)',
    harvestNote: 'Harvest rate = harvested jumbos ÷ total area',
    footerDesign: '<strong>Design:</strong> Eng. Mohamed Ibrahim (Fermineo)',
    footerEq: 'Equations based on the Biro equation'
  },
  ar: {
    dir: 'rtl', lang: 'ar', btn: 'EN',
    title: 'حاسبة مساحة البيفوت',
    subtitle: 'عدد الجرر لكل عجلة = الطول الشائع للبرج ÷ عرض الجرة',
    inputs: '📌 المدخلات',
    brand: 'البيفوت (الماركة)',
    area: 'مساحة البيفوت (فدان)',
    spanwidth: 'عرض الجرة (متر)',
    totalspans: '📊 إجمالي عدد الجرر لنصف البيفوت',
    radius: 'نصف القطر (متر)',
    tower: 'طول البرج (متر)',
    spansper: 'عدد الجرر لكل عجلة',
    perwheel: '📋 مساحة كل عجلة',
    autofill: '⚡ تعبئة تلقائية',
    clear: '🗑️ مسح',
    colWheel: 'رقم العجلة',
    colSpans: 'عدد الجرر',
    colArea: 'مساحة العجلة (فدان)',
    total: 'الإجمالي',
    note: 'عدد الجرر/عجلة = الطول الشائع للبرج ÷ عرض الجرة<br>العجلة الأخيرة تأخذ الباقي من إجمالي المساحة',
    wheel: 'العجلة',
    alertMax: 'العجلة {n}: الحد الأقصى لعدد الجرر هو {m}',
    warnTitle: '⚠️ تنبيه',
    warnOk: 'حسناً',
    customTitle: 'عدد الجرر المخصص لكل عجلة',
    customSub: 'أدخل عدد الجرر أو طول البرج لكل عجلة',
    customH2: '⚙️ عدد الجرر / طول البرج لكل عجلة',
    customSave: '💾 حفظ والرجوع',
    customCancel: 'إلغاء',
    customNote: 'تعتمد على بيانات الصفحة الرئيسية (المساحة، إجمالي الجرر، نصف القطر، عرض الجرة). التعبئة التلقائية بطول برج 54 م. العجلة الأخيرة = المتبقي من نصف البيفوت.',
    customMode: 'طريقة الإدخال',
    customName: 'اسم الماركة',
    defaultBrandName: 'ماركتي',
    deleteBrand: '🗑️ حذف الماركة',
    confirmDelete: 'حذف هذه الماركة؟',
    customAutofill: '⚡ تعبئة تلقائية',
    customClear: '🗑️ مسح',
    alertRemaining: 'العجلة الأخيرة يجب أن تكون القيمة المتبقية: {v}',
    plantTitle: '🌱 الزراعة',
    avgJumbo: 'متوسط وزن الجامبو (كجم)',
    totalJumbos: 'إجمالي عدد الجامبوهات',
    seedQty: 'إجمالي كمية التقاوي المنزرعة (طن)',
    plantRate: 'معدل الزراعة (طن / فدان)',
    plantNote: 'التقاوي (طن) = عدد الجامبوهات × الوزن (كجم) ÷ 1000 · المعدل = التقاوي ÷ إجمالي المساحة',
    harvestTitle: '🚜 الحصاد',
    harvested: 'عدد الجامبوهات المحصودة',
    harvestRate: 'معدل الحصاد (جامبو / فدان)',
    harvestNote: 'معدل الحصاد = عدد الجامبوهات المحصودة ÷ إجمالي المساحة',
    footerDesign: '<strong>تصميم:</strong> مهندس محمد إبراهيم (فرمينيو)',
    footerEq: 'المعادلات مبنية على معادلة بيرو'
  }
};

let currentLang = 'en';
let currentTheme = 'light';
try { currentTheme = localStorage.getItem('pivot-theme') || 'light'; } catch (e) {}

function toggleLang() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  applyLang();
  recalculate();
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme();
}

function applyTheme() {
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('themeBtn').textContent = '☀️';
    document.getElementById('themeBtn').title = 'Light mode';
  } else {
    document.documentElement.removeAttribute('data-theme');
    document.getElementById('themeBtn').textContent = '🌙';
    document.getElementById('themeBtn').title = 'Dark mode';
  }
  try { localStorage.setItem('pivot-theme', currentTheme); } catch (e) {}
}

function applyLang() {
  const t = i18n[currentLang];
  document.documentElement.lang = t.lang;
  document.documentElement.dir = t.dir;
  document.getElementById('langBtn').textContent = t.btn;
  document.getElementById('t-title').textContent = t.title;
  document.getElementById('t-subtitle').textContent = t.subtitle;
  document.getElementById('t-inputs').textContent = t.inputs;
  document.getElementById('t-brand').textContent = t.brand;
  document.getElementById('t-area').textContent = t.area;
  document.getElementById('t-spanwidth').textContent = t.spanwidth;
  document.getElementById('t-totalspans').textContent = t.totalspans;
  document.getElementById('t-radius').textContent = t.radius;
  document.getElementById('t-tower').textContent = t.tower;
  document.getElementById('t-spansper').textContent = t.spansper;
  document.getElementById('t-perwheel').textContent = t.perwheel;
  document.getElementById('t-autofill').textContent = t.autofill;
  document.getElementById('t-clear').textContent = t.clear;
  document.getElementById('t-col-wheel').textContent = t.colWheel;
  document.getElementById('t-col-spans').textContent = t.colSpans;
  document.getElementById('t-col-area').textContent = t.colArea;
  document.getElementById('t-total').textContent = t.total;
  document.getElementById('t-note').innerHTML = t.note;
  // custom panel
  document.getElementById('t-custom-title').textContent = t.customTitle;
  document.getElementById('t-custom-sub').textContent = t.customSub;
  document.getElementById('t-custom-h2').textContent = t.customH2;
  document.getElementById('t-custom-save').textContent = t.customSave;
  document.getElementById('t-custom-cancel').textContent = t.customCancel;
  document.getElementById('t-custom-autofill').textContent = t.customAutofill;
  document.getElementById('t-custom-clear').textContent = t.customClear;
  document.getElementById('t-custom-note').textContent = t.customNote;
  document.getElementById('t-custom-mode').textContent = t.customMode;
  document.getElementById('t-custom-name').textContent = t.customName;
  document.getElementById('deleteBrandBtn').textContent = t.deleteBrand;
  document.getElementById('t-footer-design').innerHTML = t.footerDesign;
  document.getElementById('t-footer-eq').textContent = t.footerEq;
  document.getElementById('t-plant-title').textContent = t.plantTitle;
  document.getElementById('t-avg-jumbo').textContent = t.avgJumbo;
  document.getElementById('t-total-jumbos').textContent = t.totalJumbos;
  document.getElementById('t-seed-qty').textContent = t.seedQty;
  document.getElementById('t-plant-rate').textContent = t.plantRate;
  document.getElementById('t-plant-note').textContent = t.plantNote;
  document.getElementById('t-harvest-title').textContent = t.harvestTitle;
  document.getElementById('t-harvested').textContent = t.harvested;
  document.getElementById('t-harvest-rate').textContent = t.harvestRate;
  document.getElementById('t-harvest-note').textContent = t.harvestNote;
  const modeSel = document.getElementById('customMode');
  if (modeSel) {
    for (let i = 0; i < modeSel.options.length; i++) {
      const opt = modeSel.options[i];
      const label = opt.getAttribute('data-' + currentLang);
      if (label) opt.textContent = label;
    }
  }
  // brand options
  const brandSel = document.getElementById('pivotBrand');
  for (let i = 0; i < brandSel.options.length; i++) {
    const opt = brandSel.options[i];
    const label = opt.getAttribute('data-' + currentLang);
    if (label) opt.textContent = label;
  }
  buildTable();
  if (!document.getElementById('customPanel').classList.contains('hidden')) {
    customUserSpans = captureUserAsSpans(customInputMode); // keep unsaved edits when switching language
  }
  buildCustomGrid();
}

const INFO = {
  en: { title: '💡 About the App', body: `
    <p><strong>Pivot Area Calculator</strong> is a specialized calculator for distributing tracks (spans) across the wheels of Center Pivot irrigation systems.</p>
    <p>It uses the <strong>Biro equation</strong> to compute the area of each wheel based on its distance from the pivot center.</p>
    <ul>
      <li>Enter the pivot area in feddans</li>
      <li>Choose the brand (Valley / Zimmatic / Western) or customize</li>
      <li>Radius and total tracks are calculated automatically (whole numbers)</li>
      <li>Use Auto-fill, or type the tracks of each wheel — areas update instantly</li>
      <li>The last wheel takes the remaining tracks</li>
    </ul>
    <p>The app can be installed and works offline.</p>` },
  ar: { title: '💡 فكرة البرنامج', body: `
    <p><strong>حاسبة مساحة البيفوت</strong> حاسبة متخصصة لتوزيع الجرر على عجلات أجهزة الري المحوري (Center Pivot).</p>
    <p>تعتمد على <strong>معادلة بيرو</strong> لحساب مساحة كل عجلة بناءً على بعدها عن مركز البيفوت.</p>
    <ul>
      <li>أدخل مساحة البيفوت بالفدان</li>
      <li>اختر الماركة (فالي / زيماتيك / ويستيرن) أو خصص بنفسك</li>
      <li>يُحسب نصف القطر وإجمالي الجرر تلقائياً (أرقام صحيحة)</li>
      <li>استخدم التعبئة التلقائية أو اكتب جرر كل عجلة — تُحسب المساحات فوراً</li>
      <li>العجلة الأخيرة تأخذ المتبقي من الجرر</li>
    </ul>
    <p>يمكن تثبيت التطبيق وهو يعمل دون اتصال بالإنترنت.</p>` }
};
function showInfo() {
  document.getElementById('infoTitle').textContent = INFO[currentLang].title;
  document.getElementById('infoBody').innerHTML = INFO[currentLang].body;
  document.getElementById('infoModal').classList.add('active');
}
function closeInfo() { document.getElementById('infoModal').classList.remove('active'); }
function showVerse() { document.getElementById('verseModal').classList.add('active'); }
function closeVerse() { document.getElementById('verseModal').classList.remove('active'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeInfo(); closeVerse(); closeWarn(); } });

function t(key) { return i18n[currentLang][key] || key; }

function isCustomMode() {
  const v = document.getElementById('pivotBrand').value;
  return v === 'custom' || v.indexOf('saved:') === 0;
}

function getTowerLength() {
  if (isCustomMode()) return 0;
  const sel = document.getElementById('pivotBrand');
  return num(sel.options[sel.selectedIndex].getAttribute('data-length')) || 54;
}

function getSpanWidth() {
  return num(document.getElementById('spanWidth').value) || 1.8;
}

/** Wheel rows: always at least 9 (original design); grow only if area needs more */
function getNeededWheels(totalSpans) {
  const MIN_WHEELS = 9;
  totalSpans = Math.round(totalSpans || 0);
  if (totalSpans <= 0) return MIN_WHEELS;
  if (isCustomMode() && customUserSpans) {
    let L = -1;
    for (let i = 0; i < customUserSpans.length; i++) if ((customUserSpans[i] || 0) > 0) L = i;
    const fromUser = Math.min(MAX_WHEELS, Math.max(MIN_WHEELS, L + 2));
    const estBase = Math.max(1, Math.round(54 / getSpanWidth()));
    const fromArea = Math.min(MAX_WHEELS, Math.max(MIN_WHEELS, Math.ceil(totalSpans / estBase)));
    return Math.max(fromUser, fromArea);
  }
  const base = Math.max(1, Math.round(getTowerLength() / getSpanWidth()));
  // UI shows 9 by default; adds rows only when total tracks exceed 9 full towers
  return Math.min(MAX_WHEELS, Math.max(MIN_WHEELS, Math.ceil(totalSpans / base)));
}

/** Returns array of base spans per wheel (length = needed wheels) */
function getBaseSpansArray(totalSpans) {
  const n = getNeededWheels(totalSpans);
  if (isCustomMode() && (customSpansPerWheel || customUserSpans)) {
    customSpansPerWheel = computeCustomArray(totalSpans, n);
    return customSpansPerWheel.slice();
  }
  // Standard: each wheel gets towerLen/spanWidth, last takes remainder
  const base = Math.max(1, Math.round(getTowerLength() / getSpanWidth()));
  totalSpans = Math.round(totalSpans);
  const arr = [];
  let remaining = totalSpans;
  for (let i = 0; i < n; i++) {
    if (remaining <= 0) { arr.push(0); continue; }
    let take = (i === n - 1) ? remaining : Math.min(base, remaining);
    arr.push(take);
    remaining -= take;
  }
  return arr;
}

function getRadius(area) {
  return Math.sqrt(area * 4200 / PI);
}

function cumulativeArea(area, radius, distance) {
  if (distance <= 0) return 0;
  const effectiveDist = Math.min(distance, radius);
  const ratio = Math.min(1, Math.max(-1, effectiveDist / radius));
  const angleDeg = Math.asin(ratio) * (180 / PI);
  const cosVal = Math.cos(angleDeg * PI / 180);
  const g = (radius - distance >= 0) ? (cosVal * radius) : 0;
  return (2 * angleDeg * area / 360) + (g * distance / 4200);
}

function getBaseAreas(area, radius, spanWidth, totalSpans, baseSpansArr) {
  const n = baseSpansArr.length || currentNumWheels;
  const baseAreas = new Array(n).fill(0);
  const baseCounts = new Array(n).fill(0);
  let cumulSpans = 0, prevCumul = 0;
  for (let i = 0; i < n; i++) {
    const take = baseSpansArr[i] || 0;
    if (take <= 0) continue;
    cumulSpans += take;
    const dist = cumulSpans * spanWidth;
    const cumul = cumulativeArea(area, radius, dist);
    baseAreas[i] = Math.max(0, cumul - prevCumul);
    baseCounts[i] = take;
    prevCumul = cumul;
  }
  getBaseAreas._counts = baseCounts;
  return baseAreas;
}

function buildTable(forceN) {
  const area = num(document.getElementById('pivotArea').value) || 0;
  const totalSpans = getRadius(area) / getSpanWidth();
  const n = forceN || getNeededWheels(totalSpans);
  currentNumWheels = n;
  const tbody = document.getElementById('tableBody');
  const wheelWord = t('wheel');
  const saved = {};
  for (let i = 1; i <= MAX_WHEELS; i++) {
    const el = document.getElementById('spans' + i);
    if (el) saved[i] = el.value;
  }
  tbody.innerHTML = '';
  for (let i = 1; i <= n; i++) {
    const tr = document.createElement('tr');
    if (i === n) tr.classList.add('wheel-last');
    tr.innerHTML = `
      <td><strong>${wheelWord} ${i}</strong></td>
      <td><input type="text" inputmode="numeric" lang="en" dir="ltr" id="spans${i}" value="${saved[i] || ''}" min="0" step="0.1" oninput="onSpansInput(${i}, this)"></td>
      <td id="area${i}">—</td>
    `;
    tbody.appendChild(tr);
  }
}

let customInputMode = 'spans'; // 'spans' | 'length'
let customUserSpans = null;    // tracks typed by the user (numbers), remainder is never stored
let customRemIdx = 0;          // row that currently holds the remainder

function modeNow() {
  const m = document.getElementById('customMode');
  return m ? m.value : 'spans';
}

function getMainTotals() {
  const area = num(document.getElementById('pivotArea').value) || 0;
  const spanWidth = getSpanWidth();
  const radius = getRadius(area);
  const totalSpans = radius / spanWidth;
  return { area, spanWidth, radius, totalSpans };
}

function totalInMode() {
  const { radius, totalSpans } = getMainTotals();
  return modeNow() === 'length' ? radius : Math.round(totalSpans);
}

function fmtVal(v) {
  return modeNow() === 'length' ? String(Math.round(v * 100) / 100) : String(Math.round(v));
}

/** User rows then remainder in the first free row after them (length = n) */
function computeCustomArray(total, nOpt) {
  const n = nOpt || currentNumWheels;
  const u = customUserSpans || [];
  let L = -1;
  for (let i = 0; i < n - 1; i++) if ((u[i] || 0) > 0) L = i;
  const arr = new Array(n).fill(0);
  let used = 0;
  for (let i = 0; i <= L; i++) { arr[i] = u[i] || 0; used += arr[i]; }
  const remIdx = Math.min(L + 1, n - 1);
  arr[remIdx] = Math.max(0, Math.round(total) - used);
  return arr;
}

/** Values typed by the user in the panel (null = empty / auto remainder) */
function readUser() {
  const n = currentNumWheels;
  const out = [];
  for (let i = 0; i < n; i++) {
    const el = document.getElementById('customSpan' + i);
    if (!el || i === n - 1 || el.dataset.auto === '1' || el.disabled) { out.push(null); continue; }
    const raw = el.value.trim();
    out.push(raw === '' ? null : (num(raw) || 0));
  }
  return out;
}

/** Re-layout: the remainder always sits in the row right after the last filled row */
function refreshCustom() {
  const n = currentNumWheels;
  const u = readUser();
  let L = -1;
  for (let i = 0; i < n - 1; i++) if (u[i] !== null) L = i;
  const remIdx = Math.min(L + 1, n - 1);
  const used = u.reduce((acc, v) => acc + (v || 0), 0);
  const rem = Math.max(0, totalInMode() - used);
  const active = document.activeElement;
  for (let i = 0; i < n; i++) {
    const el = document.getElementById('customSpan' + i);
    if (!el) continue;
    const item = el.closest('.custom-item');
    item.classList.toggle('wheel-last', i === remIdx);
    el.style.background = (i === remIdx) ? 'var(--last-bg)' : '';
    if (i < remIdx) {
      el.disabled = false; el.readOnly = false; el.dataset.auto = '';
      item.style.opacity = '';
    } else if (i === remIdx) {
      el.disabled = false; el.readOnly = (i === n - 1);
      item.style.opacity = '';
      if (el !== active || el.dataset.auto === '1') {
        el.value = fmtVal(rem); el.dataset.auto = '1';
      }
    } else {
      el.disabled = true; el.value = ''; el.dataset.auto = '';
      item.style.opacity = '0.45';
    }
  }
  customRemIdx = remIdx;
}

function onCustomInputChange(idx) {
  const el = document.getElementById('customSpan' + idx);
  if (el.dataset.auto === '1') el.dataset.auto = ''; // user is overriding the remainder row
  refreshCustom();
}

function onCustomBlur(idx) {
  const el = document.getElementById('customSpan' + idx);
  if (idx < customRemIdx) {
    // don't allow more than what is left
    const u = readUser();
    const others = u.reduce((acc, v, i) => acc + (i === idx ? 0 : (v || 0)), 0);
    const maxV = Math.max(0, totalInMode() - others);
    const v = num(el.value);
    if (!isNaN(v) && v > maxV + 0.05) {
      alert(t('alertMax').replace('{n}', idx + 1).replace('{m}', fmtVal(maxV)));
      el.value = fmtVal(maxV);
    }
  }
  refreshCustom();
}

function captureUserAsSpans(mode) {
  const u = readUser();
  const w = getSpanWidth();
  return u.map(v => v === null ? 0 : (mode === 'length' ? Math.round(v / w) : Math.round(v)));
}

function onCustomModeChange() {
  customUserSpans = captureUserAsSpans(customInputMode); // customInputMode = previous mode
  buildCustomGrid();
}

function buildCustomGrid() {
  const { totalSpans } = getMainTotals();
  const n = getNeededWheels(totalSpans);
  currentNumWheels = n;
  const grid = document.getElementById('customGrid');
  const wheelWord = t('wheel');
  const mode = modeNow();
  customInputMode = mode;
  const w = getSpanWidth();
  const unit = mode === 'length' ? 'm' : '';
  grid.innerHTML = '';
  for (let i = 0; i < n; i++) {
    let val = '';
    const sp = customUserSpans && customUserSpans[i];
    if (sp > 0 && i < n - 1) val = mode === 'length' ? String(Math.round(sp * w * 100) / 100) : String(sp);
    const div = document.createElement('div');
    div.className = 'custom-item';
    div.innerHTML = `
      <label>${wheelWord} ${i + 1}</label>
      <input type="text" inputmode="decimal" lang="en" dir="ltr" id="customSpan${i}" value="${val}" placeholder="0"
        oninput="fixDigits(this);onCustomInputChange(${i})" onblur="onCustomBlur(${i})">
      <span class="unit">${unit}</span>
    `;
    grid.appendChild(div);
  }
  refreshCustom();
}

function autoFillCustom() {
  // Full 54 m towers first; the remainder lands in the very next row
  const { spanWidth, radius, totalSpans } = getMainTotals();
  const n = getNeededWheels(totalSpans);
  currentNumWheels = n;
  if (document.getElementById('customGrid').children.length !== n) buildCustomGrid();
  const mode = modeNow();
  const std = mode === 'length' ? 54 : Math.round(spanWidth > 0 ? 54 / spanWidth : 30);
  let remaining = mode === 'length' ? radius : Math.round(totalSpans);
  let i = 0;
  for (; i < n - 1; i++) {
    const el = document.getElementById('customSpan' + i);
    if (!el) continue;
    el.dataset.auto = '';
    if (remaining > std + 0.001) { el.value = fmtVal(std); remaining -= std; }
    else { el.value = ''; }
  }
  const last = document.getElementById('customSpan' + (n - 1));
  if (last) last.value = '';
  refreshCustom();
}

function clearCustom() {
  const n = currentNumWheels;
  for (let i = 0; i < n; i++) {
    const el = document.getElementById('customSpan' + i);
    if (!el) continue;
    el.value = ''; el.dataset.auto = '';
  }
  refreshCustom();
}

let editingBrandId = null;
let prevBrandValue = 'zimmatic';
let savedBrands = [];

function loadBrands() {
  try { savedBrands = JSON.parse(localStorage.getItem('pivot-brands') || '[]') || []; } catch (e) { savedBrands = []; }
}
function persistBrands() {
  try { localStorage.setItem('pivot-brands', JSON.stringify(savedBrands)); } catch (e) {}
}
function renderBrandOptions() {
  const sel = document.getElementById('pivotBrand');
  const current = sel.value;
  Array.from(sel.options).forEach(o => { if (o.dataset.saved) sel.removeChild(o); });
  const customOpt = Array.from(sel.options).find(o => o.value === 'custom');
  savedBrands.forEach(b => {
    const o = document.createElement('option');
    o.value = 'saved:' + b.id; o.dataset.saved = '1'; o.textContent = '★ ' + b.name;
    sel.insertBefore(o, customOpt);
  });
  if (Array.from(sel.options).some(o => o.value === current)) sel.value = current;
  updateEditBtn();
}
function updateEditBtn() {
  const v = document.getElementById('pivotBrand').value;
  document.getElementById('editBrandBtn').classList.toggle('hidden', v.indexOf('saved:') !== 0);
}
function findBrand(id) { return savedBrands.find(x => x.id === id); }

function showCustomPanel(editId) {
  editingBrandId = editId || null;
  const b = editId ? findBrand(editId) : null;
  customUserSpans = b ? b.user.slice() : null;
  document.getElementById('customName').value = b ? b.name : t('defaultBrandName');
  document.getElementById('deleteBrandBtn').classList.toggle('hidden', !b);
  document.getElementById('customMode').value = 'spans';
  buildCustomGrid();
  if (!b) autoFillCustom(); // start from the Zimmatic data of the main page
  document.getElementById('mainView').classList.add('hidden');
  document.getElementById('customPanel').classList.remove('hidden');
}

function editSavedBrand() {
  const v = document.getElementById('pivotBrand').value;
  if (v.indexOf('saved:') === 0) showCustomPanel(v.slice(6));
}

function deleteSavedBrand() {
  if (!editingBrandId) return;
  if (!confirm(t('confirmDelete'))) return;
  savedBrands = savedBrands.filter(x => x.id !== editingBrandId);
  persistBrands();
  editingBrandId = null;
  customSpansPerWheel = null; customUserSpans = null;
  renderBrandOptions();
  document.getElementById('pivotBrand').value = 'zimmatic';
  prevBrandValue = 'zimmatic';
  updateEditBtn();
  showMainView();
  recalculate();
}

function showMainView() {
  document.getElementById('customPanel').classList.add('hidden');
  document.getElementById('mainView').classList.remove('hidden');
}

function saveCustomSpans() {
  refreshCustom();
  customUserSpans = captureUserAsSpans(modeNow());
  customInputMode = modeNow();
  const name = document.getElementById('customName').value.trim() || t('defaultBrandName');
  let id = editingBrandId;
  const brand = id ? findBrand(id) : null;
  if (brand) { brand.name = name; brand.user = customUserSpans.slice(); }
  else { id = 'b' + Date.now().toString(36); savedBrands.push({ id, name, user: customUserSpans.slice() }); }
  persistBrands();
  editingBrandId = null;
  renderBrandOptions();
  const sel = document.getElementById('pivotBrand');
  sel.value = 'saved:' + id;
  prevBrandValue = sel.value;
  updateEditBtn();
  customSpansPerWheel = computeCustomArray(getMainTotals().totalSpans);
  showMainView();
  document.getElementById('towerLenOut').textContent = '—';
  autoFill(); // fills the main table from the new brand and shows the areas
}

function cancelCustom() {
  editingBrandId = null;
  document.getElementById('pivotBrand').value = prevBrandValue;
  updateEditBtn();
  showMainView();
  recalculate();
}

function onBrandChange() {
  const v = document.getElementById('pivotBrand').value;
  if (v === 'custom') { showCustomPanel(null); return; }
  if (v.indexOf('saved:') === 0) {
    const b = findBrand(v.slice(6));
    customUserSpans = b ? b.user.slice() : null;
    customSpansPerWheel = computeCustomArray(getMainTotals().totalSpans);
  } else {
    customSpansPerWheel = null;
    customUserSpans = null;
  }
  prevBrandValue = v;
  updateEditBtn();
  recalculate();
}

function autoFill() {
  const totalSpans = num(document.getElementById('totalSpansOut').textContent) || 0;
  const n = getNeededWheels(totalSpans);
  if (n !== currentNumWheels) buildTable(n);
  const baseArr = getBaseSpansArray(totalSpans);
  for (let i = 1; i <= currentNumWheels; i++) {
    const el = document.getElementById('spans' + i);
    if (!el) continue;
    const chunk = baseArr[i - 1] || 0;
    el.value = chunk > 0.001 ? String(Math.round(chunk)) : '';
  }
  recalculate();
}

function clearInputs() {
  for (let i = 1; i <= currentNumWheels; i++) {
    const el = document.getElementById('spans' + i);
    if (el) el.value = '';
  }
  recalculate();
}

/** Max tracks allowed in a wheel cell (from the selected brand / current area) */
function maxForRow(i) {
  const area = num(document.getElementById('pivotArea').value) || 0;
  const arr = getBaseSpansArray(getRadius(area) / getSpanWidth());
  return Math.round(arr[i - 1] || 0);
}

/** Typing in the main table: refuse values above the cell's maximum and warn */
function onSpansInput(i, el) {
  fixDigits(el);
  const v = num(el.value);
  if (el.value.trim() !== '' && !isNaN(v)) {
    const max = maxForRow(i);
    if (v > max + 0.05) {
      el.value = el.dataset.prev || '';
      showWarn(t('alertMax').replace('{n}', i).replace('{m}', max));
      recalculate();
      return;
    }
  }
  recalculate();
}

function showWarn(msg) {
  document.getElementById('warnTitle').textContent = t('warnTitle');
  document.getElementById('warnMsg').textContent = msg;
  document.getElementById('warnOk').textContent = t('warnOk');
  document.getElementById('warnModal').classList.add('active');
}
function closeWarn() { document.getElementById('warnModal').classList.remove('active'); }

function recalculate() {
  const area = num(document.getElementById('pivotArea').value) || 0;
  const spanWidth = getSpanWidth();
  const radius = getRadius(area);
  const totalSpansHalf = radius / spanWidth;
  const needed = getNeededWheels(totalSpansHalf);

  // Rebuild table when number of wheels changes with area / brand / width
  if (needed !== currentNumWheels || document.getElementById('tableBody').children.length !== needed) {
    buildTable(needed);
  }

  document.getElementById('radiusOut').textContent = radius.toFixed(3);
  document.getElementById('totalSpansOut').textContent = Math.round(totalSpansHalf);

  if (isCustomMode() && (customSpansPerWheel || customUserSpans)) {
    document.getElementById('towerLenOut').textContent = '—';
    document.getElementById('spansPerWheelOut').textContent = 'Custom';
  } else {
    const towerLen = getTowerLength();
    const base = Math.round(towerLen / spanWidth);
    document.getElementById('towerLenOut').textContent = towerLen.toFixed(1);
    document.getElementById('spansPerWheelOut').textContent = base;
  }

  const baseSpansArr = getBaseSpansArray(totalSpansHalf);
  const baseAreas = getBaseAreas(area, radius, spanWidth, totalSpansHalf, baseSpansArr);
  const baseCounts = getBaseAreas._counts || baseSpansArr;
  const rates = baseAreas.map((ba, idx) => ba / Math.max(0.001, baseCounts[idx] || 1));

  let sumArea = 0, sumSpans = 0;
  const lastWheel = currentNumWheels;

  for (let i = 1; i <= lastWheel; i++) {
    const spanEl = document.getElementById('spans' + i);
    const areaEl = document.getElementById('area' + i);
    if (!spanEl || !areaEl) continue;
    const raw = spanEl.value;
    const spans = num(raw) || 0;
    const maxForWheel = Math.round(baseCounts[i - 1] || 0);

    const enforceMax = true;

    if (enforceMax && raw !== '' && maxForWheel > 0 && spans > maxForWheel + 0.05) {
      areaEl.textContent = '—';
      if (!window._alerted) window._alerted = {};
      if (!window._alerted[i]) {
        showWarn(t('alertMax').replace('{n}', i).replace('{m}', maxForWheel));
        window._alerted[i] = true;
      }
    } else if (!raw && i === lastWheel && !isCustomMode()) {
      areaEl.textContent = '—';
      spanEl.dataset.prev = '';
      if (window._alerted) window._alerted[i] = false;
    } else {
      if (window._alerted) window._alerted[i] = false;
      spanEl.dataset.prev = raw;
      const groupArea = rates[i - 1] * spans;
      areaEl.textContent = spans > 0 ? groupArea.toFixed(4) : (raw === '' ? '—' : '0.0000');
      sumArea += groupArea;
      sumSpans += spans;
    }
  }

  document.getElementById('sumSpans').textContent = Math.round(sumSpans);
  document.getElementById('sumArea').textContent = sumArea.toFixed(4);
  calcAgri();
}

/** Planting + harvest outputs from persistent inputs and current total area */
function calcAgri() {
  const totalArea = num(document.getElementById('sumArea').textContent) || 0;
  const avgWt = num(document.getElementById('avgJumboWt').value); // kg
  const jumbos = num(document.getElementById('totalJumbos').value);
  const harvested = num(document.getElementById('harvestedJumbos').value);

  let seedTon = null;
  if (!isNaN(avgWt) && !isNaN(jumbos) && avgWt >= 0 && jumbos >= 0 &&
      document.getElementById('avgJumboWt').value.trim() !== '' &&
      document.getElementById('totalJumbos').value.trim() !== '') {
    seedTon = (jumbos * avgWt) / 1000;
    document.getElementById('seedQtyOut').textContent = seedTon.toFixed(4);
  } else {
    document.getElementById('seedQtyOut').textContent = '—';
  }

  if (seedTon !== null && totalArea > 0) {
    document.getElementById('plantRateOut').textContent = (seedTon / totalArea).toFixed(4);
  } else {
    document.getElementById('plantRateOut').textContent = '—';
  }

  if (!isNaN(harvested) && harvested >= 0 &&
      document.getElementById('harvestedJumbos').value.trim() !== '' && totalArea > 0) {
    document.getElementById('harvestRateOut').textContent = (harvested / totalArea).toFixed(4);
  } else {
    document.getElementById('harvestRateOut').textContent = '—';
  }
}


// ===== Official contact app/web opener =====
function openContact(event, el) {
  const appUrl = el.dataset.app;
  const fallback = el.dataset.fallback || el.href;
  if (!appUrl) return; // HTTPS universal/app links handle app-or-web routing themselves.
  event.preventDefault();
  let leftPage = false;
  const markHidden = () => { leftPage = true; };
  document.addEventListener('visibilitychange', markHidden, { once: true });
  window.location.href = appUrl;
  window.setTimeout(() => {
    if (!leftPage) window.location.href = fallback;
  }, 900);
}

/* ===== PWA installation ===== */
let deferredInstallPrompt = null;

function isAppInstalled() {
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  if (window.navigator.standalone === true) return true;
  return false;
}
function hideInstallBtn() {
  const btn = document.getElementById('installBtn');
  if (btn) btn.classList.remove('show');
}
function showInstallBtn() {
  if (isAppInstalled()) { hideInstallBtn(); return; }
  const btn = document.getElementById('installBtn');
  if (btn) btn.classList.add('show');
}
function markInstallHandled() {
  try { localStorage.setItem('pivot-installed', '1'); } catch (e) {}
  hideInstallBtn();
}
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  showInstallBtn();
});
window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  markInstallHandled();
});
function openInstallHelp() {
  const modal = document.getElementById('installModal');
  const body = document.getElementById('installHelpBody');
  const ua = navigator.userAgent || '';
  const ios = /iphone|ipad|ipod/i.test(ua);
  const android = /android/i.test(ua);
  const standalone = isAppInstalled();
  if (ios) {
    body.innerHTML = currentLang === 'ar'
      ? '<p><strong>تثبيت على iPhone / iPad</strong></p><ol><li>اضغط زر المشاركة <b>Share ⎙</b> في Safari.</li><li>اختر <b>إضافة إلى الشاشة الرئيسية</b>.</li><li>اضغط <b>إضافة</b>.</li></ol><p>بعد التثبيت يفتح التطبيق كبرنامج مستقل.</p>'
      : '<p><strong>Install on iPhone / iPad</strong></p><ol><li>Tap <b>Share ⎙</b> in Safari.</li><li>Select <b>Add to Home Screen</b>.</li><li>Tap <b>Add</b>.</li></ol><p>The app will open as a standalone application.</p>';
  } else if (android) {
    body.innerHTML = currentLang === 'ar'
      ? '<p><strong>تثبيت على Android</strong></p><p>إذا ظهر طلب التثبيت، وافق عليه. وإذا لم يظهر، افتح قائمة المتصفح <b>⋮</b> ثم اختر <b>تثبيت التطبيق</b> أو <b>إضافة إلى الشاشة الرئيسية</b>.</p>'
      : '<p><strong>Install on Android</strong></p><p>Accept the install prompt if shown. Otherwise open the browser menu <b>⋮</b> and choose <b>Install app</b> or <b>Add to Home screen</b>.</p>';
  } else {
    body.innerHTML = currentLang === 'ar'
      ? '<p><strong>تثبيت على Windows / سطح المكتب</strong></p><p>في Chrome أو Edge استخدم أيقونة التثبيت في شريط العنوان أو افتح القائمة واختر <b>Install app</b>.</p>'
      : '<p><strong>Install on Windows / Desktop</strong></p><p>In Chrome or Edge, use the install icon in the address bar or open the browser menu and choose <b>Install app</b>.</p>';
  }
  if (modal) modal.classList.add('active');
}
function closeInstallHelp() {
  const modal = document.getElementById('installModal');
  if (modal) modal.classList.remove('active');
}
async function triggerInstall() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    if (choice && choice.outcome === 'accepted') markInstallHandled();
    else showInstallBtn();
    return;
  }
  openInstallHelp();
}

if ('serviceWorker' in navigator && (location.protocol.startsWith('http') || location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}


loadBrands();
showInstallBtn();
renderBrandOptions();
applyTheme();
buildTable();
buildCustomGrid();
recalculate();
if (isAppInstalled()) hideInstallBtn();
