/**
 * @fileoverview EliteSports Pro - Pricing Tools & Registration Card
 * ملف مستقل (مش هيأثر على أي ملف تاني) بيضيف 3 مميزات:
 *  1) حاسبة أسعار تفاعلية (PricingCalculatorModule)
 *  2) مقارنة باقات الاشتراك (PlanComparisonModule)
 *  3) كارت تسجيل قابل للتحميل بعد نجاح التسجيل (RegistrationCardModule)
 * الملف بيحقن الـ CSS بتاعه بنفسه، ومش محتاج أي تعديل في ملفات CSS الموجودة.
 * @version 1.0.0
 */
"use strict";

/* ═══════════════════════════════════════════════════════════
   § بيانات الأسعار (نفس أسعار قسم "Affordable Prices")
   ═══════════════════════════════════════════════════════════ */
const PRICE_DATA = [
  { emoji: "⚽", name: "Football", old: 500, price: 300 },
  { emoji: "🏀", name: "Basketball", old: 600, price: 400 },
  { emoji: "🏐", name: "Volleyball", old: 550, price: 350 },
  { emoji: "🤾", name: "Handball", old: 500, price: 350 },
  { emoji: "🤽", name: "Water Polo", old: 900, price: 600 },
  { emoji: "🎾", name: "Squash", old: 750, price: 500 },
  { emoji: "🎾", name: "Tennis", old: 900, price: 600 },
  { emoji: "🏓", name: "Table Tennis", old: 450, price: 300 },
  { emoji: "🏸", name: "Badminton", old: 600, price: 400 },
  { emoji: "🏊", name: "Swimming", old: 1000, price: 700 },
  { emoji: "🏃", name: "Athletics", old: 800, price: 500 },
  { emoji: "🏃", name: "Running", old: 600, price: 400 },
  { emoji: "🚴", name: "Cycling", old: 700, price: 450 },
  { emoji: "🥊", name: "Boxing", old: 900, price: 700 },
  { emoji: "🤼", name: "Wrestling", old: 700, price: 450 },
  { emoji: "🥋", name: "Judo", old: 800, price: 500 },
  { emoji: "🥋", name: "Karate", old: 700, price: 450 },
  { emoji: "🥋", name: "Taekwondo", old: 750, price: 500 },
  { emoji: "🥊", name: "Kickboxing", old: 850, price: 550 },
  { emoji: "🥋", name: "Kung Fu", old: 800, price: 500 },
  { emoji: "🤼", name: "Sambo", old: 850, price: 550 },
  { emoji: "🤺", name: "Fencing", old: 1100, price: 700 },
  { emoji: "🏋️", name: "Weightlifting", old: 900, price: 600 },
  { emoji: "🤸", name: "Gymnastics", old: 1100, price: 700 },
  { emoji: "🎯", name: "Shooting", old: 1200, price: 1000 },
  { emoji: "🏹", name: "Archery", old: 900, price: 600 },
  { emoji: "🐎", name: "Equestrian", old: 2200, price: 1500 },
  { emoji: "🚣", name: "Rowing", old: 1100, price: 700 },
  { emoji: "🛶", name: "Canoe/Kayak", old: 1200, price: 800 },
  { emoji: "⛵", name: "Sailing", old: 1500, price: 1000 },
  { emoji: "🤿", name: "Diving", old: 1400, price: 900 },
  { emoji: "🎿", name: "Water Skiing", old: 1800, price: 1200 },
  { emoji: "♟️", name: "Chess", old: 400, price: 250 },
  { emoji: "🎱", name: "Billiards", old: 550, price: 350 },
  { emoji: "🏅", name: "Modern Pentathlon", old: 1600, price: 1000 },
  { emoji: "🏊", name: "Triathlon", old: 1700, price: 1100 },
  { emoji: "🛹", name: "Skateboarding", old: 800, price: 500 },
  { emoji: "🧗", name: "Rock Climbing", old: 1100, price: 700 },
  { emoji: "🧘", name: "Yoga", old: 650, price: 400 },
  { emoji: "💪", name: "Fitness", old: 700, price: 450 },
  { emoji: "🏋️", name: "CrossFit", old: 950, price: 600 },
];

