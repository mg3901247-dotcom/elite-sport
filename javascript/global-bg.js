/**
 * EliteSports Pro — Theme Studio
 * Professional Edition v2.1 (Final)
 * Fully Customizable Theme System — No Coding Required
 */

"use strict";

const ThemeStudio = (() => {

  const DEFAULTS = Object.freeze({
    bgType: "image",
    bgImage: "",
    bgGradient: "linear-gradient(135deg, #05e0e0, #ffd500)",
    bgColor: "#111827",
    bgPosition: "center",
    bgSize: "cover",
    overlayOpacity: 40,
    blur: 0,
    primaryColor: "#05e0e0",
    accentColor: "#ffd500",
    cardStyle: "glass",
    mode: "auto",
  });

  const PRESETS = [
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
  ];

  const GRADIENTS = [
    { name: "سيان → ذهبي", css: "linear-gradient(135deg, #05e0e0, #ffd500)" },
    { name: "بنفسجي → وردي", css: "linear-gradient(135deg, #8377e0, #ff6b9d)" },
    { name: "أزرق → أخضر", css: "linear-gradient(135deg, #4facfe, #00f2fe)" },
    { name: "برتقالي → أحمر", css: "linear-gradient(135deg, #f97316, #ef4444)" },
    { name: "ذهبي → بني", css: "linear-gradient(135deg, #ffd500, #8b6914)" },
    { name: "داكن → أغمق", css: "linear-gradient(135deg, #1a1a2e, #0f0f1a)" },
    { name: "أخضر → سماوي", css: "linear-gradient(135deg, #2ed573, #05e0e0)" },
    { name: "وردي → بنفسجي", css: "linear-gradient(135deg, #ff9ff3, #8377e0)" },
  ];

  const STORAGE_KEY = "esp_theme_studio";
  const MAX_HISTORY = 20;

  let state = { ...DEFAULTS };
  let history = [];
  let historyIndex = -1;
  let panelOpen = false;
  let panelEl = null;

  /* ═══════════════════════════════════════
     INIT
  ═══════════════════════════════════════ */
  function init() {
    injectCSS();
    loadSaved();
    addTrigger();
    applyMode();
  }

  /* ═══════════════════════════════════════
     TRIGGER
  ═══════════════════════════════════════ */
  function addTrigger() {
    if (document.getElementById("tsTrigger")) return;
    const btn = document.createElement("button");
    btn.id = "tsTrigger";
    btn.setAttribute("aria-label", "فتح Theme Studio");
    btn.setAttribute("aria-haspopup", "dialog");
    btn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
    document.body.appendChild(btn);
    btn.addEventListener("click", togglePanel);
  }

  function togglePanel() {
    if (panelOpen) closePanel();
    else openPanel();
  }

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
    if (panelEl) { panelEl.remove(); panelEl = null; }
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
  }

  function onKey(e) {
    if (e.key === "Escape") closePanel();
    if (e.ctrlKey && e.key === "z") { e.preventDefault(); undo(); refreshUI(); }
    if (e.ctrlKey && e.key === "y") { e.preventDefault(); redo(); refreshUI(); }
  }

  /* ═══════════════════════════════════════
     HISTORY
  ═══════════════════════════════════════ */
  function pushHistory() {
    historyIndex++;
    history = history.slice(0, historyIndex);
    history.push(JSON.stringify(state));
    if (history.length > MAX_HISTORY) {
      history.shift();
      historyIndex--;
    }
  }

  function undo() {
    if (historyIndex > 0) {
      historyIndex--;
      state = JSON.parse(history[historyIndex]);
      applyTheme();
      applyColors();
      applyCardStyle();
    }
  }

  function redo() {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      state = JSON.parse(history[historyIndex]);
      applyTheme();
      applyColors();
      applyCardStyle();
    }
  }

  /* ═══════════════════════════════════════
     BUILD PANEL
  ═══════════════════════════════════════ */
  function buildPanel() {
    closePanelSilent();

    const el = document.createElement("div");
    el.className = "ts-overlay";
    el.id = "tsOverlay";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", "Theme Studio");

    const presetsHTML = PRESETS.map(p => `
      <button class="ts-thumb" data-url="${p.url}" aria-label="${p.name}" tabindex="0">
        <img src="${p.url}" alt="${p.name}" loading="lazy">
        <span class="ts-thumb-name">${p.name}</span>
      </button>
    `).join("");

    const gradientsHTML = GRADIENTS.map(g => `
      <button class="ts-grad" data-css="${g.css}" aria-label="${g.name}" tabindex="0" style="background:${g.css}"></button>
    `).join("");

    const positions = ["center", "top", "bottom", "left", "right"];
    const posHTML = positions.map(p => `<option value="${p}" ${state.bgPosition === p ? "selected" : ""}>${p}</option>`).join("");

    const modes = [
      { id: "light", icon: "☀️", label: "فاتح" },
      { id: "dark", icon: "🌙", label: "داكن" },
      { id: "auto", icon: "🔄", label: "تلقائي" },
    ];
    const modesHTML = modes.map(m => `
      <button class="ts-mode-btn ${state.mode === m.id ? "ts-active" : ""}" data-mode="${m.id}" aria-label="${m.label}" tabindex="0">
        <span>${m.icon}</span>
        <span>${m.label}</span>
      </button>
    `).join("");

    el.innerHTML = `
      <div class="ts-panel">
        <div class="ts-header">
          <div class="ts-header-left">
            <span class="ts-logo">🎨</span>
            <h3>Theme Studio</h3>
          </div>
          <div class="ts-header-actions">
            <button class="ts-icon-btn" id="tsUndo" aria-label="تراجع" title="تراجع (Ctrl+Z)">↩</button>
            <button class="ts-icon-btn" id="tsRedo" aria-label="إعادة" title="إعادة (Ctrl+Y)">↪</button>
            <button class="ts-icon-btn ts-close" id="tsClose" aria-label="إغلاق">&times;</button>
          </div>
        </div>

        <div class="ts-body">

          <div class="ts-section">
            <p class="ts-label">الوضع</p>
            <div class="ts-modes">${modesHTML}</div>
          </div>

          <div class="ts-section">
            <p class="ts-label">نوع الخلفية</p>
            <div class="ts-type-tabs">
              <button class="ts-type-tab ${state.bgType === "image" ? "ts-active" : ""}" data-type="image" tabindex="0">🖼️ صورة</button>
              <button class="ts-type-tab ${state.bgType === "gradient" ? "ts-active" : ""}" data-type="gradient" tabindex="0">🌈 تدرج</button>
              <button class="ts-type-tab ${state.bgType === "solid" ? "ts-active" : ""}" data-type="solid" tabindex="0">🎨 لون</button>
            </div>
          </div>

          <div class="ts-section" id="tsImageSection" style="display:${state.bgType === "image" ? "block" : "none"}">
            <p class="ts-label">الصور الجاهزة</p>
            <div class="ts-grid">${presetsHTML}</div>
            <p class="ts-label" style="margin-top:12px">أو ارفع صورة</p>
            <div class="ts-drop" id="tsDrop" tabindex="0" role="button" aria-label="رفع صورة">
              <input type="file" id="tsFile" accept="image/*" hidden>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span>اسحب صورة أو اضغط للاختيار</span>
              <small>PNG, JPG, WEBP — حد أقصى 5MB</small>
            </div>
          </div>

          <div class="ts-section" id="tsGradientSection" style="display:${state.bgType === "gradient" ? "block" : "none"}">
            <p class="ts-label">التدرجات الجاهزة</p>
            <div class="ts-grad-grid">${gradientsHTML}</div>
            <p class="ts-label" style="margin-top:12px">أو اكتب تدرج مخصص</p>
            <input type="text" class="ts-input" id="tsCustomGradient" placeholder="linear-gradient(135deg, #05e0e0, #ffd500)" value="${state.bgGradient}" aria-label="تدرج مخصص">
          </div>

          <div class="ts-section" id="tsSolidSection" style="display:${state.bgType === "solid" ? "block" : "none"}">
            <p class="ts-label">اختر لون</p>
            <div class="ts-color-row">
              <input type="color" class="ts-color-picker" id="tsSolidColor" value="${state.bgColor}" aria-label="لون الخلفية">
              <input type="text" class="ts-input" id="tsSolidHex" value="${state.bgColor}" aria-label="كود اللون">
            </div>
          </div>

          <div class="ts-section">
            <p class="ts-label">موضع الخلفية</p>
            <select class="ts-select" id="tsPosition" aria-label="موضع الخلفية">${posHTML}</select>
            <p class="ts-label">حجم الخلفية</p>
            <select class="ts-select" id="tsSize" aria-label="حجم الخلفية">
              <option value="cover" ${state.bgSize === "cover" ? "selected" : ""}>Cover</option>
              <option value="contain" ${state.bgSize === "contain" ? "selected" : ""}>Contain</option>
              <option value="100% 100%" ${state.bgSize === "100% 100%" ? "selected" : ""}>Stretch</option>
            </select>
          </div>

          <div class="ts-section">
            <p class="ts-label">شفافية الطبقة الداكنة — <span id="tsOverlayVal">${state.overlayOpacity}%</span></p>
            <input type="range" class="ts-range" id="tsOverlay" min="0" max="90" value="${state.overlayOpacity}" aria-label="شفافية الطبقة الداكنة">
          </div>

          <div class="ts-section">
            <p class="ts-label">الضبابية — <span id="tsBlurVal">${state.blur}px</span></p>
            <input type="range" class="ts-range" id="tsBlur" min="0" max="20" value="${state.blur}" aria-label="الضبابية">
          </div>

          <div class="ts-section">
            <p class="ts-label">اللون الأساسي</p>
            <div class="ts-color-row">
              <input type="color" class="ts-color-picker" id="tsPrimary" value="${state.primaryColor}" aria-label="اللون الأساسي">
              <input type="text" class="ts-input" id="tsPrimaryHex" value="${state.primaryColor}" aria-label="كود اللون الأساسي">
            </div>
            <p class="ts-label">اللون المميز</p>
            <div class="ts-color-row">
              <input type="color" class="ts-color-picker" id="tsAccent" value="${state.accentColor}" aria-label="اللون المميز">
              <input type="text" class="ts-input" id="tsAccentHex" value="${state.accentColor}" aria-label="كود اللون المميز">
            </div>
          </div>

          <div class="ts-section">
            <p class="ts-label">شكل الكروت</p>
            <div class="ts-type-tabs">
              <button class="ts-type-tab ${state.cardStyle === "glass" ? "ts-active" : ""}" data-card="glass" tabindex="0">🪟 زجاجي</button>
              <button class="ts-type-tab ${state.cardStyle === "solid" ? "ts-active" : ""}" data-card="solid" tabindex="0">⬜ صلب</button>
              <button class="ts-type-tab ${state.cardStyle === "outline" ? "ts-active" : ""}" data-card="outline" tabindex="0">🔲 إطار</button>
            </div>
          </div>

        </div>

        <div class="ts-footer">
          <button class="ts-btn ts-btn-ghost" id="tsReset" aria-label="إعادة تعيين">إعادة تعيين</button>
          <div class="ts-footer-right">
            <button class="ts-btn ts-btn-ghost" id="tsCancel" aria-label="إلغاء">إلغاء</button>
            <button class="ts-btn ts-btn-primary" id="tsApply" aria-label="تطبيق">تطبيق ✓</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(el);
    panelEl = el;
    bindEvents(el);
    refreshUI();
  }

  function closePanelSilent() {
    const old = document.getElementById("tsOverlay");
    if (old) old.remove();
  }

  /* ═══════════════════════════════════════
     BIND EVENTS
  ═══════════════════════════════════════ */
  function bindEvents(el) {
    const $ = sel => el.querySelector(sel);
    const $$ = sel => el.querySelectorAll(sel);

    $("#tsClose").addEventListener("click", closePanel);
    $("#tsCancel").addEventListener("click", closePanel);
    el.addEventListener("click", e => { if (e.target === el) closePanel(); });

    $("#tsUndo").addEventListener("click", () => { undo(); refreshUI(); });
    $("#tsRedo").addEventListener("click", () => { redo(); refreshUI(); });

    $$(".ts-mode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.mode = btn.dataset.mode;
        $$(".ts-mode-btn").forEach(b => b.classList.remove("ts-active"));
        btn.classList.add("ts-active");
        applyMode();
      });
    });

    $$(".ts-type-tab[data-type]").forEach(tab => {
      tab.addEventListener("click", () => {
        state.bgType = tab.dataset.type;
        $$(".ts-type-tab[data-type]").forEach(t => t.classList.remove("ts-active"));
        tab.classList.add("ts-active");
        toggleSections();
      });
    });

    $$(".ts-thumb").forEach(thumb => {
      thumb.addEventListener("click", () => {
        state.bgType = "image";
        state.bgImage = thumb.dataset.url;
        applyTheme();
        refreshUI();
      });
    });

    $$(".ts-grad").forEach(g => {
      g.addEventListener("click", () => {
        state.bgType = "gradient";
        state.bgGradient = g.dataset.css;
        applyTheme();
        refreshUI();
      });
    });

    const customGrad = $("#tsCustomGradient");
    if (customGrad) {
      customGrad.addEventListener("input", () => {
        state.bgGradient = customGrad.value;
        applyTheme();
      });
    }

    const solidPicker = $("#tsSolidColor");
    const solidHex = $("#tsSolidHex");
    if (solidPicker) {
      solidPicker.addEventListener("input", () => {
        state.bgColor = solidPicker.value;
        if (solidHex) solidHex.value = solidPicker.value;
        applyTheme();
      });
    }
    if (solidHex) {
      solidHex.addEventListener("input", () => {
        if (/^#[0-9a-fA-F]{6}$/.test(solidHex.value)) {
          state.bgColor = solidHex.value;
          if (solidPicker) solidPicker.value = solidHex.value;
          applyTheme();
        }
      });
    }

    const posSelect = $("#tsPosition");
    if (posSelect) {
      posSelect.addEventListener("change", () => {
        state.bgPosition = posSelect.value;
        applyTheme();
      });
    }

    const sizeSelect = $("#tsSize");
    if (sizeSelect) {
      sizeSelect.addEventListener("change", () => {
        state.bgSize = sizeSelect.value;
        applyTheme();
      });
    }

    const overlayRange = $("#tsOverlay");
    const overlayVal = $("#tsOverlayVal");
    if (overlayRange) {
      overlayRange.addEventListener("input", () => {
        state.overlayOpacity = parseInt(overlayRange.value, 10);
        if (overlayVal) overlayVal.textContent = state.overlayOpacity + "%";
        applyTheme();
      });
    }

    const blurRange = $("#tsBlur");
    const blurVal = $("#tsBlurVal");
    if (blurRange) {
      blurRange.addEventListener("input", () => {
        state.blur = parseInt(blurRange.value, 10);
        if (blurVal) blurVal.textContent = state.blur + "px";
        applyTheme();
      });
    }

    const primaryPicker = $("#tsPrimary");
    const primaryHex = $("#tsPrimaryHex");
    if (primaryPicker) {
      primaryPicker.addEventListener("input", () => {
        state.primaryColor = primaryPicker.value;
        if (primaryHex) primaryHex.value = primaryPicker.value;
        applyColors();
      });
    }
    if (primaryHex) {
      primaryHex.addEventListener("input", () => {
        if (/^#[0-9a-fA-F]{6}$/.test(primaryHex.value)) {
          state.primaryColor = primaryHex.value;
          if (primaryPicker) primaryPicker.value = primaryHex.value;
          applyColors();
        }
      });
    }

    const accentPicker = $("#tsAccent");
    const accentHex = $("#tsAccentHex");
    if (accentPicker) {
      accentPicker.addEventListener("input", () => {
        state.accentColor = accentPicker.value;
        if (accentHex) accentHex.value = accentPicker.value;
        applyColors();
      });
    }
    if (accentHex) {
      accentHex.addEventListener("input", () => {
        if (/^#[0-9a-fA-F]{6}$/.test(accentHex.value)) {
          state.accentColor = accentHex.value;
          if (accentPicker) accentPicker.value = accentHex.value;
          applyColors();
        }
      });
    }

    $$(".ts-type-tab[data-card]").forEach(tab => {
      tab.addEventListener("click", () => {
        state.cardStyle = tab.dataset.card;
        $$(".ts-type-tab[data-card]").forEach(t => t.classList.remove("ts-active"));
        tab.classList.add("ts-active");
        applyCardStyle();
      });
    });

    const drop = $("#tsDrop");
    const fileInput = $("#tsFile");
    if (drop && fileInput) {
      drop.addEventListener("click", () => fileInput.click());
      drop.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } });
      drop.addEventListener("dragover", e => { e.preventDefault(); drop.classList.add("ts-over"); });
      drop.addEventListener("dragleave", () => drop.classList.remove("ts-over"));
      drop.addEventListener("drop", e => {
        e.preventDefault();
        drop.classList.remove("ts-over");
        const f = e.dataTransfer.files[0];
        if (f && f.type.startsWith("image/")) handleUpload(f);
      });
      fileInput.addEventListener("change", () => {
        if (fileInput.files[0]) handleUpload(fileInput.files[0]);
      });
    }

    $("#tsReset").addEventListener("click", () => {
      state = { ...DEFAULTS };
      applyTheme();
      applyColors();
      applyCardStyle();
      applyMode();
      refreshUI();
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* silent */ }
    });

    $("#tsApply").addEventListener("click", () => {
      pushHistory();
      save();
      closePanel();
    });
  }

  /* ═══════════════════════════════════════
     FILE UPLOAD + COMPRESS
  ═══════════════════════════════════════ */
  function handleUpload(file) {
    if (file.size > 5 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_W = 1920;
        const MAX_H = 1080;
        let w = img.width;
        let h = img.height;

        if (w > MAX_W) { h = Math.round(h * MAX_W / w); w = MAX_W; }
        if (h > MAX_H) { w = Math.round(w * MAX_H / h); h = MAX_H; }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);

        const compressed = canvas.toDataURL("image/jpeg", 0.8);
        state.bgType = "image";
        state.bgImage = compressed;
        applyTheme();
        refreshUI();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /* ═══════════════════════════════════════
     APPLY THEME (v2.1 - Safe)
     شاشة التحميل مش هتتغير
  ═══════════════════════════════════════ */
  function applyTheme() {
    const targets = [
      document.body,
      document.querySelector(".gallery-page"),
    ].filter(Boolean);

    targets.forEach(el => {
      el.style.backgroundImage = "";
      el.style.backgroundSize = "";
      el.style.backgroundPosition = "";
      el.style.backgroundRepeat = "";
      el.classList.remove("ts-bg-active");

      if (state.bgType === "image" && state.bgImage) {
        el.style.backgroundImage = `url("${state.bgImage}")`;
        el.classList.add("ts-bg-active");
      } else if (state.bgType === "gradient" && state.bgGradient) {
        el.style.backgroundImage = state.bgGradient;
        el.classList.add("ts-bg-active");
      } else if (state.bgType === "solid" && state.bgColor) {
        el.style.backgroundImage = state.bgColor;
        el.classList.add("ts-bg-active");
      }

      el.style.backgroundSize = state.bgSize;
      el.style.backgroundPosition = state.bgPosition;
      el.style.backgroundRepeat = "no-repeat";
    });

    applyOverlay();
    applyBlur();
  }

  /* ═══════════════════════════════════════
     APPLY OVERLAY (v2.1 - Safe)
  ═══════════════════════════════════════ */
  function applyOverlay() {
    let overlayCSS = document.getElementById("tsOverlayCSS");
    if (overlayCSS) overlayCSS.remove();

    if (state.overlayOpacity > 0) {
      const s = document.createElement("style");
      s.id = "tsOverlayCSS";
      s.textContent = `
        .ts-bg-active{isolation:isolate}
        section.ts-bg-active,header.ts-bg-active,.gallery-page.ts-bg-active{position:relative}
        .ts-bg-active::before{content:'';position:absolute;inset:0;background:rgba(0,0,0,${state.overlayOpacity / 100});z-index:-1;pointer-events:none;border-radius:inherit}
        body.ts-bg-active::before{position:fixed;border-radius:0;z-index:-1}
      `;
      document.head.appendChild(s);
    }
  }

  /* ═══════════════════════════════════════
     APPLY BLUR (v2.1 - Safe)
  ═══════════════════════════════════════ */
  function applyBlur() {
    let blurCSS = document.getElementById("tsBlurCSS");
    if (blurCSS) blurCSS.remove();

    if (state.blur > 0) {
      const s = document.createElement("style");
      s.id = "tsBlurCSS";
      s.textContent = `
        .ts-bg-active::after{content:'';position:absolute;inset:0;backdrop-filter:blur(${state.blur}px);-webkit-backdrop-filter:blur(${state.blur}px);z-index:-1;pointer-events:none;border-radius:inherit}
        body.ts-bg-active::after{position:fixed;border-radius:0;z-index:-1}
      `;
      document.head.appendChild(s);
    }
  }

  /* ═══════════════════════════════════════
     APPLY COLORS
  ═══════════════════════════════════════ */
  function applyColors() {
    let colorCSS = document.getElementById("tsColorCSS");
    if (colorCSS) colorCSS.remove();

    const s = document.createElement("style");
    s.id = "tsColorCSS";
    s.textContent = `:root{--primary:${state.primaryColor};--secondary:${state.accentColor}}`;
    document.head.appendChild(s);
  }

  /* ═══════════════════════════════════════
     APPLY CARD STYLE
  ═══════════════════════════════════════ */
  function applyCardStyle() {
    let cardCSS = document.getElementById("tsCardCSS");
    if (cardCSS) cardCSS.remove();

    let css = "";
    if (state.cardStyle === "glass") {
      css = `section,article,aside,.offer-card,.testimonial,.counter-box,.faq-item{background:rgba(255,255,255,.06)!important;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1)!important}`;
    } else if (state.cardStyle === "solid") {
      css = `section,article,aside,.offer-card,.testimonial,.counter-box,.faq-item{background:rgba(0,0,0,.6)!important;backdrop-filter:none;border:1px solid rgba(255,255,255,.08)!important}`;
    } else if (state.cardStyle === "outline") {
      css = `section,article,aside,.offer-card,.testimonial,.counter-box,.faq-item{background:transparent!important;backdrop-filter:none;border:2px solid var(--primary,#05e0e0)!important}`;
    }

    if (css) {
      const s = document.createElement("style");
      s.id = "tsCardCSS";
      s.textContent = css;
      document.head.appendChild(s);
    }
  }

  /* ═══════════════════════════════════════
     APPLY MODE
  ═══════════════════════════════════════ */
  function applyMode() {
    document.documentElement.removeAttribute("data-theme");
    if (state.mode === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else if (state.mode === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }
  }

  /* ═══════════════════════════════════════
     UI HELPERS
  ═══════════════════════════════════════ */
  function toggleSections() {
    if (!panelEl) return;
    const imgSec = panelEl.querySelector("#tsImageSection");
    const gradSec = panelEl.querySelector("#tsGradientSection");
    const solidSec = panelEl.querySelector("#tsSolidSection");

    if (imgSec) imgSec.style.display = state.bgType === "image" ? "block" : "none";
    if (gradSec) gradSec.style.display = state.bgType === "gradient" ? "block" : "none";
    if (solidSec) solidSec.style.display = state.bgType === "solid" ? "block" : "none";
  }

  function refreshUI() {
    if (!panelEl) return;

    const $ = sel => panelEl.querySelector(sel);
    const $$ = sel => panelEl.querySelectorAll(sel);

    $$(".ts-mode-btn").forEach(b => {
      b.classList.toggle("ts-active", b.dataset.mode === state.mode);
    });

    $$(".ts-type-tab[data-type]").forEach(t => {
      t.classList.toggle("ts-active", t.dataset.type === state.bgType);
    });

    $$(".ts-type-tab[data-card]").forEach(t => {
      t.classList.toggle("ts-active", t.dataset.card === state.cardStyle);
    });

    const posSelect = $("#tsPosition");
    if (posSelect) posSelect.value = state.bgPosition;
    const sizeSelect = $("#tsSize");
    if (sizeSelect) sizeSelect.value = state.bgSize;

    const overlayRange = $("#tsOverlay");
    const overlayVal = $("#tsOverlayVal");
    if (overlayRange) overlayRange.value = state.overlayOpacity;
    if (overlayVal) overlayVal.textContent = state.overlayOpacity + "%";

    const blurRange = $("#tsBlur");
    const blurVal = $("#tsBlurVal");
    if (blurRange) blurRange.value = state.blur;
    if (blurVal) blurVal.textContent = state.blur + "px";

    const primaryPicker = $("#tsPrimary");
    const primaryHex = $("#tsPrimaryHex");
    if (primaryPicker) primaryPicker.value = state.primaryColor;
    if (primaryHex) primaryHex.value = state.primaryColor;

    const accentPicker = $("#tsAccent");
    const accentHex = $("#tsAccentHex");
    if (accentPicker) accentPicker.value = state.accentColor;
    if (accentHex) accentHex.value = state.accentColor;

    const solidPicker = $("#tsSolidColor");
    const solidHex = $("#tsSolidHex");
    if (solidPicker) solidPicker.value = state.bgColor;
    if (solidHex) solidHex.value = state.bgColor;

    const customGrad = $("#tsCustomGradient");
    if (customGrad) customGrad.value = state.bgGradient;

    toggleSections();
  }

  /* ═══════════════════════════════════════
     SAVE / LOAD
  ═══════════════════════════════════════ */
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      try {
        const fallback = { ...state };
        if (fallback.bgImage && fallback.bgImage.length > 500000) {
          fallback.bgImage = "";
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
      } catch (e2) { /* silent */ }
    }
  }

  function loadSaved() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved) {
        state = { ...DEFAULTS, ...saved };
        applyTheme();
        applyColors();
        applyCardStyle();
        applyMode();
      }
    } catch (e) { /* silent */ }
    pushHistory();
  }

  /* ═══════════════════════════════════════
     CSS
  ═══════════════════════════════════════ */
  function injectCSS() {
    if (document.getElementById("tsCSS")) return;
    const s = document.createElement("style");
    s.id = "tsCSS";
    s.textContent = `
      #tsTrigger{position:fixed;top:50%;right:20px;transform:translateY(-50%);z-index:9999;width:48px;height:48px;border-radius:50%;border:none;background:#fff;color:#333;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(0,0,0,.15);transition:all .25s ease}
      #tsTrigger:hover{transform:translateY(-50%) scale(1.1);box-shadow:0 4px 20px rgba(0,0,0,.2)}
      #tsTrigger:active{transform:translateY(-50%) scale(.95)}

      .ts-overlay{position:fixed;inset:0;z-index:99997;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;animation:tsIn .2s ease}
      @keyframes tsIn{from{opacity:0}to{opacity:1}}

      .ts-panel{background:#fff;border-radius:16px;width:100%;max-width:580px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.25);animation:tsUp .3s cubic-bezier(.16,1,.3,1);overflow:hidden}
      @keyframes tsUp{from{opacity:0;transform:translateY(30px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}

      .ts-header{display:flex;align-items:center;justify-content:space-between;padding:18px 24px;border-bottom:1px solid #f0f0f2}
      .ts-header-left{display:flex;align-items:center;gap:10px}
      .ts-logo{font-size:22px}
      .ts-header h3{font-size:17px;font-weight:700;color:#1a1a2e;margin:0}
      .ts-header-actions{display:flex;gap:6px}
      .ts-icon-btn{width:32px;height:32px;border:none;background:#f5f5f7;border-radius:8px;font-size:16px;color:#666;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
      .ts-icon-btn:hover{background:#eee;color:#333}
      .ts-close{font-size:20px}
      .ts-close:hover{background:#fee;color:#e33}

      .ts-body{padding:16px 24px;overflow-y:auto;flex:1}
      .ts-section{margin-bottom:18px}
      .ts-label{font-size:12px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:.5px;margin:12px 0 8px}

      .ts-modes{display:flex;gap:8px}
      .ts-mode-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 8px;border-radius:10px;border:2px solid #e8e8ee;background:#fafafa;cursor:pointer;font-size:12px;color:#555;transition:all .2s;font-family:inherit}
      .ts-mode-btn span:first-child{font-size:20px}
      .ts-mode-btn:hover{border-color:#ccc;background:#f0f0f2}
      .ts-mode-btn.ts-active{border-color:var(--primary,#05e0e0);background:rgba(5,224,224,.06);color:#333}

      .ts-type-tabs{display:flex;gap:6px}
      .ts-type-tab{flex:1;padding:9px 8px;border-radius:8px;border:2px solid #e8e8ee;background:#fafafa;cursor:pointer;font-size:13px;color:#555;transition:all .2s;font-family:inherit}
      .ts-type-tab:hover{border-color:#ccc}
      .ts-type-tab.ts-active{border-color:var(--primary,#05e0e0);background:rgba(5,224,224,.06);color:#333;font-weight:600}

      .ts-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
      .ts-thumb{position:relative;border-radius:10px;overflow:hidden;border:2px solid transparent;cursor:pointer;padding:0;background:none;aspect-ratio:16/10;transition:all .2s}
      .ts-thumb img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s}
      .ts-thumb:hover{border-color:var(--primary,#05e0e0);transform:scale(1.03);box-shadow:0 4px 12px rgba(0,0,0,.15)}
      .ts-thumb:hover img{transform:scale(1.08)}
      .ts-thumb-name{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,.7));color:#fff;font-size:10px;padding:12px 6px 5px;text-align:center;opacity:0;transition:opacity .2s}
      .ts-thumb:hover .ts-thumb-name{opacity:1}

      .ts-grad-grid{display:flex;gap:8px;flex-wrap:wrap}
      .ts-grad{width:60px;height:40px;border-radius:8px;border:2px solid transparent;cursor:pointer;transition:all .2s}
      .ts-grad:hover{border-color:#333;transform:scale(1.08)}

      .ts-drop{border:2px dashed #ddd;border-radius:12px;padding:24px;text-align:center;cursor:pointer;transition:all .2s;color:#999;display:flex;flex-direction:column;align-items:center;gap:6px;font-size:13px}
      .ts-drop:hover,.ts-drop.ts-over{border-color:var(--primary,#05e0e0);background:rgba(5,224,224,.03);color:var(--primary,#05e0e0)}
      .ts-drop small{font-size:11px;color:#bbb}

      .ts-input{width:100%;padding:10px 14px;border-radius:8px;border:1.5px solid #e0e0e2;font-size:14px;color:#333;outline:none;transition:border .2s;font-family:inherit;background:#fafafa}
      .ts-input:focus{border-color:var(--primary,#05e0e0)}

      .ts-select{width:100%;padding:10px 14px;border-radius:8px;border:1.5px solid #e0e0e2;font-size:14px;color:#333;outline:none;background:#fafafa;cursor:pointer;font-family:inherit}
      .ts-select:focus{border-color:var(--primary,#05e0e0)}

      .ts-range{width:100%;accent-color:var(--primary,#05e0e0);cursor:pointer}

      .ts-color-row{display:flex;align-items:center;gap:10px}
      .ts-color-picker{width:48px;height:38px;border:none;border-radius:8px;cursor:pointer;padding:0;background:none}
      .ts-color-picker::-webkit-color-swatch-wrapper{padding:2px}
      .ts-color-picker::-webkit-color-swatch{border-radius:6px;border:1px solid #ddd}

      .ts-footer{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;border-top:1px solid #f0f0f2}
      .ts-footer-right{display:flex;gap:8px}
      .ts-btn{padding:10px 22px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;border:none;font-family:inherit}
      .ts-btn-primary{background:var(--primary,#05e0e0);color:#111}
      .ts-btn-primary:hover{filter:brightness(1.1);box-shadow:0 2px 10px rgba(5,224,224,.3)}
      .ts-btn-ghost{background:#f5f5f7;color:#555;border:1px solid #e0e0e2}
      .ts-btn-ghost:hover{background:#eee;color:#333}

      @media(max-width:600px){
        .ts-panel{max-width:100%;border-radius:12px;max-height:92vh}
        .ts-grid{grid-template-columns:repeat(3,1fr)}
        .ts-modes{flex-wrap:wrap}
        #tsTrigger{width:42px;height:42px;right:12px}
        #tsTrigger svg{width:18px;height:18px}
      }

      @media print{
        #tsTrigger,.ts-overlay{display:none!important}
      }
    `;
    document.head.appendChild(s);
  }

  return { init };
})();


/* ═══ التشغيل ═══ */
document.addEventListener("DOMContentLoaded", () => {
  ThemeStudio.init();
});