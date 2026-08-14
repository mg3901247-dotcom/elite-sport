/**
 * EliteSports Pro — Admin Panel v2.0
 * Backgrounds + Content + Bookings + Settings + Stats
 * localStorage — No backend
 */

"use strict";

const AdminPanel = (() => {

  const STORAGE_KEY = "esp_admin_config";
  const VISITS_KEY = "esp_visit_count";
  const HIDDEN_KEY = "esp_hidden_elements";
  const SETTINGS_KEY = "esp_site_settings";

  const ZONES = [
    { id: "body", label: "🌐 الموقع كله", selector: "body" },
    { id: "header", label: "📌 الهيدر", selector: "header" },
    { id: "activities", label: "⚽ قسم الأنشطة", selector: "#activities" },
    { id: "prices", label: "💰 قسم الأسعار", selector: "#prices" },
    { id: "registration", label: "📝 قسم التسجيل", selector: "#registration" },
    { id: "counter", label: "📊 قسم الإنجازات", selector: ".counter-section" },
    { id: "testimonials", label: "💬 آراء العملاء", selector: ".testimonials" },
    { id: "contact", label: "📞 قسم التواصل", selector: "#contact" },
    { id: "faq", label: "❓ الأسئلة الشائعة", selector: "#faq" },
    { id: "footer", label: "🦶 الفوتر", selector: "footer" },
    { id: "tables", label: "📋 كل الجداول", selector: ".activities-table, .prices-table" },
    { id: "cards", label: "🃏 كل الكروت", selector: ".offer-card, .testimonial, .counter-box, .faq-item" },
    { id: "loading", label: "⏳ شاشة التحميل", selector: "#loading-screen" },
    { id: "gallery", label: "🖼️ صفحة المعرض", selector: ".gallery-page" },
  ];

  const HIDABLE_SECTIONS = [
    { id: "header", label: "📌 الهيدر", selector: "header" },
    { id: "activities", label: "⚽ قسم الأنشطة", selector: "#activities" },
    { id: "prices", label: "💰 قسم الأسعار", selector: "#prices" },
    { id: "offers", label: "🎁 قسم العروض", selector: ".container" },
    { id: "registration", label: "📝 قسم التسجيل", selector: "#registration" },
    { id: "math", label: "🔢 الحساب الذهني", selector: "#math" },
    { id: "counter", label: "📊 قسم الإنجازات", selector: ".counter-section" },
    { id: "testimonials", label: "💬 آراء العملاء", selector: ".testimonials" },
    { id: "contact", label: "📞 قسم التواصل", selector: "#contact" },
    { id: "faq", label: "❓ الأسئلة الشائعة", selector: "#faq" },
    { id: "footer", label: "🦶 الفوتر", selector: "footer" },
    { id: "ticker", label: "📰 شريط الأخبار", selector: "#sportsTicker" },
    { id: "coaches", label: "👨‍🏫 قسم المدربين", selector: ".esp-coaches-section" },
  ];

  const PRESETS = [
    { name: "مضمار", url: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=1200" },
    { name: "جيم", url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200" },
    { name: "كرة قدم", url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200" },
    { name: "سباحة", url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200" },
    { name: "تنس", url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200" },
    { name: "ملاكمة", url: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200" },
    { name: "يوجا", url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200" },
    { name: "سلة", url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200" },
    { name: "دراجات", url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200" },
    { name: "جري", url: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200" },
    { name: "لياقة", url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200" },
    { name: "بطولة", url: "https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?w=1200" },
    { name: "ملعب ليلي", url: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200" },
    { name: "استاد", url: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1200" },
    { name: "طبيعة", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200" },
    { name: "مدينة ليلية", url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200" },
  ];

  const GRADIENTS = [
    { name: "سيان → ذهبي", css: "linear-gradient(135deg,#05e0e0,#ffd500)" },
    { name: "بنفسجي → وردي", css: "linear-gradient(135deg,#8377e0,#ff6b9d)" },
    { name: "أزرق → أخضر", css: "linear-gradient(135deg,#4facfe,#00f2fe)" },
    { name: "برتقالي → أحمر", css: "linear-gradient(135deg,#f97316,#ef4444)" },
    { name: "ذهبي → بني", css: "linear-gradient(135deg,#ffd500,#8b6914)" },
    { name: "داكن → أغمق", css: "linear-gradient(135deg,#1a1a2e,#0f0f1a)" },
    { name: "أخضر → سماوي", css: "linear-gradient(135deg,#2ed573,#05e0e0)" },
    { name: "وردي → بنفسجي", css: "linear-gradient(135deg,#ff9ff3,#8377e0)" },
    { name: "أزرق ملكي", css: "linear-gradient(135deg,#0c3547,#1a6b8a)" },
    { name: "غروب", css: "linear-gradient(135deg,#ee9ca7,#ffdde1)" },
  ];

  let config = {};
  let hiddenEls = {};
  let siteSettings = {};
  let selectedZone = null;
  let panelOpen = false;
  let activeTab = "backgrounds";

  /* ═══ INIT ═══ */
  function init() {
    injectCSS();
    trackVisit();
    loadAll();
    applyAllBackgrounds();
    applyHiddenElements();
    applySiteSettings();
    addTrigger();
  }

  function trackVisit() {
    try {
      const c = parseInt(localStorage.getItem(VISITS_KEY) || "0", 10);
      localStorage.setItem(VISITS_KEY, String(c + 1));
    } catch (e) { /* silent */ }
  }

  /* ═══ LOAD / SAVE ═══ */
  function loadAll() {
    try { config = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { config = {}; }
    try { hiddenEls = JSON.parse(localStorage.getItem(HIDDEN_KEY) || "{}"); } catch { hiddenEls = {}; }
    try { siteSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"); } catch { siteSettings = {}; }
  }

  function saveConfig() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); } catch { /* silent */ } }
  function saveHidden() { try { localStorage.setItem(HIDDEN_KEY, JSON.stringify(hiddenEls)); } catch { /* silent */ } }
  function saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(siteSettings)); } catch { /* silent */ } }

  /* ═══ BACKGROUNDS ═══ */
  function applyAllBackgrounds() {
    Object.keys(config).forEach(zoneId => applyZoneBackground(zoneId, config[zoneId]));
  }

  function applyZoneBackground(zoneId, cfg) {
    if (!cfg || cfg.type === "none") { resetZoneBackground(zoneId); return; }
    const zone = ZONES.find(z => z.id === zoneId);
    if (!zone) return;
    document.querySelectorAll(zone.selector).forEach(el => {
      el.style.backgroundImage = "";
      el.style.backgroundSize = "";
      el.style.backgroundPosition = "";
      el.style.backgroundRepeat = "";
      el.classList.remove("ap-custom-bg");
      if (cfg.type === "image") el.style.backgroundImage = `url("${cfg.src}")`;
      else el.style.backgroundImage = cfg.src;
      el.style.backgroundSize = cfg.size || "cover";
      el.style.backgroundPosition = cfg.position || "center";
      el.style.backgroundRepeat = "no-repeat";
      if (cfg.overlay > 0) el.classList.add("ap-custom-bg");
    });
    applyOverlayCSS(zoneId, cfg);
  }

  function resetZoneBackground(zoneId) {
    const zone = ZONES.find(z => z.id === zoneId);
    if (!zone) return;
    document.querySelectorAll(zone.selector).forEach(el => {
      el.style.backgroundImage = "";
      el.style.backgroundSize = "";
      el.style.backgroundPosition = "";
      el.style.backgroundRepeat = "";
      el.classList.remove("ap-custom-bg");
    });
    const old = document.getElementById("ap-overlay-" + zoneId);
    if (old) old.remove();
  }

  function applyOverlayCSS(zoneId, cfg) {
    const old = document.getElementById("ap-overlay-" + zoneId);
    if (old) old.remove();
    if (cfg.overlay > 0) {
      const zone = ZONES.find(z => z.id === zoneId);
      if (!zone) return;
      const s = document.createElement("style");
      s.id = "ap-overlay-" + zoneId;
      s.textContent = `${zone.selector}.ap-custom-bg{isolation:isolate;position:relative}${zone.selector}.ap-custom-bg::before{content:'';position:absolute;inset:0;background:rgba(0,0,0,${cfg.overlay / 100});z-index:0;pointer-events:none;border-radius:inherit}${zone.selector}.ap-custom-bg>*{position:relative;z-index:1}body.ap-custom-bg::before{position:fixed;border-radius:0}`;
      document.head.appendChild(s);
    }
  }

  /* ═══ HIDDEN ELEMENTS ═══ */
  function applyHiddenElements() {
    Object.keys(hiddenEls).forEach(id => {
      if (hiddenEls[id]) {
        const sec = HIDABLE_SECTIONS.find(s => s.id === id);
        if (sec) document.querySelectorAll(sec.selector).forEach(el => { el.style.display = "none"; });
      }
    });
  }

  function toggleSection(id, hide) {
    const sec = HIDABLE_SECTIONS.find(s => s.id === id);
    if (!sec) return;
    hiddenEls[id] = hide;
    document.querySelectorAll(sec.selector).forEach(el => { el.style.display = hide ? "none" : ""; });
    saveHidden();
  }

  /* ═══ SITE SETTINGS ═══ */
  function applySiteSettings() {
    if (siteSettings.siteName) document.title = siteSettings.siteName;
  }

  /* ═══ TRIGGER ═══ */
  function addTrigger() {
    if (document.getElementById("apTrigger")) return;
    const btn = document.createElement("button");
    btn.id = "apTrigger";
    btn.setAttribute("aria-label", "لوحة التحكم");
    btn.title = "لوحة التحكم";
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`;
    document.body.appendChild(btn);
    btn.addEventListener("click", togglePanel);
  }

  function togglePanel() { if (panelOpen) closePanel(); else openPanel(); }

  function openPanel() {
    if (panelOpen) return;
    panelOpen = true;
    buildPanel();
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
  }

  function closePanel() {
    if (!panelOpen) return;
    panelOpen = false;
    const el = document.getElementById("apOverlay");
    if (el) el.remove();
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
  }

  function onKey(e) { if (e.key === "Escape") closePanel(); }

  /* ═══ BUILD PANEL ═══ */
  function buildPanel() {
    const old = document.getElementById("apOverlay");
    if (old) old.remove();

    const visits = parseInt(localStorage.getItem(VISITS_KEY) || "0", 10);
    const bookings = JSON.parse(localStorage.getItem("esp_bookings") || "[]");
    const customBgs = Object.keys(config).length;
    const hiddenCount = Object.values(hiddenEls).filter(Boolean).length;

    const el = document.createElement("div");
    el.className = "ap-overlay";
    el.id = "apOverlay";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", "لوحة التحكم");

    el.innerHTML = `
      <div class="ap-panel">
        <div class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">⚙️</span>
            <div><h3>لوحة التحكم</h3><small>EliteSports Pro Admin</small></div>
          </div>
          <button class="ap-close" id="apClose" aria-label="إغلاق">&times;</button>
        </div>
        <div class="ap-stats">
          <div class="ap-stat"><span class="ap-stat-num">${visits}</span><span class="ap-stat-label">زيارة</span></div>
          <div class="ap-stat"><span class="ap-stat-num">${bookings.length}</span><span class="ap-stat-label">حجز</span></div>
          <div class="ap-stat"><span class="ap-stat-num">${customBgs}</span><span class="ap-stat-label">خلفية</span></div>
          <div class="ap-stat"><span class="ap-stat-num">${hiddenCount}</span><span class="ap-stat-label">مخفي</span></div>
        </div>
        <div class="ap-tabs">
          <button class="ap-tab ${activeTab === "backgrounds" ? "ap-tab-active" : ""}" data-tab="backgrounds">🖼️ الخلفيات</button>
          <button class="ap-tab ${activeTab === "content" ? "ap-tab-active" : ""}" data-tab="content">📋 المحتوى</button>
          <button class="ap-tab ${activeTab === "bookings" ? "ap-tab-active" : ""}" data-tab="bookings">📅 الحجوزات</button>
          <button class="ap-tab ${activeTab === "settings" ? "ap-tab-active" : ""}" data-tab="settings">⚙️ الإعدادات</button>
        </div>
        <div class="ap-body" id="apBody"></div>
        <div class="ap-footer">
          <button class="ap-btn ap-btn-danger" id="apResetAll">🗑️ إعادة تعيين الكل</button>
          <button class="ap-btn ap-btn-primary" id="apDone">تم ✓</button>
        </div>
      </div>`;

    document.body.appendChild(el);
    bindHeaderEvents(el);
    renderTab(el, activeTab);
  }

  /* ═══ HEADER EVENTS ═══ */
  function bindHeaderEvents(el) {
    el.querySelector("#apClose").addEventListener("click", closePanel);
    el.addEventListener("click", e => { if (e.target === el) closePanel(); });
    el.querySelector("#apDone").addEventListener("click", () => { saveConfig(); saveHidden(); saveSettings(); closePanel(); });

    el.querySelectorAll(".ap-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        activeTab = tab.dataset.tab;
        el.querySelectorAll(".ap-tab").forEach(t => t.classList.remove("ap-tab-active"));
        tab.classList.add("ap-tab-active");
        renderTab(el, activeTab);
      });
    });

    el.querySelector("#apResetAll").addEventListener("click", () => {
      config = {};
      hiddenEls = {};
      ZONES.forEach(z => resetZoneBackground(z.id));
      HIDABLE_SECTIONS.forEach(s => { document.querySelectorAll(s.selector).forEach(el2 => { el2.style.display = ""; }); });
      saveConfig(); saveHidden();
      renderTab(el, activeTab);
      toast("🗑️ تم إعادة تعيين كل حاجة");
    });
  }

  /* ═══ RENDER TABS ═══ */
  function renderTab(el, tab) {
    const body = el.querySelector("#apBody");
    if (!body) return;
    if (tab === "backgrounds") renderBackgroundsTab(el, body);
    else if (tab === "content") renderContentTab(el, body);
    else if (tab === "bookings") renderBookingsTab(el, body);
    else if (tab === "settings") renderSettingsTab(el, body);
  }

  /* ═══ TAB: BACKGROUNDS ═══ */
  function renderBackgroundsTab(el, body) {
    const zonesHTML = ZONES.map(z => {
      const hasBg = config[z.id] && config[z.id].type !== "none";
      return `<button class="ap-zone-btn ${hasBg ? "ap-zone-active" : ""} ${selectedZone === z.id ? "ap-selected" : ""}" data-zone="${z.id}"><span>${z.label}</span><span class="ap-zone-badge">${hasBg ? "✓" : ""}</span></button>`;
    }).join("");

    const presetsHTML = PRESETS.map(p => `<button class="ap-thumb" data-url="${p.url}" title="${p.name}"><img src="${p.url}" alt="${p.name}" loading="lazy"><span class="ap-thumb-name">${p.name}</span></button>`).join("");
    const gradientsHTML = GRADIENTS.map(g => `<button class="ap-grad" data-css="${g.css}" title="${g.name}" style="background:${g.css}"></button>`).join("");

    body.innerHTML = `
      <div class="ap-section">
        <p class="ap-label">📍 اختر المنطقة</p>
        <div class="ap-zones">${zonesHTML}</div>
      </div>
      <div class="ap-section" id="apBgSection" style="display:${selectedZone ? "block" : "none"}">
        <p class="ap-label">🎨 نوع الخلفية</p>
        <div class="ap-type-tabs">
          <button class="ap-type-tab ap-active" data-type="image">🖼️ صورة</button>
          <button class="ap-type-tab" data-type="gradient">🌈 تدرج</button>
          <button class="ap-type-tab" data-type="solid">🎨 لون</button>
          <button class="ap-type-tab" data-type="none">🚫 إزالة</button>
        </div>
        <div id="apImageOptions">
          <p class="ap-label">📸 الصور الجاهزة</p>
          <div class="ap-grid">${presetsHTML}</div>
          <p class="ap-label" style="margin-top:12px">📂 أو ارفع صورة</p>
          <div class="ap-drop" id="apDrop">
            <input type="file" id="apFile" accept="image/*" hidden>
            <span style="font-size:28px">📁</span>
            <span>اسحب صورة أو اضغط للاختيار</span>
            <small>PNG, JPG, WEBP — 5MB كحد أقصى</small>
          </div>
        </div>
        <div id="apGradientOptions" style="display:none">
          <p class="ap-label">🌈 التدرجات الجاهزة</p>
          <div class="ap-grad-grid">${gradientsHTML}</div>
          <p class="ap-label" style="margin-top:12px">✏️ أو اكتب تدرج مخصص</p>
          <input type="text" class="ap-input" id="apCustomGrad" placeholder="linear-gradient(135deg, #05e0e0, #ffd500)">
        </div>
        <div id="apSolidOptions" style="display:none">
          <p class="ap-label">🎨 اختر لون</p>
          <div class="ap-color-row">
            <input type="color" class="ap-color" id="apSolidColor" value="#111827">
            <input type="text" class="ap-input" id="apSolidHex" value="#111827">
          </div>
        </div>
        <div id="apBgSettings" style="display:none">
          <p class="ap-label">⚙️ إعدادات الخلفية</p>
          <div class="ap-setting-row"><span>شفافية الطبقة الداكنة</span><div class="ap-range-wrap"><input type="range" class="ap-range" id="apOverlay" min="0" max="90" value="40"><span id="apOverlayVal">40%</span></div></div>
          <div class="ap-setting-row"><span>موضع الخلفية</span><select class="ap-select" id="apPosition"><option value="center">Center</option><option value="top">Top</option><option value="bottom">Bottom</option><option value="left">Left</option><option value="right">Right</option></select></div>
          <div class="ap-setting-row"><span>حجم الخلفية</span><select class="ap-select" id="apSize"><option value="cover">Cover</option><option value="contain">Contain</option><option value="100% 100%">Stretch</option></select></div>
        </div>
      </div>`;

    bindBgEvents(el, body);
  }

  function bindBgEvents(el, body) {
    const $ = sel => body.querySelector(sel);
    const $$ = sel => body.querySelectorAll(sel);

    $$(".ap-zone-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        selectedZone = btn.dataset.zone;
        $$(".ap-zone-btn").forEach(b => b.classList.remove("ap-selected"));
        btn.classList.add("ap-selected");
        $("#apBgSection").style.display = "block";
      });
    });

    $$(".ap-type-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        $$(".ap-type-tab").forEach(t => t.classList.remove("ap-active"));
        tab.classList.add("ap-active");
        const type = tab.dataset.type;
        $("#apImageOptions").style.display = type === "image" ? "block" : "none";
        $("#apGradientOptions").style.display = type === "gradient" ? "block" : "none";
        $("#apSolidOptions").style.display = type === "solid" ? "block" : "none";
        $("#apBgSettings").style.display = type === "none" ? "none" : "block";
        if (type === "none" && selectedZone) {
          delete config[selectedZone];
          resetZoneBackground(selectedZone);
          saveConfig();
          updateZoneBadges(body);
          toast("🗑️ تم إزالة الخلفية");
        }
      });
    });

    $$(".ap-thumb").forEach(thumb => {
      thumb.addEventListener("click", () => {
        if (!selectedZone) return;
        const cfg = { type: "image", src: thumb.dataset.url, overlay: parseInt($("#apOverlay")?.value || 40, 10), position: $("#apPosition")?.value || "center", size: $("#apSize")?.value || "cover" };
        config[selectedZone] = cfg;
        applyZoneBackground(selectedZone, cfg);
        saveConfig();
        updateZoneBadges(body);
        toast("✅ تم تغيير الخلفية!");
      });
    });

    $$(".ap-grad").forEach(g => {
      g.addEventListener("click", () => {
        if (!selectedZone) return;
        const cfg = { type: "gradient", src: g.dataset.css, overlay: parseInt($("#apOverlay")?.value || 40, 10), position: $("#apPosition")?.value || "center", size: $("#apSize")?.value || "cover" };
        config[selectedZone] = cfg;
        applyZoneBackground(selectedZone, cfg);
        saveConfig();
        updateZoneBadges(body);
        toast("✅ تم تغيير الخلفية!");
      });
    });

    const customGrad = $("#apCustomGrad");
    if (customGrad) {
      customGrad.addEventListener("change", () => {
        if (!selectedZone || !customGrad.value.trim()) return;
        const cfg = { type: "gradient", src: customGrad.value.trim(), overlay: parseInt($("#apOverlay")?.value || 40, 10), position: $("#apPosition")?.value || "center", size: $("#apSize")?.value || "cover" };
        config[selectedZone] = cfg;
        applyZoneBackground(selectedZone, cfg);
        saveConfig();
        updateZoneBadges(body);
        toast("✅ تم تغيير الخلفية!");
      });
    }

    const solidColor = $("#apSolidColor");
    const solidHex = $("#apSolidHex");
    if (solidColor) solidColor.addEventListener("input", () => { if (solidHex) solidHex.value = solidColor.value; applySolidBG(solidColor.value, body); });
    if (solidHex) solidHex.addEventListener("change", () => { if (/^#[0-9a-fA-F]{6}$/.test(solidHex.value)) { if (solidColor) solidColor.value = solidHex.value; applySolidBG(solidHex.value, body); } });

    function applySolidBG(color, b) {
      if (!selectedZone) return;
      const cfg = { type: "solid", src: color, overlay: parseInt(b.querySelector("#apOverlay")?.value || 40, 10), position: b.querySelector("#apPosition")?.value || "center", size: b.querySelector("#apSize")?.value || "cover" };
      config[selectedZone] = cfg;
      applyZoneBackground(selectedZone, cfg);
      saveConfig();
      updateZoneBadges(b);
      toast("✅ تم تغيير الخلفية!");
    }

    const drop = $("#apDrop");
    const fileInput = $("#apFile");
    if (drop && fileInput) {
      drop.addEventListener("click", () => fileInput.click());
      drop.addEventListener("dragover", e => { e.preventDefault(); drop.classList.add("ap-over"); });
      drop.addEventListener("dragleave", () => drop.classList.remove("ap-over"));
      drop.addEventListener("drop", e => { e.preventDefault(); drop.classList.remove("ap-over"); const f = e.dataTransfer.files[0]; if (f && f.type.startsWith("image/")) handleUpload(f, body); });
      fileInput.addEventListener("change", () => { if (fileInput.files[0]) handleUpload(fileInput.files[0], body); });
    }

    const overlayRange = $("#apOverlay");
    const overlayVal = $("#apOverlayVal");
    if (overlayRange) overlayRange.addEventListener("input", () => {
      if (overlayVal) overlayVal.textContent = overlayRange.value + "%";
      if (selectedZone && config[selectedZone]) { config[selectedZone].overlay = parseInt(overlayRange.value, 10); applyZoneBackground(selectedZone, config[selectedZone]); saveConfig(); }
    });

    const posSelect = $("#apPosition");
    if (posSelect) posSelect.addEventListener("change", () => { if (selectedZone && config[selectedZone]) { config[selectedZone].position = posSelect.value; applyZoneBackground(selectedZone, config[selectedZone]); saveConfig(); } });

    const sizeSelect = $("#apSize");
    if (sizeSelect) sizeSelect.addEventListener("change", () => { if (selectedZone && config[selectedZone]) { config[selectedZone].size = sizeSelect.value; applyZoneBackground(selectedZone, config[selectedZone]); saveConfig(); } });
  }

  function handleUpload(file, body) {
    if (file.size > 5 * 1024 * 1024) { toast("⚠️ الصورة كبيرة أوي! 5MB كحد أقصى", "warning"); return; }
    if (!selectedZone) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_W = 1920, MAX_H = 1080;
        let w = img.width, h = img.height;
        if (w > MAX_W) { h = Math.round(h * MAX_W / w); w = MAX_W; }
        if (h > MAX_H) { w = Math.round(w * MAX_H / h); h = MAX_H; }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL("image/jpeg", 0.8);
        const cfg = { type: "image", src: compressed, overlay: 40, position: "center", size: "cover" };
        config[selectedZone] = cfg;
        applyZoneBackground(selectedZone, cfg);
        saveConfig();
        updateZoneBadges(body);
        toast("✅ تم رفع الصورة وتغيير الخلفية!");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function updateZoneBadges(body) {
    if (!body) return;
    body.querySelectorAll(".ap-zone-btn").forEach(btn => {
      const zoneId = btn.dataset.zone;
      const hasBg = config[zoneId] && config[zoneId].type !== "none";
      btn.classList.toggle("ap-zone-active", hasBg);
      const badge = btn.querySelector(".ap-zone-badge");
      if (badge) badge.textContent = hasBg ? "✓" : "";
    });
  }

  /* ═══ TAB: CONTENT ═══ */
  function renderContentTab(el, body) {
    const sectionsHTML = HIDABLE_SECTIONS.map(s => {
      const isHidden = hiddenEls[s.id] || false;
      return `<div class="ap-content-row"><span class="ap-content-label">${s.label}</span><button class="ap-toggle-btn ${isHidden ? "ap-toggle-off" : "ap-toggle-on"}" data-section="${s.id}">${isHidden ? "🚫 مخفي" : "👁️ ظاهر"}</button></div>`;
    }).join("");

    body.innerHTML = `
      <div class="ap-section">
        <p class="ap-label">👁️ إظهار / إخفاء أقسام الموقع</p>
        <p style="font-size:12px;color:#999;margin-bottom:12px">اضغط على الزرار لإخفاء أو إظهار أي قسم</p>
        <div class="ap-content-list">${sectionsHTML}</div>
      </div>
      <div class="ap-section">
        <p class="ap-label">🗑️ حذف سريع</p>
        <div class="ap-danger-zone">
          <button class="ap-btn ap-btn-danger" id="apClearBookings">🗑️ مسح كل الحجوزات</button>
          <button class="ap-btn ap-btn-danger" id="apClearChat">🗑️ مسح محادثات المساعد</button>
          <button class="ap-btn ap-btn-danger" id="apClearCache">🗑️ مسح كل البيانات</button>
        </div>
      </div>`;

    body.querySelectorAll(".ap-toggle-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.section;
        const isHidden = hiddenEls[id] || false;
        toggleSection(id, !isHidden);
        btn.classList.toggle("ap-toggle-off", !isHidden);
        btn.classList.toggle("ap-toggle-on", isHidden);
        btn.textContent = !isHidden ? "🚫 مخفي" : "👁️ ظاهر";
        toast(!isHidden ? "🚫 تم إخفاء القسم" : "👁️ تم إظهار القسم");
      });
    });

    body.querySelector("#apClearBookings")?.addEventListener("click", () => { localStorage.removeItem("esp_bookings"); toast("🗑️ تم مسح كل الحجوزات"); });
    body.querySelector("#apClearChat")?.addEventListener("click", () => { localStorage.removeItem("sports_ai_chat"); localStorage.removeItem("assistant_user_name"); toast("🗑️ تم مسح محادثات المساعد"); });
    body.querySelector("#apClearCache")?.addEventListener("click", () => { if (confirm("⚠️ هتمسح كل البيانات المحفوظة. متأكد؟")) { localStorage.clear(); location.reload(); } });
  }

  /* ═══ TAB: BOOKINGS ═══ */
  function renderBookingsTab(el, body) {
    const bookings = JSON.parse(localStorage.getItem("esp_bookings") || "[]");
    if (bookings.length === 0) {
      body.innerHTML = `<div class="ap-empty"><span style="font-size:48px">📅</span><p>مفيش حجوزات لسه</p></div>`;
      return;
    }
    const bookingsHTML = bookings.map((b, i) => `
      <div class="ap-booking-card">
        <div class="ap-booking-info">
          <strong>${b.name || "بدون اسم"}</strong>
          <small>📞 ${b.phone || "-"}</small>
          <small>🏆 ${b.sport || "-"} • 📅 ${b.date || "-"} • ⏰ ${b.time || "-"}</small>
          <small>👨‍🏫 ${b.coachName || "-"}</small>
        </div>
        <button class="ap-booking-del" data-index="${i}" aria-label="حذف الحجز">🗑️</button>
      </div>`).join("");

    body.innerHTML = `<div class="ap-section"><p class="ap-label">📅 كل الحجوزات (${bookings.length})</p><div class="ap-bookings-list">${bookingsHTML}</div></div>`;

    body.querySelectorAll(".ap-booking-del").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index, 10);
        bookings.splice(index, 1);
        localStorage.setItem("esp_bookings", JSON.stringify(bookings));
        renderBookingsTab(el, body);
        toast("🗑️ تم حذف الحجز");
      });
    });
  }

  /* ═══ TAB: SETTINGS ═══ */
  function renderSettingsTab(el, body) {
    body.innerHTML = `
      <div class="ap-section">
        <p class="ap-label">⚙️ إعدادات الموقع</p>
        <div class="ap-setting-row"><span>اسم الموقع</span><input type="text" class="ap-input" id="apSiteName" value="${siteSettings.siteName || "EliteSports Pro"}"></div>
        <div class="ap-setting-row"><span>رقم التليفون</span><input type="text" class="ap-input" id="apPhone" value="${siteSettings.phone || "01032508884"}"></div>
        <div class="ap-setting-row"><span>الإيميل</span><input type="text" class="ap-input" id="apEmail" value="${siteSettings.email || "mg3901247@gmail.com"}"></div>
        <button class="ap-btn ap-btn-primary" id="apSaveSettings" style="margin-top:12px;width:100%">💾 حفظ الإعدادات</button>
      </div>
      <div class="ap-section">
        <p class="ap-label">📊 معلومات</p>
        <div class="ap-info-grid">
          <div class="ap-info-item"><span>الإصدار</span><strong>v2.0</strong></div>
          <div class="ap-info-item"><span>التخزين</span><strong>localStorage</strong></div>
          <div class="ap-info-item"><span>الزيارات</span><strong>${localStorage.getItem(VISITS_KEY) || "0"}</strong></div>
          <div class="ap-info-item"><span>الخلفيات المخصصة</span><strong>${Object.keys(config).length}</strong></div>
        </div>
      </div>`;

    body.querySelector("#apSaveSettings")?.addEventListener("click", () => {
      siteSettings.siteName = body.querySelector("#apSiteName")?.value || "";
      siteSettings.phone = body.querySelector("#apPhone")?.value || "";
      siteSettings.email = body.querySelector("#apEmail")?.value || "";
      saveSettings();
      applySiteSettings();
      toast("✅ تم حفظ الإعدادات!");
    });
  }

  /* ═══ TOAST ═══ */
  function toast(msg, type) {
    if (typeof window.showToast === "function") { window.showToast(msg, type || "info"); return; }
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = "position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:12px 24px;border-radius:10px;z-index:999999;font-size:14px;font-weight:600;";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  /* ═══ CSS ═══ */
  function injectCSS() {
    if (document.getElementById("apCSS")) return;
    const s = document.createElement("style");
    s.id = "apCSS";
    s.textContent = `
      #apTrigger{position:fixed;bottom:20px;right:20px;z-index:9999;width:48px;height:48px;border-radius:50%;border:none;background:#fff;color:#333;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(0,0,0,.15);transition:all .25s ease}
      #apTrigger:hover{transform:scale(1.1) rotate(30deg);box-shadow:0 4px 20px rgba(0,0,0,.2)}
      #apTrigger:active{transform:scale(.95)}
      .ap-overlay{position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;animation:apIn .2s ease}
      @keyframes apIn{from{opacity:0}to{opacity:1}}
      .ap-panel{background:#fff;border-radius:16px;width:100%;max-width:640px;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.25);animation:apUp .3s cubic-bezier(.16,1,.3,1);overflow:hidden}
      @keyframes apUp{from{opacity:0;transform:translateY(30px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
      .ap-header{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid #f0f0f2}
      .ap-header-left{display:flex;align-items:center;gap:12px}
      .ap-logo{font-size:28px}
      .ap-header h3{font-size:17px;font-weight:700;color:#1a1a2e;margin:0}
      .ap-header small{font-size:12px;color:#999}
      .ap-close{width:32px;height:32px;border:none;background:#f5f5f7;border-radius:8px;font-size:20px;color:#666;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
      .ap-close:hover{background:#fee;color:#e33}
      .ap-stats{display:flex;gap:10px;padding:12px 24px;background:#fafafa;border-bottom:1px solid #f0f0f2}
      .ap-stat{flex:1;text-align:center;padding:8px;background:#fff;border-radius:10px;border:1px solid #eee}
      .ap-stat-num{display:block;font-size:20px;font-weight:800;color:#1a1a2e}
      .ap-stat-label{font-size:11px;color:#999}
      .ap-tabs{display:flex;gap:4px;padding:10px 24px;border-bottom:1px solid #f0f0f2;background:#fafafa}
      .ap-tab{flex:1;padding:8px 6px;border:none;background:none;border-radius:8px;font-size:12px;font-weight:600;color:#888;cursor:pointer;transition:all .2s;font-family:inherit}
      .ap-tab:hover{background:#eee;color:#555}
      .ap-tab-active{background:#fff;color:#4285f4;box-shadow:0 1px 4px rgba(0,0,0,.08)}
      .ap-body{padding:16px 24px;overflow-y:auto;flex:1}
      .ap-section{margin-bottom:16px}
      .ap-label{font-size:12px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:.5px;margin:12px 0 8px}
      .ap-zones{display:grid;grid-template-columns:repeat(2,1fr);gap:6px}
      .ap-zone-btn{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:10px;border:2px solid #e8e8ee;background:#fafafa;cursor:pointer;font-size:13px;color:#555;transition:all .2s;font-family:inherit;text-align:left}
      .ap-zone-btn:hover{border-color:#ccc;background:#f0f0f2}
      .ap-zone-btn.ap-selected{border-color:#4285f4;background:rgba(66,133,244,.06);color:#333;font-weight:600}
      .ap-zone-btn.ap-zone-active{border-color:#2ed573;background:rgba(46,213,115,.06)}
      .ap-zone-badge{width:20px;height:20px;border-radius:50%;background:#2ed573;color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center;font-weight:700}
      .ap-type-tabs{display:flex;gap:6px;margin-bottom:12px}
      .ap-type-tab{flex:1;padding:9px 8px;border-radius:8px;border:2px solid #e8e8ee;background:#fafafa;cursor:pointer;font-size:12px;color:#555;transition:all .2s;font-family:inherit}
      .ap-type-tab:hover{border-color:#ccc}
      .ap-type-tab.ap-active{border-color:#4285f4;background:rgba(66,133,244,.06);color:#333;font-weight:600}
      .ap-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
      .ap-thumb{position:relative;border-radius:10px;overflow:hidden;border:2px solid transparent;cursor:pointer;padding:0;background:none;aspect-ratio:16/10;transition:all .2s}
      .ap-thumb img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s}
      .ap-thumb:hover{border-color:#4285f4;transform:scale(1.03);box-shadow:0 4px 12px rgba(0,0,0,.15)}
      .ap-thumb:hover img{transform:scale(1.08)}
      .ap-thumb-name{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,.7));color:#fff;font-size:10px;padding:12px 6px 5px;text-align:center;opacity:0;transition:opacity .2s}
      .ap-thumb:hover .ap-thumb-name{opacity:1}
      .ap-grad-grid{display:flex;gap:8px;flex-wrap:wrap}
      .ap-grad{width:60px;height:40px;border-radius:8px;border:2px solid transparent;cursor:pointer;transition:all .2s}
      .ap-grad:hover{border-color:#333;transform:scale(1.08)}
      .ap-drop{border:2px dashed #ddd;border-radius:12px;padding:24px;text-align:center;cursor:pointer;transition:all .2s;color:#999;display:flex;flex-direction:column;align-items:center;gap:6px;font-size:13px}
      .ap-drop:hover,.ap-drop.ap-over{border-color:#4285f4;background:rgba(66,133,244,.03);color:#4285f4}
      .ap-drop small{font-size:11px;color:#bbb}
      .ap-color-row{display:flex;align-items:center;gap:10px}
      .ap-color{width:48px;height:38px;border:none;border-radius:8px;cursor:pointer;padding:0;background:none}
      .ap-color::-webkit-color-swatch-wrapper{padding:2px}
      .ap-color::-webkit-color-swatch{border-radius:6px;border:1px solid #ddd}
      .ap-input{width:100%;padding:10px 14px;border-radius:8px;border:1.5px solid #e0e0e2;font-size:14px;color:#333;outline:none;transition:border .2s;font-family:inherit;background:#fafafa}
      .ap-input:focus{border-color:#4285f4}
      .ap-select{width:100%;padding:10px 14px;border-radius:8px;border:1.5px solid #e0e0e2;font-size:14px;color:#333;outline:none;background:#fafafa;cursor:pointer;font-family:inherit}
      .ap-select:focus{border-color:#4285f4}
      .ap-range-wrap{display:flex;align-items:center;gap:10px;flex:1}
      .ap-range{flex:1;accent-color:#4285f4;cursor:pointer}
      .ap-setting-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:10px 0}
      .ap-setting-row>span{font-size:13px;color:#555;white-space:nowrap}
      .ap-content-list{display:flex;flex-direction:column;gap:6px}
      .ap-content-row{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:10px;border:1px solid #eee;background:#fafafa}
      .ap-content-label{font-size:13px;color:#555}
      .ap-toggle-btn{padding:6px 14px;border-radius:50px;border:none;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;font-family:inherit}
      .ap-toggle-on{background:rgba(46,213,115,.1);color:#2ed573;border:1px solid rgba(46,213,115,.3)}
      .ap-toggle-off{background:rgba(231,76,60,.1);color:#e74c3c;border:1px solid rgba(231,76,60,.3)}
      .ap-danger-zone{display:flex;flex-direction:column;gap:8px}
      .ap-bookings-list{display:flex;flex-direction:column;gap:8px}
      .ap-booking-card{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:10px;border:1px solid #eee;background:#fafafa}
      .ap-booking-info{display:flex;flex-direction:column;gap:2px}
      .ap-booking-info strong{font-size:14px;color:#333}
      .ap-booking-info small{font-size:12px;color:#888}
      .ap-booking-del{width:36px;height:36px;border:none;background:rgba(231,76,60,.1);border-radius:8px;cursor:pointer;font-size:16px;transition:all .2s;display:flex;align-items:center;justify-content:center}
      .ap-booking-del:hover{background:#e74c3c;transform:scale(1.1)}
      .ap-empty{text-align:center;padding:40px;color:#999}
      .ap-empty p{margin-top:12px;font-size:14px}
      .ap-info-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
      .ap-info-item{display:flex;justify-content:space-between;padding:10px 14px;border-radius:8px;background:#fafafa;border:1px solid #eee;font-size:13px}
      .ap-info-item span{color:#888}
      .ap-info-item strong{color:#333}
      .ap-footer{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;border-top:1px solid #f0f0f2}
      .ap-btn{padding:10px 22px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;border:none;font-family:inherit}
      .ap-btn-primary{background:#4285f4;color:#fff}
      .ap-btn-primary:hover{background:#3367d6;box-shadow:0 2px 10px rgba(66,133,244,.3)}
      .ap-btn-danger{background:#f5f5f7;color:#e33;border:1px solid #fdd}
      .ap-btn-danger:hover{background:#fee}
      @media(max-width:600px){
        .ap-panel{max-width:100%;border-radius:12px;max-height:92vh}
        .ap-grid{grid-template-columns:repeat(3,1fr)}
        .ap-zones{grid-template-columns:1fr}
        .ap-tabs{flex-wrap:wrap}
        .ap-tab{font-size:11px}
        #apTrigger{width:42px;height:42px;bottom:15px;right:15px}
        #apTrigger svg{width:18px;height:18px}
        .ap-info-grid{grid-template-columns:1fr}
      }
      @media print{#apTrigger,.ap-overlay{display:none!important}}
    `;
    document.head.appendChild(s);
  }

  return { init };
})();


/* ═══ التشغيل ═══ */
document.addEventListener("DOMContentLoaded", () => {
  AdminPanel.init();
});