const DURATIONS = [
  { months: 1, label: "شهر واحد", discount: 0 },
  { months: 3, label: "3 شهور", discount: 0.05 },
  { months: 6, label: "6 شهور", discount: 0.10 },
  { months: 12, label: "سنة كاملة", discount: 0.18 },
];

function injectSharedStyles() {
  if (document.getElementById("espPricingToolsStyles")) return;
  const st = document.createElement("style");
  st.id = "espPricingToolsStyles";
  st.textContent = `
    .esp-tool-section{max-width:1000px;margin:60px auto;padding:0 20px;font-family:'Segoe UI',Tahoma,Arial,sans-serif;direction:rtl;}
    .esp-tool-card{background:linear-gradient(170deg,rgba(255,255,255,.04),rgba(255,255,255,.01));border:1px solid rgba(200,170,80,.2);border-radius:24px;padding:32px;backdrop-filter:blur(20px);}
    .esp-tool-title{font-size:26px;font-weight:800;margin:0 0 6px;background:linear-gradient(135deg,#c9a84c,#f0d078);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-align:center;}
    .esp-tool-sub{text-align:center;color:rgba(200,200,220,.6);font-size:14px;margin:0 0 26px;}
    .esp-calc-row{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:22px;}
    .esp-calc-field{flex:1;min-width:200px;}
    .esp-calc-field label{display:block;font-size:13px;color:rgba(200,200,220,.7);margin-bottom:8px;font-weight:600;}
    .esp-calc-field select{width:100%;padding:14px 16px;border-radius:12px;border:1px solid rgba(200,170,80,.25);background:rgba(10,10,20,.5);color:#f0e8d8;font-size:15px;outline:none;cursor:pointer;}
    .esp-calc-field select:focus{border-color:rgba(200,170,80,.6);}
    .esp-calc-result{background:rgba(200,170,80,.08);border:1px solid rgba(200,170,80,.25);border-radius:16px;padding:24px;text-align:center;}
    .esp-calc-total{font-size:38px;font-weight:900;color:#f0d078;margin:0;}
    .esp-calc-old{font-size:16px;color:rgba(200,200,220,.45);text-decoration:line-through;margin:4px 0;}
    .esp-calc-save{font-size:14px;color:#6fdc8c;font-weight:700;margin-top:6px;}
    .esp-plans-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;}
    .esp-plan-card{background:rgba(255,255,255,.03);border:1px solid rgba(200,170,80,.18);border-radius:18px;padding:26px 20px;text-align:center;position:relative;transition:transform .3s ease,border-color .3s ease;}
    .esp-plan-card:hover{transform:translateY(-6px);border-color:rgba(200,170,80,.5);}
    .esp-plan-card.best{border-color:#f0d078;box-shadow:0 0 30px rgba(240,208,120,.15);}
    .esp-plan-badge{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#8b6914,#c9a84c);color:#fff;font-size:11px;font-weight:800;padding:5px 16px;border-radius:20px;white-space:nowrap;}
    .esp-plan-name{font-size:16px;font-weight:800;color:#f0e8d8;margin:10px 0 4px;}
    .esp-plan-price{font-size:30px;font-weight:900;color:#f0d078;margin:8px 0 2px;}
    .esp-plan-per{font-size:12px;color:rgba(200,200,220,.5);}
    .esp-plan-save{font-size:12px;color:#6fdc8c;font-weight:700;margin-top:8px;}
    .esp-plan-note{font-size:11px;color:rgba(200,200,220,.4);margin-top:14px;line-height:1.6;}
    .esp-card-modal-overlay{position:fixed;inset:0;background:rgba(5,5,10,.75);backdrop-filter:blur(6px);z-index:999998;display:flex;align-items:center;justify-content:center;padding:20px;}
    .esp-card-modal{background:#12121e;border:1px solid rgba(200,170,80,.3);border-radius:20px;padding:24px;max-width:420px;width:100%;text-align:center;font-family:'Segoe UI',Tahoma,Arial,sans-serif;}
    .esp-card-modal h3{color:#f0d078;margin:0 0 14px;font-size:18px;}
    .esp-card-modal canvas{width:100%;border-radius:12px;margin-bottom:16px;border:1px solid rgba(200,170,80,.2);}
    .esp-card-modal-actions{display:flex;gap:10px;}
    .esp-card-modal-actions button{flex:1;padding:12px;border-radius:10px;border:none;font-weight:700;cursor:pointer;font-size:14px;}
    .esp-card-btn-download{background:linear-gradient(135deg,#8b6914,#c9a84c);color:#fff;}
    .esp-card-btn-close{background:rgba(255,255,255,.08);color:#e0d8c8;}
  `;
  document.head.appendChild(st);
}

/* ═══════════════════════════════════════════════════════════
   § MODULE: حاسبة الأسعار التفاعلية
   ═══════════════════════════════════════════════════════════ */
const PricingCalculatorModule = (() => {
  function init() {
    const root = document.getElementById("pricing-calculator-root");
    if (!root) return;
    injectSharedStyles();
    root.innerHTML = `
      <div class="esp-tool-section">
        <div class="esp-tool-card">
          <h2 class="esp-tool-title">🧮 احسب اشتراكك بنفسك</h2>
          <p class="esp-tool-sub">اختار الرياضة والمدة وشوف السعر والخصم فورًا</p>
          <div class="esp-calc-row">
            <div class="esp-calc-field">
              <label for="calcSport">الرياضة</label>
              <select id="calcSport"></select>
            </div>
            <div class="esp-calc-field">
              <label for="calcDuration">مدة الاشتراك</label>
              <select id="calcDuration"></select>
            </div>
          </div>
          <div class="esp-calc-result">
            <p class="esp-calc-old" id="calcOld"></p>
            <p class="esp-calc-total" id="calcTotal">—</p>
            <p class="esp-calc-save" id="calcSave"></p>
          </div>
        </div>
      </div>`;

    const sportSel = document.getElementById("calcSport");
    const durSel = document.getElementById("calcDuration");
    PRICE_DATA.forEach((s, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${s.emoji} ${s.name}`;
      sportSel.appendChild(opt);
    });
    DURATIONS.forEach((d, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = d.label + (d.discount ? ` (خصم ${Math.round(d.discount * 100)}%)` : "");
      durSel.appendChild(opt);
    });

    function recalc() {
      const sport = PRICE_DATA[sportSel.value];
      const dur = DURATIONS[durSel.value];
      const base = sport.price * dur.months;
      const total = Math.round(base * (1 - dur.discount));
      const saved = base - total;
      document.getElementById("calcOld").textContent = dur.discount ? `بدون خصم: ${base} EGP` : "";
      document.getElementById("calcTotal").textContent = total + " EGP";
      document.getElementById("calcSave").textContent = saved > 0 ? `💰 وفرت ${saved} EGP` : "";
    }
    sportSel.addEventListener("change", recalc);
    durSel.addEventListener("change", recalc);
    recalc();
  }
  return { init };
})();

/* ═══════════════════════════════════════════════════════════
   § MODULE: مقارنة باقات الاشتراك
   ═══════════════════════════════════════════════════════════ */
const PlanComparisonModule = (() => {
  function init() {
    const root = document.getElementById("plan-comparison-root");
    if (!root) return;
    injectSharedStyles();
    const avg = Math.round(PRICE_DATA.reduce((s, p) => s + p.price, 0) / PRICE_DATA.length);

    const plans = DURATIONS.map(d => {
      const base = avg * d.months;
      const total = Math.round(base * (1 - d.discount));
      return { ...d, total, perMonth: Math.round(total / d.months) };
    });
    const bestIdx = plans.length - 1;

    root.innerHTML = `
      <div class="esp-tool-section">
        <div class="esp-tool-card">
          <h2 class="esp-tool-title">📊 قارن باقات الاشتراك</h2>
          <p class="esp-tool-sub">الأسعار تقريبية بمتوسط سعر الرياضات (${avg} EGP/شهر) — هتتحدد فعليًا حسب الرياضة المختارة</p>
          <div class="esp-plans-grid">
            ${plans.map((p, i) => `
              <div class="esp-plan-card ${i === bestIdx ? "best" : ""}">
                ${i === bestIdx ? '<span class="esp-plan-badge">⭐ الأفضل قيمة</span>' : ""}
                <div class="esp-plan-name">${p.label}</div>
                <div class="esp-plan-price">${p.total} EGP</div>
                <div class="esp-plan-per">${p.perMonth} EGP / شهر</div>
                ${p.discount ? `<div class="esp-plan-save">خصم ${Math.round(p.discount * 100)}%</div>` : ""}
              </div>
            `).join("")}
          </div>
          <p class="esp-plan-note">* الأسعار النهائية بتتحدد حسب الرياضة اللي هتختارها في حاسبة الأسعار فوق.</p>
        </div>
      </div>`;
  }
  return { init };
})();

/* ═══════════════════════════════════════════════════════════
   § MODULE: كارت تسجيل قابل للتحميل
   ═══════════════════════════════════════════════════════════ */
const RegistrationCardModule = (() => {
  function init() {
    document.addEventListener("esp:registrationSuccess", e => showCard(e.detail));
  }

  function drawCard(canvas, data) {
    const ctx = canvas.getContext("2d");
    const W = 800, H = 450;
    canvas.width = W; canvas.height = H;

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#0a0a0f");
    grad.addColorStop(0.5, "#1a0a2e");
    grad.addColorStop(1, "#0d1b2a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(200,170,80,.5)";
    ctx.lineWidth = 3;
    ctx.strokeRect(14, 14, W - 28, H - 28);

    const siteName = (typeof CONFIG !== "undefined" && CONFIG.WEBSITE && CONFIG.WEBSITE.name) || "EliteSports Pro";

    ctx.textAlign = "center";
    ctx.fillStyle = "#f0d078";
    ctx.font = "bold 30px Arial";
    ctx.fillText("🏆 " + siteName, W / 2, 70);

    ctx.fillStyle = "#c9a84c";
    ctx.font = "16px Arial";
    ctx.fillText("تأكيد تسجيل", W / 2, 100);

    ctx.strokeStyle = "rgba(200,170,80,.3)";
    ctx.beginPath(); ctx.moveTo(60, 125); ctx.lineTo(W - 60, 125); ctx.stroke();

    ctx.textAlign = "right";
    ctx.fillStyle = "#e8e0d0";
    ctx.font = "20px Arial";
    const lines = [
      ["الاسم", data.name],
      ["الرياضة", data.sport],
      ["التليفون", data.phone],
      ["الإيميل", data.email],
      ["رقم التسجيل", data.id],
      ["التاريخ", new Date(data.date).toLocaleDateString("ar-EG")],
    ];
    let y = 175;
    lines.forEach(([label, value]) => {
      ctx.fillStyle = "rgba(200,200,220,.55)";
      ctx.font = "15px Arial";
      ctx.fillText(label, W - 60, y);
      ctx.fillStyle = "#f0e8d8";
      ctx.font = "bold 19px Arial";
      ctx.fillText(String(value || "-"), W - 60, y + 26);
      y += 48;
    });

    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(200,200,220,.4)";
    ctx.font = "13px Arial";
    ctx.fillText("هنتواصل معاك قريبًا لتأكيد الاشتراك ✅", W / 2, H - 30);
  }

  function showCard(data) {
    if (!data) return;
    const overlay = document.createElement("div");
    overlay.className = "esp-card-modal-overlay";
    overlay.innerHTML = `
      <div class="esp-card-modal">
        <h3>🎉 تم التسجيل! حمّل كارت التأكيد</h3>
        <canvas id="espRegCardCanvas"></canvas>
        <div class="esp-card-modal-actions">
          <button class="esp-card-btn-download" id="espCardDownloadBtn">⬇️ تحميل الكارت</button>
          <button class="esp-card-btn-close" id="espCardCloseBtn">إغلاق</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    injectSharedStyles();

    const canvas = document.getElementById("espRegCardCanvas");
    drawCard(canvas, data);

    document.getElementById("espCardDownloadBtn").addEventListener("click", () => {
      const link = document.createElement("a");
      link.download = `registration-${data.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
    document.getElementById("espCardCloseBtn").addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });
  }
  return { init };
})();

document.addEventListener("DOMContentLoaded", () => {
  try { PricingCalculatorModule.init(); } catch (e) { console.error("[PricingCalculatorModule]", e); }
  try { PlanComparisonModule.init(); } catch (e) { console.error("[PlanComparisonModule]", e); }
  try { RegistrationCardModule.init(); } catch (e) { console.error("[RegistrationCardModule]", e); }
});