/**
 * @fileoverview EliteSports Pro - Main Application Script
 * @version 12.0.0 (Pro Layout ⚡)
 * @author EliteSports Team
 * @lastModified 2026-08-12
 */

"use strict";


/* ═══════════════════════════════════════════════════════════
   § CONFIGURATION & CONSTANTS
   ═══════════════════════════════════════════════════════════ */

const CONFIG = Object.freeze({
  WEBSITE: {
    name: "EliteSports Pro",
    phone: "01032508884",
    email: "mg3901247@gmail.com",
    address: "المنوفيه- قرية طه شبرا- مصر",
    workTime: "8 صباحًا حتى 11 مساءً",
    // ⚙️ إعدادات إرسال الفورم (التسجيل + تواصل معنا):
    // الموقع مستضاف على استضافة ساكنة (GitHub Pages) بدون سيرفر خاص بيه،
    // فالفورم بيستخدم خدمة مجانية اسمها Web3Forms لإرسال البيانات على الإيميل.
    // خطوات التفعيل (دقيقتين بس):
    // 1) روح https://web3forms.com وسجل بإيميلك مجانًا
    // 2) هتاخد "Access Key" خاص بيك
    // 3) الصقه هنا بدل النص "YOUR_WEB3FORMS_ACCESS_KEY" تحت
    // لو سبته زي ما هو، الفورم هيرجع تلقائيًا لخاصية "افتح تطبيق الإيميل" (mailto) كحل بديل.
    web3formsAccessKey: "YOUR_WEB3FORMS_ACCESS_KEY",
  },
  ASSISTANT: {
    name: "Smart Sports AI",
    responseDelay: 600,
    saveChat: true,
    enableVoice: false,
    maxMemory: 30,
    maxInsults: 3,
    minSportsSelection: 6,
    adminCodeHash: "1e0739a077dbf289a697315bc056fa61b0aa661bc01b24def3d0c007820b00d1",
    maxUnbanAttempts: 10,
    maxMessageLength: 500,
    messageRateLimit: 1000,
  },
  ANIMATION: {
    counterDuration: 150,
    testimonialInterval: 4000,
    loadingSpeed: 30,
    fadeOutDuration: 800,
    scrollThreshold: 300,
  },
  STORAGE_KEYS: {
    chat: "sports_ai_chat",
    learning: "ai_learning_database",
    feedback: "ai_feedback_database",
    history: "chat_history",
    theme: "theme",
    ban: "site_ban_data",
    unbanAttempts: "site_unban_attempts",
    restoreRounds: "site_restore_rounds",
    insultCount: "insult_count",
  },
});

const SELECTORS = Object.freeze({
  music: "#bg-music",
  form: "#registration-form",
  selectAll: "#select-all-sports",
  sportCheckbox: ".sport-checkbox",
  favSports: 'input[name="fav_sports"]',
 loadingScreen : "#loading-screen",
  loaderFill: "#loader-fill",
  percent: "#loading-percent",
  enterBtn: "#enter-site-btn",
  loadingText: "#loading-status",
  scrollTop: "#scroll-top",
  scrollBottom: "#scroll-bottom",
  counters: ".counter",
  testimonials: ".testimonial",
  faqContainer: ".faq-container",
  faqButtons: ".faq-question",
  brightnessBtn: "#brightness-btn",
  brightnessPanel: "#brightness-panel",
  brightnessRange: "#brightness-range",
  brightnessValue: "#brightness-value",
  brightnessOverlay: "#brightness-overlay",
  assistant: "#assistant-panel",
  assistantToggle: "#assistant-toggle",
  closeAssistant: "#close-assistant",
  sendBtn: "#send-btn",
  userInput: "#user-input",
  chatMessages: "#chat-messages",
  voiceBtn: "#voice-btn",
  themeBtn: "#theme-btn",
  newChatBtn: "#new-chat-btn",
  clearChatBtn: "#clear-chat-btn",
});


/* ═══════════════════════════════════════════════════════════
   § UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════════ */

const Utils = {
  $(s) { try { return document.querySelector(s); } catch { return null; } },
  $$(s) { try { return document.querySelectorAll(s); } catch { return []; } },

  debounce(fn, delay = 150) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), delay); };
  },

  throttle(fn, limit = 100) {
    let on = false;
    return (...a) => { if (!on) { fn(...a); on = true; setTimeout(() => (on = false), limit); } };
  },

  escapeHTML(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  },

  stripHTML(html) {
    const d = document.createElement("div");
    d.innerHTML = html;
    return d.textContent || d.innerText || "";
  },

  sanitizeHTML(html) {
    const d = document.createElement("div");
    d.innerHTML = html;
    d.querySelectorAll("script,iframe,object,embed,form,input,link,meta,style").forEach(el => el.remove());
    d.querySelectorAll("*").forEach(el => {
      [...el.attributes].forEach(attr => {
        if (attr.name.startsWith("on") || (attr.value && attr.value.toLowerCase().includes("javascript:"))) el.removeAttribute(attr.name);
      });
    });
    return d.innerHTML;
  },

  loadJSON(key, fallback = null) {
    try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; }
    catch { return fallback; }
  },

  saveJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* silent */ }
  },

  removeStorage(key) { try { localStorage.removeItem(key); } catch { /* silent */ } },

  getArabicTime() { return new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }); },
  getArabicTimeLive() { return new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", second: "2-digit" }); },
  getArabicDateTime() { return new Date().toLocaleString("ar-EG"); },
  getArabicDate() { return new Date().toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" }); },

  async hashText(text) {
    const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("");
  },

  getTimePeriod() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
  },

  getTimeGreeting() {
    const period = this.getTimePeriod();
    const greetings = {
      morning: { label: "صباح الخير", title: "صباح الفل والياسمين", sub: "يوم جديد مليان طاقة ونشاط - يلا نبدأ!", gradient: "linear-gradient(135deg,#f6d365,#fda085,#f093fb)", assistantMsg: "صباح النور والسرور ☀️<br><br>صباحك فل وياسمين! يومك يكون أجمل يوم 💛<br><br>إيه اللي أقدر أساعدك فيه النهارده؟" },
      afternoon: { label: "طاب يومك", title: "النهار لسه في عزه", sub: "نص اليوم قدامك - يلا نكمل بأعلى طاقة!", gradient: "linear-gradient(135deg,#4facfe,#00f2fe,#43e97b)", assistantMsg: "أهلاً بيك في أجمل أوقات اليوم 🌤️<br><br>النهار لسه في عزه! إيه اللي أقدر أساعدك فيه؟ 💪" },
      evening: { label: "مساء الخير", title: "مساء النور والهدوء", sub: "وقت الراحة بعد يوم طويل - تستاهل الأفضل", gradient: "linear-gradient(135deg,#a18cd1,#fbc2eb,#f6d365)", assistantMsg: "مساء النور والسرور 🌅✨<br><br>مساؤك فل وياسمين! إيه أخبارك؟<br><br>إزاي أقدر أساعدك؟ 💜" },
      night: { label: "طابت ليلتك", title: "ليلة هادئة وسعيدة", sub: "وقت الهدوء والسكينة - خليك مرتاح", gradient: "linear-gradient(135deg,#0c0c1d,#1a0a2e,#2d1b69)", assistantMsg: "أهلاً بيك في هدوء الليل 🌙✨<br><br>ليلتك تكون كلها سعادة وراحة! 🤍<br><br>لو محتاج أي حاجة، أنا موجود! 💙" },
    };
    return greetings[period];
  },
};


/* ═══════════════════════════════════════════════════════════
   § اختصارات الطوارئ
   ═══════════════════════════════════════════════════════════ */

const MAX_RESTORE_ROUNDS = 4;

document.addEventListener("keydown", function (e) {
  const key = (e.key || "").toLowerCase();
  if (e.ctrlKey && e.shiftKey && key === "h") { e.preventDefault(); liftBanFully(); return; }
  if (e.ctrlKey && e.shiftKey && key === "r") { e.preventDefault(); restoreAttempts(); return; }
});

function liftBanFully() {
  Utils.removeStorage(CONFIG.STORAGE_KEYS.ban);
  Utils.removeStorage(CONFIG.STORAGE_KEYS.unbanAttempts);
  Utils.removeStorage(CONFIG.STORAGE_KEYS.restoreRounds);
  Utils.removeStorage(CONFIG.STORAGE_KEYS.insultCount);
  location.reload();
}

function restoreAttempts() {
  const banData = Utils.loadJSON(CONFIG.STORAGE_KEYS.ban, null);
  if (!banData) return;
  const max = CONFIG.ASSISTANT.maxUnbanAttempts;
  let rounds = parseInt(Utils.loadJSON(CONFIG.STORAGE_KEYS.restoreRounds, 0) || "0", 10);
  if (rounds >= MAX_RESTORE_ROUNDS) {
    showFloatingMsg("🔒 خلصت! استرجعت المحاولات " + MAX_RESTORE_ROUNDS + " مرات بالفعل.", "#e74c3c");
    return;
  }
  const newLeft = Math.min(5, max);
  Utils.saveJSON(CONFIG.STORAGE_KEYS.unbanAttempts, { left: newLeft });
  rounds++;
  Utils.saveJSON(CONFIG.STORAGE_KEYS.restoreRounds, String(rounds));
  const remaining = MAX_RESTORE_ROUNDS - rounds;
  showFloatingMsg(remaining > 0 ? "✅ تم استرجاع 5 محاولات! (المتبقي: " + remaining + ")" : "✅ تم استرجاع 5 محاولات! ⚠️ دي آخر مرة.", remaining > 0 ? "#2ecc71" : "#f39c12");
  setTimeout(() => location.reload(), 1800);
}

function showFloatingMsg(text, bgColor) {
  const old = document.getElementById("floatingMsg");
  if (old) old.remove();
  const msg = document.createElement("div");
  msg.id = "floatingMsg";
  msg.setAttribute("role", "alert");
  msg.textContent = text;
  msg.style.cssText = "position:fixed;top:20px;left:50%;transform:translateX(-50%);background:" + bgColor + ";color:#fff;padding:14px 26px;border-radius:12px;font-size:15px;font-weight:700;z-index:9999999;font-family:sans-serif;box-shadow:0 8px 25px rgba(0,0,0,.35);max-width:90%;text-align:center;";
  document.body.appendChild(msg);
}


/* ═══════════════════════════════════════════════════════════
   § FULL-SITE BAN SYSTEM 🔐
   ═══════════════════════════════════════════════════════════ */

const SiteBanModule = (() => {

  function checkAndBlock() {
    const banData = Utils.loadJSON(CONFIG.STORAGE_KEYS.ban, null);
    if (!banData || !banData.active) return false;
    showFullSiteBanScreen(banData);
    return true;
  }

  function activateSiteBan(count) {
    Utils.saveJSON(CONFIG.STORAGE_KEYS.ban, { active: true, reason: "ألفاظ غير لائقة متكررة", bannedAt: new Date().toISOString(), insultCount: count });
  }

  function showFullSiteBanScreen(banData) {
    const bannedDate = banData.bannedAt ? new Date(banData.bannedAt).toLocaleString("ar-EG") : "غير معروف";
    const attemptsData = Utils.loadJSON(CONFIG.STORAGE_KEYS.unbanAttempts, null);
    let attemptsLeft = (attemptsData && attemptsData.left !== undefined) ? attemptsData.left : CONFIG.ASSISTANT.maxUnbanAttempts;
    const maxAttempts = CONFIG.ASSISTANT.maxUnbanAttempts;
    const adminCodeHash = CONFIG.ASSISTANT.adminCodeHash;
    const isLocked = attemptsLeft <= 0;

    try { document.body.style.display = "none"; } catch (e) { /* ignore */ }

    const banPage = document.createElement("div");
    banPage.id = "site-ban-page";
    banPage.setAttribute("role", "dialog");
    banPage.setAttribute("aria-modal", "true");
    banPage.setAttribute("aria-label", "صفحة الحظر");
    banPage.innerHTML = `
      <style>
        #site-ban-page{position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(160deg,#0a0a0f,#1a0a2e 30%,#0d1b2a 60%,#0a0a0f);display:flex!important;align-items:center;justify-content:center;z-index:999999;direction:rtl;font-family:'Segoe UI',Tahoma,Arial,sans-serif;overflow-y:auto;padding:20px}
        #site-ban-page::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(ellipse at 20% 50%,rgba(120,80,200,.08),transparent 50%),radial-gradient(ellipse at 80% 20%,rgba(200,160,60,.06),transparent 50%),radial-gradient(ellipse at 50% 80%,rgba(80,60,180,.05),transparent 50%);animation:royalGlow 8s ease-in-out infinite alternate;z-index:0}
        @keyframes royalGlow{0%{transform:rotate(0) scale(1)}100%{transform:rotate(3deg) scale(1.05)}}
        .ban-box{position:relative;z-index:1;background:linear-gradient(170deg,rgba(255,255,255,.04),rgba(255,255,255,.01));backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border:1px solid rgba(200,170,80,.2);border-radius:32px;padding:50px 40px;max-width:520px;width:100%;text-align:center;animation:banSlideUp 1s cubic-bezier(.16,1,.3,1);box-shadow:0 30px 80px rgba(0,0,0,.5)}
        @keyframes banSlideUp{from{opacity:0;transform:translateY(60px) scale(.9)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes banPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
        @keyframes banShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
        @keyframes goldShimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        .ban-icon{font-size:68px;display:block;margin-bottom:20px;animation:banPulse 3s ease infinite}
        .ban-title{background:linear-gradient(135deg,#c9a84c,#f0d078,#c9a84c,#a07830);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:goldShimmer 4s linear infinite;font-size:28px;font-weight:800;margin-bottom:12px}
        .ban-sub{color:rgba(180,180,200,.7);font-size:14px;line-height:2;margin-bottom:30px}
        .ban-details{background:linear-gradient(135deg,rgba(200,160,60,.06),rgba(200,160,60,.02));border:1px solid rgba(200,170,80,.12);border-radius:18px;padding:22px;margin-bottom:26px;text-align:right}
        .ban-details p{color:rgba(180,180,200,.7);font-size:13px;margin:9px 0;display:flex;align-items:center;gap:8px}
        .ban-details b{color:rgba(220,220,240,.9);font-weight:600}
        .ban-details .red{background:linear-gradient(135deg,#e8a0a0,#d47070);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:700}
        .unban-box{background:linear-gradient(135deg,rgba(100,80,180,.08),rgba(80,60,160,.04));border:1px solid rgba(140,120,200,.15);border-radius:18px;padding:26px;margin-bottom:22px}
        .unban-box h3{background:linear-gradient(135deg,#b8a0e0,#d4c0f0,#b8a0e0);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:goldShimmer 5s linear infinite;font-size:16px;margin-bottom:14px;font-weight:700}
        .unban-box p{color:rgba(160,160,180,.6);font-size:12px;margin-bottom:18px}
        .unban-row{display:flex;gap:10px;margin-bottom:12px}
        #unbanCodeInput{flex:1;padding:15px 20px;border:1px solid rgba(200,170,80,.15);border-radius:14px;background:rgba(10,10,20,.6);color:#e0d8c8;font-size:15px;text-align:center;letter-spacing:5px;outline:none;direction:ltr;transition:all .4s}
        #unbanCodeInput:focus{border-color:rgba(200,170,80,.4);box-shadow:0 0 25px rgba(200,160,60,.1)}
        #unbanCodeInput:disabled{opacity:.25;cursor:not-allowed}
        #unbanCodeBtn{padding:15px 30px;background:linear-gradient(135deg,#8b6914,#c9a84c,#8b6914);background-size:200% auto;color:#fff;border:none;border-radius:14px;font-size:14px;font-weight:700;cursor:pointer;transition:all .4s;white-space:nowrap}
        #unbanCodeBtn:hover:not(:disabled){background-position:right center;transform:translateY(-2px)}
        #unbanCodeBtn:disabled{opacity:.25;cursor:not-allowed}
        #unbanMsg{min-height:24px;font-size:13px;margin-top:8px;transition:all .3s}
        .attempts-info{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:12px;color:rgba(140,140,160,.5);font-size:12px}
        .attempts-info b{background:linear-gradient(135deg,#e8a0a0,#d47070);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-size:16px;font-weight:700}
        .dots-row{display:flex;gap:6px;margin-right:10px}
        .dot-item{width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,#c9a84c,#f0d078);box-shadow:0 0 8px rgba(200,170,80,.4);transition:all .5s}
        .dot-item.off{background:linear-gradient(135deg,#4a3030,#3a2020);box-shadow:none;opacity:.4;transform:scale(.7)}
        .ban-footer{color:rgba(100,100,120,.4);font-size:11px;margin-top:24px;line-height:2.2;border-top:1px solid rgba(200,170,80,.08);padding-top:20px}
        .ban-footer a{color:rgba(200,170,80,.5);text-decoration:none;transition:all .3s}
        .ban-footer a:hover{color:rgba(200,170,80,.8)}
      </style>
      <div class="ban-box">
        <span class="ban-icon" aria-hidden="true">🚫</span>
        <h1 class="ban-title">تم حظر الوصول إلى الموقع</h1>
        <p class="ban-sub">بسبب استخدام ألفاظ غير لائقة متكررة في المساعد الذكي،<br>تم إغلاق الموقع بالكامل حتى يتم إلغاء الحظر من الإدارة.</p>
        <div class="ban-details">
          <p>📅 <b>تاريخ الحظر:</b> ${bannedDate}</p>
          <p>📝 <b>السبب:</b> ${banData.reason || "ألفاظ غير لائقة"}</p>
          <p>⚠️ <b>عدد المخالفات:</b> <span class="red">${banData.insultCount || CONFIG.ASSISTANT.maxInsults}</span></p>
          <p>🔒 <b>نوع الحظر:</b> <span class="red">دائم - كامل الموقع</span></p>
        </div>
        <div class="unban-box">
          <h3>🔑 إلغاء الحظر (الإدارة فقط)</h3>
          <p>أدخل كود الإدارة لإلغاء الحظر وفتح الموقع</p>
          <div class="unban-row">
            <input type="password" id="unbanCodeInput" aria-label="كود إلغاء الحظر" placeholder="أدخل كود الإدارة..." autocomplete="off" ${isLocked ? "disabled" : ""}>
            <button id="unbanCodeBtn" aria-label="إلغاء الحظر" ${isLocked ? "disabled" : ""}>إلغاء الحظر</button>
          </div>
          <div id="unbanMsg" style="color:#e74c3c;" aria-live="polite">${isLocked ? "🔒 تم استنفاد جميع المحاولات. تواصل مع الإدارة: " + CONFIG.WEBSITE.phone : ""}</div>
          <div class="attempts-info">
            <span>المحاولات:</span><b id="attNum">${attemptsLeft}</b><span>/ ${maxAttempts}</span>
            <div class="dots-row" id="dotsRow"></div>
          </div>
        </div>
        <div class="ban-footer">
          💡 الاحترام المتبادل هو أساس أي حوار بنّاء<br>
          📞 <a href="tel:${CONFIG.WEBSITE.phone}">${CONFIG.WEBSITE.phone}</a> &nbsp;|&nbsp;
          📧 <a href="mailto:${CONFIG.WEBSITE.email}">${CONFIG.WEBSITE.email}</a>
        </div>
      </div>`;

    document.body.appendChild(banPage);
    try { document.body.style.display = ""; } catch (e) { /* ignore */ }

    const dotsRow = document.getElementById("dotsRow");
    for (let i = 0; i < maxAttempts; i++) {
      const dot = document.createElement("div");
      dot.className = "dot-item" + (i >= attemptsLeft ? " off" : "");
      dotsRow.appendChild(dot);
    }

    const inputEl = document.getElementById("unbanCodeInput");
    const btnEl = document.getElementById("unbanCodeBtn");
    const msgEl = document.getElementById("unbanMsg");
    const attNumEl = document.getElementById("attNum");

    function updateDots() {
      const dots = dotsRow.querySelectorAll(".dot-item");
      for (let i = 0; i < dots.length; i++) dots[i].className = "dot-item" + (i >= attemptsLeft ? " off" : "");
    }

    async function doUnban() {
      const code = inputEl.value.trim();
      if (!code) { msgEl.textContent = "⚠️ يرجى إدخال الكود"; msgEl.style.color = "#f39c12"; return; }
      const codeHash = await Utils.hashText(code);
      if (codeHash === adminCodeHash) {
        Utils.removeStorage(CONFIG.STORAGE_KEYS.ban);
        Utils.removeStorage(CONFIG.STORAGE_KEYS.unbanAttempts);
        Utils.removeStorage(CONFIG.STORAGE_KEYS.restoreRounds);
        Utils.removeStorage(CONFIG.STORAGE_KEYS.insultCount);
        msgEl.innerHTML = "✅ <b>تم إلغاء الحظر! جاري إعادة التحميل...</b>";
        msgEl.style.color = "#2ecc71";
        btnEl.disabled = true; inputEl.disabled = true;
        setTimeout(() => location.reload(), 1000);
        return;
      }
      attemptsLeft--;
      Utils.saveJSON(CONFIG.STORAGE_KEYS.unbanAttempts, { left: attemptsLeft });
      if (attemptsLeft <= 0) {
        inputEl.disabled = true; btnEl.disabled = true;
        msgEl.innerHTML = "🔒 <b>تم استنفاد جميع المحاولات.</b><br>تواصل مع الإدارة: " + CONFIG.WEBSITE.phone;
        msgEl.style.color = "#e74c3c";
        attNumEl.textContent = "0";
        updateDots();
        return;
      }
      msgEl.textContent = "❌ كود غير صحيح! حاول مرة أخرى.";
      msgEl.style.color = "#e74c3c";
      msgEl.style.animation = "banShake .5s ease";
      setTimeout(() => { msgEl.style.animation = ""; }, 500);
      attNumEl.textContent = attemptsLeft;
      updateDots();
      inputEl.value = "";
      inputEl.focus();
    }

    btnEl.addEventListener("click", doUnban);
    inputEl.addEventListener("keydown", e => { if (e.key === "Enter") doUnban(); });
    if (!isLocked && inputEl) inputEl.focus();
  }

  return { checkAndBlock, activateSiteBan };
})();

const SITE_BLOCKED = SiteBanModule.checkAndBlock();
if (SITE_BLOCKED) console.info("[SiteBan] Access blocked.");

/* ═══════════════════════════════════════════════════════════
   § MODULE: Form Validation
   ═══════════════════════════════════════════════════════════ */
const FormModule = (() => {
  const REQUIRED_FIELDS = ["reg-username", "reg-email", "reg-phone", "reg-sport", "reg-message"];
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
  const REG_STORAGE_KEY = "esp_registrations";

  function init() {
    const form = Utils.$(SELECTORS.form);
    if (!form) return;
    form.addEventListener("submit", handleSubmit);
  }

  function getFieldValues() {
    const data = {};
    REQUIRED_FIELDS.forEach(id => { const el = document.getElementById(id); data[id] = el ? el.value.trim() : ""; });
    return data;
  }

  // بيسجل التسجيل محليًا في المتصفح عشان لوحة تحكم التسجيلات (admin-dashboard.html) تقدر تعرضه،
  // وبيبعت حدث مخصص (custom event) عشان أي كود تاني (زي كارت التسجيل القابل للتحميل) يعرف إن في تسجيل جديد.
  function saveRegistrationLocally(data) {
    const list = Utils.loadJSON(REG_STORAGE_KEY, []) || [];
    const record = {
      id: "REG-" + Date.now(),
      date: new Date().toISOString(),
      name: data["reg-username"],
      email: data["reg-email"],
      phone: data["reg-phone"],
      sport: data["reg-sport"],
      message: data["reg-message"],
    };
    list.unshift(record);
    Utils.saveJSON(REG_STORAGE_KEY, list);
    document.dispatchEvent(new CustomEvent("esp:registrationSuccess", { detail: record }));
    return record;
  }

  function setButtonState(button, state) {
    if (!button) return;
    if (state === "sending") {
      button.disabled = true;
      button.dataset.originalHtml = button.dataset.originalHtml || button.innerHTML;
      button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جارٍ الإرسال...';
      button.setAttribute("aria-busy", "true");
    } else {
      button.disabled = false;
      if (button.dataset.originalHtml) button.innerHTML = button.dataset.originalHtml;
      button.removeAttribute("aria-busy");
    }
  }

  function mailtoFallback(data) {
    const subject = encodeURIComponent("تسجيل جديد - " + CONFIG.WEBSITE.name);
    const body = encodeURIComponent(
      `الاسم: ${data["reg-username"]}\nالإيميل: ${data["reg-email"]}\nالتليفون: ${data["reg-phone"]}\nالرياضة: ${data["reg-sport"]}\nالرسالة: ${data["reg-message"]}`
    );
    window.location.href = `mailto:${CONFIG.WEBSITE.email}?subject=${subject}&body=${body}`;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const data = getFieldValues();
    if (Object.values(data).some(v => v === "")) { showToast("⚠️ يرجى ملء جميع الحقول المطلوبة.", "warning"); return; }
    if (!EMAIL_REGEX.test(data["reg-email"])) { showToast("⚠️ يرجى إدخال بريد إلكتروني صحيح.", "warning"); return; }

    const form = event.target;
    const button = form.querySelector('button[type="submit"]');
    setButtonState(button, "sending");

    const accessKey = CONFIG.WEBSITE.web3formsAccessKey;
    if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
      // لسه محددتش مفتاح Web3Forms - نسجل التسجيل محليًا ونستخدم mailto كحل بديل مؤقت
      setButtonState(button, "idle");
      saveRegistrationLocally(data);
      mailtoFallback(data);
      showToast("📧 تم فتح تطبيق البريد لإرسال التسجيل (لتفعيل الإرسال المباشر، فعّل Web3Forms من الإعدادات).", "info");
      return;
    }

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: "تسجيل جديد - " + CONFIG.WEBSITE.name,
          from_name: data["reg-username"],
          name: data["reg-username"],
          email: data["reg-email"],
          phone: data["reg-phone"],
          sport: data["reg-sport"],
          message: data["reg-message"],
        }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        showToast("✅ تم إرسال التسجيل بنجاح! هنتواصل معاك قريبًا.", "success");
        saveRegistrationLocally(data);
        form.reset();
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (err) {
      console.error("[FormModule] Web3Forms submission failed:", err);
      showToast("⚠️ حصل خطأ في الإرسال، هنفتحلك البريد الإلكتروني كبديل.", "warning");
      saveRegistrationLocally(data);
      mailtoFallback(data);
    } finally {
      setButtonState(button, "idle");
    }
  }
  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   § MODULE: Select All Checkboxes
   ═══════════════════════════════════════════════════════════ */
const SelectAllModule = (() => {
  function init() {
    const selectAll = Utils.$(SELECTORS.selectAll);
    const checkboxes = Utils.$$(SELECTORS.sportCheckbox);
    if (!selectAll || !checkboxes.length) return;
    selectAll.addEventListener("change", () => { checkboxes.forEach(cb => { cb.checked = selectAll.checked; }); });
    checkboxes.forEach(cb => { cb.addEventListener("change", () => { selectAll.checked = [...checkboxes].every(i => i.checked); }); });
  }
  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   § MODULE: Favorite Sports Validation
   ═══════════════════════════════════════════════════════════ */
const FavSportsModule = (() => {
  function init() {
    const checkboxes = Utils.$$(SELECTORS.favSports);
    if (!checkboxes.length) return;
    const form = checkboxes[0].closest("form");
    if (!form) return;
    form.addEventListener("submit", event => {
      const count = [...checkboxes].filter(cb => cb.checked).length;
      if (count < CONFIG.ASSISTANT.minSportsSelection) {
        event.preventDefault();
        showToast(`⚠️ يرجى اختيار ${CONFIG.ASSISTANT.minSportsSelection} رياضات على الأقل. (تم اختيار: ${count})`, "warning");
      }
    });
  }
  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   § MODULE: Loading Screen
   ═══════════════════════════════════════════════════════════ */
const LoadingModule = (() => {
  function init() {
    const screen = Utils.$(SELECTORS.loadingScreen);
    const fill = Utils.$(SELECTORS.loaderFill);
    const percent = Utils.$(SELECTORS.percent);
    const enterBtn = Utils.$(SELECTORS.enterBtn);
    const text = Utils.$(SELECTORS.loadingText);
    if (!screen || !fill || !percent || !enterBtn || !text) return;

    let progress = 0;
    const intervalId = setInterval(() => {
      if (progress < 90) { progress++; fill.style.width = progress + "%"; percent.textContent = progress + "%"; }
    }, CONFIG.ANIMATION.loadingSpeed);

    window.addEventListener("load", () => {
      clearInterval(intervalId);
      fill.style.width = "100%"; percent.textContent = "100%";
      text.textContent = "✅ اكتمل تحميل الموقع";
      enterBtn.style.display = "inline-block";
      enterBtn.removeAttribute("hidden");
    });

    enterBtn.addEventListener("click", () => {
      screen.style.transition = "opacity " + CONFIG.ANIMATION.fadeOutDuration + "ms ease";
      screen.style.opacity = "0";
      screen.setAttribute("aria-hidden", "true");
      setTimeout(() => screen.remove(), CONFIG.ANIMATION.fadeOutDuration);
    });
  }
  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   § MODULE: Scroll Navigation Buttons
   ═══════════════════════════════════════════════════════════ */
const ScrollModule = (() => {
  function init() {
    const topBtn = Utils.$(SELECTORS.scrollTop);
    const bottomBtn = Utils.$(SELECTORS.scrollBottom);
    const devBadge = document.querySelector(".dev-badge");
    if (!topBtn || !bottomBtn) return;

    function updateVisibility() {
      const scrollY = window.scrollY;
      const isAtBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 5;
      const showTop = scrollY > CONFIG.ANIMATION.scrollThreshold;
      topBtn.classList.toggle("show", showTop);
      bottomBtn.classList.toggle("show", !isAtBottom);
      if (devBadge) devBadge.classList.toggle("show", showTop);
    }

    window.addEventListener("scroll", Utils.throttle(updateVisibility, 100), { passive: true });
    window.addEventListener("load", updateVisibility);
    topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    bottomBtn.addEventListener("click", () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" }));
  }
  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   § MODULE: Time-Based Welcome 🌅
   ═══════════════════════════════════════════════════════════ */
const TimeWelcomeModule = (() => {
  const ICONS = {
    morning: `<svg viewBox="0 0 24 24"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
    afternoon: `<svg viewBox="0 0 24 24"><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 6a6 6 0 100 12 6 6 0 000-12z"/></svg>`,
    evening: `<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`,
    night: `<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/><circle cx="17" cy="5" r="1"/><circle cx="19" cy="9" r=".5"/><circle cx="15" cy="3" r=".5"/></svg>`,
  };

  function init() {
    const greeting = Utils.getTimeGreeting();
    const period = Utils.getTimePeriod();
    document.body.classList.add("time-" + period);
    addFloatingBar(greeting, period);
    sessionStorage.setItem("time_period", period);
  }

  function addFloatingBar(g, period) {
    if (document.getElementById("twFloatBar")) return;
    const bar = document.createElement("div");
    bar.id = "twFloatBar";
    bar.className = "tw-float-bar";
    bar.innerHTML = `
      <div class="tw-fb-icon">${ICONS[period]}</div>
      <div class="tw-fb-text">
        <span class="tw-fb-label">${g.label}</span>
        <span class="tw-fb-title">${g.title}</span>
      </div>
      <div class="tw-fb-time" id="twLiveTime">${Utils.getArabicTimeLive()}</div>`;
    document.body.appendChild(bar);
    setTimeout(() => bar.classList.add("visible"), 2500);
    startLiveClock();
  }

  function startLiveClock() {
    const el = document.getElementById("twLiveTime");
    if (!el) return;
    const tick = () => { el.textContent = Utils.getArabicTimeLive(); };
    tick();
    setInterval(tick, 1000);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   § MODULE: Counter Animation
   ═══════════════════════════════════════════════════════════ */
const CounterModule = (() => {
  function init() {
    const counters = Utils.$$(SELECTORS.counters);
    if (!counters.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateCounter(entry.target); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    const duration = CONFIG.ANIMATION.counterDuration * 16.67;
    const startTime = performance.now();
    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.ceil(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }
  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   § MODULE: Testimonial Slider
   ═══════════════════════════════════════════════════════════ */
const TestimonialModule = (() => {
  function init() {
    const items = [...Utils.$$(SELECTORS.testimonials)];
    if (items.length < 2) return;
    let current = 0;
    let intervalId = setInterval(next, CONFIG.ANIMATION.testimonialInterval);
    items[0].classList.add("active");
    function next() {
      items[current].classList.remove("active");
      current = (current + 1) % items.length;
      items[current].classList.add("active");
    }
    const container = items[0].closest(".testimonials-wrapper");
    if (container) {
      container.addEventListener("mouseenter", () => clearInterval(intervalId));
      container.addEventListener("mouseleave", () => { intervalId = setInterval(next, CONFIG.ANIMATION.testimonialInterval); });
    }
  }
  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   § MODULE: FAQ Accordion
   ═══════════════════════════════════════════════════════════ */
const FAQModule = (() => {
  function init() {
    const container = Utils.$(SELECTORS.faqContainer);
    if (!container) return;
    container.addEventListener("click", e => {
      const button = e.target.closest(".faq-question");
      if (!button) return;
      const item = button.parentElement;
      const isActive = item.classList.contains("active");
      container.querySelectorAll(".faq-question").forEach(btn => {
        btn.parentElement.classList.remove("active");
        const icon = btn.querySelector("span");
        if (icon) icon.textContent = "+";
      });
      if (!isActive) {
        item.classList.add("active");
        const icon = button.querySelector("span");
        if (icon) icon.textContent = "−";
      }
    });
  }
  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   § MODULE: Brightness Control
   ═══════════════════════════════════════════════════════════ */
const BrightnessModule = (() => {
  function init() {
    const btn = Utils.$(SELECTORS.brightnessBtn);
    const panel = Utils.$(SELECTORS.brightnessPanel);
    const range = Utils.$(SELECTORS.brightnessRange);
    const value = Utils.$(SELECTORS.brightnessValue);
    const overlay = Utils.$(SELECTORS.brightnessOverlay);
    if (!btn || !panel) return;
    btn.addEventListener("click", () => {
      const isVisible = panel.style.display === "block";
      panel.style.display = isVisible ? "none" : "block";
      btn.setAttribute("aria-expanded", String(!isVisible));
    });
    if (range && value && overlay) {
      range.addEventListener("input", () => {
        const brightness = parseInt(range.value, 10);
        overlay.style.opacity = (100 - brightness) / 100;
        value.textContent = brightness + "%";
      });
    }
  }
  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   § MODULE: Toast Notifications
   ═══════════════════════════════════════════════════════════ */
const ToastModule = (() => {
  function show(message, type = "info", duration = 4000) {
    document.querySelectorAll(".toast-notification").forEach(t => t.remove());
    const toast = document.createElement("div");
    toast.className = "toast-notification toast-" + type;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 300); }, duration);
  }
  return { show };
})();

function showToast(message, type = "info") { ToastModule.show(message, type); }
/* ═══════════════════════════════════════════════════════════
   § MODULE: AI Assistant 🤖
   ═══════════════════════════════════════════════════════════ */
const AssistantModule = (() => {
  let memory = [];
  let elements = {};
  let userName = null;
  let loginOverlay = null;
  let loginInput = null;
  let loginMsg = null;
  let lastMessageTime = 0;
  let initialized = false;
  const MAX_INSULTS = CONFIG.ASSISTANT.maxInsults;
  const NAME_KEY = "assistant_user_name";
  const esc = s => Utils.escapeHTML(s);

  const IMG_FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250'><rect width='100%' height='100%' fill='#1a0a2e'/><text x='200' y='150' font-size='90' text-anchor='middle'>🏆</text></svg>"
  ).replace(/'/g, "%27");

  const BAD_WORDS = Object.freeze([
    "غبي","غبيه","حمار","كلب","تافه","تافهه","قذر","قذره","وسخ","وسخه","زبالة","احمق","أحمق","حقير","حقيره",
    "لعنة","يلعن","تفو","احه","يا كلب","يا حمار","يا ثور","يا بغل","يا خنزير","يا بقرة","يا حيوان","يا بهيمة",
    "يا جرذ","يا فأر","ثور","بغل","خنزير","جرذ","اخرس","اسكت يا غبي","انقلع","اغرب عن وجهي",
    "روح اتنيل","روح في داهية","روح اتمرمط","يخرب بيتك","يخرب عقلك","عديم الفائدة",
    "محدش طلب رأيك","انت مين انت","مش قدك","كس","طيز","زب","شرمط","شرموط","شرموطة",
    "منيوك","متناك","عرص","خول","قحبة","قحب","ساقط","ساقطة","سفال","نجس","نذل","نذلة","خسيس","خسيسة",
    "يا جدع","يا واطي","يا واطية","يا سفل","ابن الكلب","ابن الحمار","يا بن الـ",
    "يلعن ابوك","يلعن دينك","يلعن ربك","كس امك","طيز امك","زب ابوك","خرا عليك",
    "بلاش هبل","انت هبل","هبل","معتوه","مجنون","اهبل","معفن","مقرف","مقرفة","زفت",
    "يا بهيم","يا تيس","يا معرس","يا خايس","خايس","يا خايب","خايب","يا فاشل","فاشل","يا نكرة","نكرة",
    "يا زلمة","يا حشرة","حشرة","يا صرصار","صرصار","يا دود","دود","يا جرثوم","جرثوم",
    "انت غلطة","انت عار","انت عيب","انت فضيحة","محدش يحبك","انت مكروه",
    "مش نافع","عديم النفع","بلا قيمة","انت ولا حاجة","مش موجود",
    "يا اسود","يا عبد","عبد","خادم","يا خدام","يا فقير","يا متسول","شحاذ","يا شحاذ",
    "بليد","متخلف","متاخر","عبيط","مهبول","عقلك صغير","مفيش مخ","بلا مخ","فارغ",
    "هضربك","هقتلك","هموتك","هكسرك","هربيك","هادبك","هعلمك الأدب",
    "fuck","shit","bitch","asshole","bastard","dick","pussy","cunt","whore",
    "slut","idiot","stupid","moron","retard","loser","jerk","douche","prick","wanker","damn","crap","bloody",
  ]);

  const GREETINGS_DB = Object.freeze([
    { k: ["السلام عليكم","السلام","سلامو عليكم","اسلام عليكم","السلام عليكو"], f: n => `وعليكم السلام ورحمة الله وبركاته 🌹✨<br><br>أهلاً ${n ? 'يا <b>'+n+'</b>' : 'بك'}! كيف يمكنني مساعدتك اليوم؟` },
    { k: ["وعليكم السلام"], f: n => `أهلاً ${n ? 'يا <b>'+n+'</b>' : 'بك'}! 😊 كيف أقدر أساعدك؟` },
    { k: ["مرحبا","مرحباً","مرحبتين","هلا","أهلا","أهلاً","اهلا","اهلين","أهلين"], f: n => `أهلاً وسهلاً ${n ? 'يا <b>'+n+'</b>' : 'بك'} في EliteSports Pro! 💙🏆<br><br>كيف يمكنني مساعدتك اليوم؟` },
    { k: ["هاي","هايي","هاى","hi","hello","hey","hallo","hola"], f: n => `هاي ${n ? 'يا <b>'+n+'</b>' : ''}! 👋<br><br>نورت EliteSports Pro! إيه اللي أقدر أساعدك فيه؟` },
    { k: ["هلو","هالو","الو","ألو"], f: n => `ألو ${n ? 'يا <b>'+n+'</b>' : ''}! 📞💙<br><br>أهلاً بك في EliteSports Pro! كيف أقدر أخدمك؟` },
    { k: ["ازيك","إزيك","ازيكو","عامل ايه","عامل إيه","عامل أيه","اخبارك","أخبارك","اخبارك ايه"], f: n => `الحمد لله بخير ${n ? 'يا <b>'+n+'</b>' : ''}! 😊<br><br>وأنت عامل إيه؟ يا رب تكون بأحسن حال!<br><br>إيه اللي أقدر أساعدك فيه؟` },
    { k: ["ايه الاخبار","إيه الأخبار","شو الاخبار","ايش الاخبار"], f: n => `كله تمام الحمد لله ${n ? 'يا <b>'+n+'</b>' : ''}! 😄<br><br>وأنت أخبارك إيه؟ قولي إزاي أقدر أساعدك! 💙` },
    { k: ["صباح الخير","صباحو","صباح الفل","صباح النور","صباح الورد","صباح الهنا","صباح الجمال","صباح السعادة","good morning","morning"], f: n => `صباح النور والسرور ${n ? 'يا <b>'+n+'</b>' : ''}! ☀️<br><br>صباحك فل وياسمين! إنت عامل إيه؟ فطرت؟ 😄<br><br>إزاي أقدر أساعدك النهارده؟` },
    { k: ["مساء الخير","مساء النور","مساء الفل","مساء الورد","مساء الهنا","مساء الجمال","good evening","evening"], f: n => `مساء النور والسرور ${n ? 'يا <b>'+n+'</b>' : ''}! 🌙✨<br><br>مساؤك فل وياسمين! إيه أخبارك؟<br><br>إزاي أقدر أساعدك؟ 💙` },
    { k: ["تصبح على خير","تصبحوا على خير","ليلة سعيدة","جود نايت","good night","goodnight"], f: n => `وأنت من أهل الخير ${n ? 'يا <b>'+n+'</b>' : ''}! 🌙✨<br><br>تصبح على خير وسعادة! 🤍<br><br>لو محتاج أي حاجة قبل ما تنام، أنا موجود! 💙` },
    { k: ["هلا والله","هلا وغلا","يا هلا","يا مرحبا","حياك الله","الله يحييك"], f: n => `يا هلا والله ${n ? 'يا <b>'+n+'</b>' : ''}! 🌹<br><br>حياك الله وبياك! نورت EliteSports Pro!<br><br>كيف أقدر أساعدك؟ 💙` },
    { k: ["شلونك","شلونكم","كيفكم","كيف حالك","كيف حالك يا غالي"], f: n => `الحمد لله بأفضل حال ${n ? 'يا <b>'+n+'</b>' : ''}! 😊<br><br>وأنت شلونك؟ يا رب تكون بخير!<br><br>إيش أقدر أساعدك فيه؟ 🏆` },
    { k: ["رجعت","انا رجعت","انا تاني","وحشتني","وحشتوني","اشتقتلك","اشتقت لكم"], f: n => `يا هلا والله ${n ? 'يا <b>'+n+'</b>' : ''}! 🎉💙<br><br>وحشتنا أكتر! نورت من تاني!<br><br>إيه اللي تحب تعرفه النهارده؟ 🏆` },
    { k: ["باي","باي باي","مع السلامة","مع السلامه","وداعا","وداعاً","bye","goodbye","see you","اشوفك بعدين"], f: n => `مع السلامة ${n ? 'يا <b>'+n+'</b>' : ''}! 👋<br><br>سعدنا بمحادثتك! لو محتاج أي حاجة، إحنا هنا دائمًا.<br><br>يلا باي! 🌹` },
    { k: ["يلا باي","يلا سلام","انا ماشي","انا رايح","هقفل"], f: n => `يلا مع السلامة ${n ? 'يا <b>'+n+'</b>' : ''}! 👋✨<br><br>نتمنى نشوفك تاني قريب!<br><br>خد بالك من نفسك! 💙` },
    { k: ["بخير","تمام","كويس","الحمد لله","الحمدلله","بألف خير","ممتاز","رايق"], f: n => `الحمد لله ${n ? 'يا <b>'+n+'</b>' : ''}! 😊<br><br>فرحان إنك بخير! إيه اللي أقدر أساعدك فيه؟` },
    { k: ["مش كويس","تعبان","مريض","زعلان","مضايق","مكتئب","حزين","مش تمام"], f: n => `ربنا يشفيك ويخليك ${n ? 'يا <b>'+n+'</b>' : ''}! 🤍💙<br><br>إن شاء الله هتبقى أحسن. خد وقتك وارتاح.<br><br>لو تحب نتكلم أو أساعدك في أي حاجة، أنا هنا! 🌹` },
  ]);

  const DATABASE = Object.freeze([
    { k: ["من انت","من انتم","من أنتم","انت مين","إنت مين","انت ايه","تعريف","عرفني بيك","مين انت"], a: `🏆 <b>EliteSports Pro</b><br><br>نحن مركز رياضي متكامل يقدم أفضل الخدمات الرياضية لجميع الأعمار.<br><br>📍 ${CONFIG.WEBSITE.address}<br>📞 ${CONFIG.WEBSITE.phone}<br>📧 ${CONFIG.WEBSITE.email}<br>⏰ ${CONFIG.WEBSITE.workTime}` },
    { k: ["العنوان","الموقع","مكان","فين","فين انتو","عنوانكم","مكانكم","location","address"], a: `📍 <b>عنواننا:</b> ${CONFIG.WEBSITE.address}<br><br>يمكنك زيارتنا في أي وقت خلال ساعات العمل!<br>⏰ ${CONFIG.WEBSITE.workTime}` },
    { k: ["رقم","هاتف","واتساب","تواصل","اتصل","كلمني","رقمكم","هاتفكم","phone","whatsapp"], a: `📞 <b>وسائل التواصل:</b><br><br>📱 هاتف: ${CONFIG.WEBSITE.phone}<br>📧 بريد: ${CONFIG.WEBSITE.email}<br><br>متاحين يوميًا من ${CONFIG.WEBSITE.workTime} ⏰` },
    { k: ["المواعيد","العمل","بتفتحوا","بتقفلوا","ساعات العمل","ميعاد","بتشتغلوا","متى تفتحون","اوقات العمل"], a: `⏰ <b>مواعيد العمل:</b><br><br>نعمل يوميًا من <b>${CONFIG.WEBSITE.workTime}</b><br><br>🗓️ 7 أيام في الأسبوع<br>🎉 لا توجد إجازات رسمية` },
    { k: ["السعر","الأسعار","الاسعار","فلوس","تكلفة","كام","بكام","ثمن","price","cost"], a: "💰 <b>الأسعار والاشتراكات:</b><br><br>يمكنك مشاهدة جميع الأسعار والتفاصيل داخل قسم الأسعار بالموقع.<br><br>🎁 لدينا عروض وخصومات مميزة حاليًا!<br><br>للاستفسار عن سعر محدد، اكتب اسم الرياضة." },
    { k: ["اشتراك","تسجيل","اشترك","سجل","عايز اشترك","ازاي اشترك","طريقة الاشتراك","register","signup"], a: "📝 <b>طريقة التسجيل:</b><br><br>1️⃣ اذهب إلى نموذج التسجيل بالموقع<br>2️⃣ املأ بياناتك الشخصية<br>3️⃣ اختر الرياضات المفضلة<br>4️⃣ اضغط إرسال<br><br>✅ هيتواصل معاك فريقنا خلال 24 ساعة!" },
    { k: ["العروض","خصم","خصومات","تخفيض","عرض","promotion","discount","offer"], a: "🎁 <b>العروض الحالية:</b><br><br>🔥 خصم 30% على الاشتراك السنوي<br>🎉 عرض الافتتاح: شهر مجاني<br>👨‍👩‍ خصم عائلي: 20% للأسر<br>🏆 باقة VIP شاملة جميع الرياضات<br><br>📞 اتصل بنا لمعرفة التفاصيل!" },
    { k: ["رياضة","الرياضات","رياضات","بتقدموا ايه","عندكم ايه","الانشطة","الأنشطة","sports"], a: "⚽ <b>الرياضات المتاحة:</b><br><br>⚽ كرة القدم | 🏀 كرة السلة | 🏐 الكرة الطائرة | 🤾 كرة اليد<br>🏊 السباحة | 🎾 التنس | 🏓 تنس الطاولة | 🏸 الريشة الطائرة<br>🥊 الملاكمة | 🥋 الكاراتيه | 🥋 الجودو | 🤸 الجمباز<br>🏋️ رفع الأثقال | 🧘 اليوجا | 💪 اللياقة البدنية | 🏃 ألعاب القوى<br>🚴 ركوب الدراجات | 🤺 المبارزة | 🏹 الرماية<br><br>💡 اكتب اسم أي رياضة لمعرفة التفاصيل!" },
    { k: ["مدرب","المدربين","أفضل المدربين","مدربين","كوتش","coach"], a: "🏆 <b>المدربين:</b><br><br>لدينا نخبة من أفضل المدربين المعتمدين دوليًا!<br><br>اكتب اسم الرياضة وسأخبرك بأفضل مدرب لها 👇<br><br>مثال: اكتب «كرة القدم» أو «السباحة»" },
    { k: ["شكرا","شكراً","متشكر","مشكور","ثانكس","thanks","thank you","جزاك الله خير","بارك الله فيك","ربنا يخليك"], a: n => `العفو ${n ? 'يا <b>'+n+'</b>' : 'يا غالي'}! ❤️🌹<br><br>يسعدني مساعدتك دائمًا. لو محتاج أي حاجة تانية، أنا هنا! 💙` },
    { k: ["اسف","اعتذر","sorry","اعتذر منك بشده","سامحني","اعذرني","معلش","آسف"], a: n => `ولا يهمك ${n ? 'يا <b>'+n+'</b>' : 'يا صديقي'}! 😊🌹<br><br>أشكرك على اعتذارك، وأنا سعيد إني أساعدك.<br><br>إيه اللي تحب تعرفه؟ 💙` },
    { k: ["حبيتك","بحبك","انت رائع","انت شاطر","انت ذكي","برافو","احسنت","رائع","عظيم","amazing","great","awesome","love you"], a: n => `يا سلام ${n ? 'يا <b>'+n+'</b>' : ''}! 😍<br><br>ده كلام يفرح أوي! شكرًا على كلامك الجميل!<br><br>أنا هنا دائمًا عشان أساعدك! 🌹` },
    { k: ["الطقس","الجو","حر","برد","weather","درجة الحرارة"], a: "🌤️ <b>الطقس:</b><br><br>للأسف مش عندي إمكانية أشوف الطقس الحالي،<br>لكن أنصحك تشوف تطبيق الطقس على موبايلك! 📱<br><br>هل تحب أساعدك في حاجة تانية؟ 💙" },
    { k: ["مساعدة","ساعدني","help","محتاج مساعدة","عايز مساعدة","مش عارف"], a: n => `💙 <b>أنا هنا لمساعدتك${n ? ' يا <b>'+n+'</b>' : ''}!</b><br><br>يمكنك سؤالي عن:<br><br>⚽ الرياضات المتاحة | 👨 المدربين | 💰 الأسعار<br>📝 طريقة التسجيل | 🎁 العروض | 📍 العنوان<br>⏰ مواعيد العمل | 😄 نكتة أو حكمة<br>✏️ غير اسمي | 🚪 تسجيل خروج<br><br>اكتب سؤالك وأنا جاهز! 🚀` },
    { k: ["شروط","الشروط","قوانين","القوانين","شروط الاشتراك","terms"], a: `📋 <b>شروط الاشتراك:</b><br><br>1️⃣ الحد الأدنى للعمر: 6 سنوات<br>2️⃣ إحضار صورة البطاقة أو شهادة الميلاد<br>3️⃣ الكشف الطبي قبل البدء<br>4️⃣ الالتزام بمواعيد التدريب<br>5️⃣ الحفاظ على نظافة المرافق<br>6️⃣ احترام المدربين والزملاء<br><br>📞 للتفاصيل: ${CONFIG.WEBSITE.phone}` },
    { k: ["الغاء","إلغاء","فسخ","عايز الغي","الغاء الاشتراك","cancel"], a: `📋 <b>إلغاء الاشتراك:</b><br><br>1️⃣ التوجه إلى إدارة المركز<br>2️⃣ أو الاتصال بنا: ${CONFIG.WEBSITE.phone}<br>3️⃣ تقديم طلب الإلغاء قبل 7 أيام من نهاية الشهر<br><br>⚠️ قد تُطبق رسوم إدارية بسيطة.` },
    { k: ["خصوصية","الخصوصية","بياناتي","privacy"], a: `🔒 <b>سياسة الخصوصية:</b><br><br>✅ بياناتك مشفرة ومؤمنة<br>✅ لا نشارك بياناتك مع أي طرف ثالث<br>✅ يمكنك طلب حذف بياناتك في أي وقت<br><br>📧 للاستفسار: ${CONFIG.WEBSITE.email}` },
    { k: ["شكوى","مشكلة","اعتراض","complaint","مش مبسوط","زعلان من"], a: `📝 <b>الشكاوى:</b><br><br>نأسف لو واجهت أي مشكلة! 😔<br><br>1️⃣ اتصل: ${CONFIG.WEBSITE.phone}<br>2️⃣ بريد: ${CONFIG.WEBSITE.email}<br>3️⃣ التوجه لإدارة المركز<br><br>💙 رأيك يهمنا!` },
    { k: ["وظائف","شغل","توظيف","عايز اشتغل","jobs","career","فرصة عمل"], a: `💼 <b>الوظائف:</b><br><br>📧 أرسل سيرتك على: ${CONFIG.WEBSITE.email}<br>📞 أو اتصل: ${CONFIG.WEBSITE.phone}<br><br>🏋️ مدربين رياضيين | 🧘 مدربين يوجا<br>📋 موظفين استقبال | 🧹 عمال نظافة` },
    { k: ["اطفال","أطفال","للأطفال","عندكم اطفال","kids","children","صغار"], a: "👶 <b>برامج الأطفال:</b><br><br>من سن 6 سنوات:<br><br>🏊 سباحة | 🤸 جمباز | ⚽ كرة قدم | 🥋 كاراتيه | 🩰 باليه<br><br>👨‍ مدربون متخصصون | 🛡️ بيئة آمنة ومراقبة" },
    { k: ["سيدات","ستات","نساء","بنات","للسيدات","نسائي","women","ladies"], a: "👩 <b>برامج السيدات:</b><br><br>🧘 يوجا وبيلاتس | 💪 لياقة بدنية | 🏊 سباحة<br>🤸 زومبا | 🥊 كيك بوكسينج<br><br>👩‍ مدربات معتمدات | 🔒 أوقات خاصة" },
  ]);

  const SPORTS_DB = Object.freeze([
    { name: "كرة القدم", emoji: "⚽", players: "11 لاعبًا لكل فريق", coach: "بيب جوارديولا", bestPlayer: "ليونيل ميسي", worldCup: "كأس العالم FIFA", equipment: "كرة - مرمى - أحذية - واقي ساق", benefits: "تحسين اللياقة والعمل الجماعي", description: "أشهر رياضة في العالم.", duration: "90 دقيقة", origin: "إنجلترا", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop" },
    { name: "كرة السلة", emoji: "🏀", players: "5 لاعبين لكل فريق", coach: "فيل جاكسون", bestPlayer: "مايكل جوردان", worldCup: "كأس العالم FIBA", equipment: "كرة - سلة", benefits: "السرعة والقوة والتنسيق", description: "رياضة تسجيل النقاط.", duration: "48 دقيقة", origin: "أمريكا 1891", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=250&fit=crop" },
    { name: "الكرة الطائرة", emoji: "🏐", players: "6 لاعبين", coach: "بيرناردو ريزيندي", bestPlayer: "جيلبرتو أماوري", worldCup: "كأس العالم للطائرة", equipment: "كرة - شبكة", benefits: "تقوية العضلات ورد الفعل", description: "رياضة جماعية فوق الشبكة.", duration: "5 أشواط", origin: "أمريكا 1895", image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=250&fit=crop" },
    { name: "كرة اليد", emoji: "🤾", players: "7 لاعبين", coach: "تالانت دويشيباييف", bestPlayer: "ميكيل هانسن", worldCup: "بطولة العالم لليد", equipment: "كرة يد", benefits: "سرعة رد الفعل والقوة", description: "رياضة جماعية قوية.", duration: "60 دقيقة", origin: "الدنمارك 1906", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=250&fit=crop" },
    { name: "السباحة", emoji: "🏊", players: "فردية / تتابع", coach: "بوب بومان", bestPlayer: "مايكل فيلبس", worldCup: "بطولة العالم FINA", equipment: "نظارة - مايوه", benefits: "تقوية الجسم والقلب", description: "من أفضل الرياضات الصحية.", duration: "حسب المسافة", origin: "قديم جدًا", image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=250&fit=crop" },
    { name: "التنس", emoji: "🎾", players: "فردي / زوجي", coach: "باتريك موراتوجلو", bestPlayer: "نوفاك ديوكوفيتش", worldCup: "جراند سلام", equipment: "مضرب - كرات", benefits: "التركيز والسرعة", description: "رياضة مشهورة عالميًا.", duration: "3-5 مجموعات", origin: "فرنسا", image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=250&fit=crop" },
    { name: "تنس الطاولة", emoji: "🏓", players: "فردي / زوجي", coach: "ليو جوليونج", bestPlayer: "ما لونج", worldCup: "بطولة العالم", equipment: "مضرب - كرة - طاولة", benefits: "رد الفعل والتركيز", description: "رياضة سريعة ودقيقة.", duration: "5-7 أشواط", origin: "إنجلترا", image: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=400&h=250&fit=crop" },
    { name: "الريشة الطائرة", emoji: "🏸", players: "فردي / زوجي", coach: "لي يونج داي", bestPlayer: "فيكتور أكسلسن", worldCup: "بطولة العالم", equipment: "مضرب - ريشة", benefits: "السرعة والمرونة", description: "رياضة ممتعة للجميع.", duration: "3 أشواط", origin: "الهند", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=250&fit=crop" },
    { name: "الملاكمة", emoji: "🥊", players: "لاعبان", coach: "فريدي روتش", bestPlayer: "محمد علي كلاي", worldCup: "بطولة العالم", equipment: "قفازات - واقي", benefits: "القوة والتحمل", description: "رياضة قتالية.", duration: "12 جولة", origin: "اليونان", image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=250&fit=crop" },
    { name: "الكاراتيه", emoji: "🥋", players: "فردي", coach: "جيشين فوناكوشي", bestPlayer: "رياضيو اليابان", worldCup: "بطولة العالم WKF", equipment: "بدلة - حزام", benefits: "الانضباط والدفاع", description: "فن قتالي ياباني.", duration: "3 د/جولة", origin: "اليابان", image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&h=250&fit=crop" },
    { name: "الجودو", emoji: "🥋", players: "لاعبان", coach: "جيجورو كانو", bestPlayer: "تيدي رينر", worldCup: "بطولة العالم", equipment: "بدلة - حزام", benefits: "القوة والتوازن", description: "فن الرمي والتثبيت.", duration: "4 دقائق", origin: "اليابان 1882", image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&h=250&fit=crop" },
    { name: "الجمباز", emoji: "🤸", players: "فردي / جماعي", coach: "بيلا كارولي", bestPlayer: "سيمون بايلز", worldCup: "بطولة العالم", equipment: "بدلة", benefits: "المرونة والقوة", description: "رياضة فنية بهلوانية.", duration: "حسب الجهاز", origin: "اليونان", image: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400&h=250&fit=crop" },
    { name: "رفع الأثقال", emoji: "🏋️", players: "فردي", coach: "إيفان تشاكوف", bestPlayer: "نايم سليمان أوغلو", worldCup: "بطولة العالم", equipment: "أثقال - حزام", benefits: "بناء العضلات", description: "رفع أكبر وزن.", duration: "محاولة واحدة", origin: "اليونان", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop" },
    { name: "اليوجا", emoji: "🧘", players: "فردي / جماعي", coach: "باتابهي جويس", bestPlayer: "-", worldCup: "-", equipment: "سجادة يوجا", benefits: "الاسترخاء والمرونة", description: "تنفس وتأمل وحركة.", duration: "60-90 د", origin: "الهند", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop" },
    { name: "اللياقة البدنية", emoji: "💪", players: "فردي / جماعي", coach: "كاي جرين", bestPlayer: "-", worldCup: "-", equipment: "أجهزة رياضية", benefits: "الصحة العامة", description: "تمارين شاملة.", duration: "60 دقيقة", origin: "قديم", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop" },
    { name: "ألعاب القوى", emoji: "🏃", players: "فردي / تتابع", coach: "رينالدو نيهيميا", bestPlayer: "يوسين بولت", worldCup: "بطولة العالم", equipment: "حذاء جري", benefits: "السرعة والتحمل", description: "جري وقفز ورمي.", duration: "حسب المسابقة", origin: "اليونان 776 ق.م", image: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=400&h=250&fit=crop" },
    { name: "الإسكواش", emoji: "🏸", players: "لاعبان", coach: "ديفيد بالمر", bestPlayer: "علي فرج", worldCup: "بطولة العالم", equipment: "مضرب - كرة - نظارة", benefits: "اللياقة وسرعة الرد", description: "رياضة سريعة.", duration: "5 أشواط", origin: "إنجلترا", image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=250&fit=crop" },
    { name: "ركوب الدراجات", emoji: "🚴", players: "فردي / جماعي", coach: "باتريك ماكوايد", bestPlayer: "إيدي ميركس", worldCup: "طواف فرنسا", equipment: "دراجة - خوذة", benefits: "اللياقة والساقين", description: "رياضة صديقة للبيئة.", duration: "حسب المسافة", origin: "فرنسا", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=250&fit=crop" },
    { name: "المبارزة", emoji: "🤺", players: "لاعبان", coach: "دانييل ليفافاسور", bestPlayer: "ألدو مونتانو", worldCup: "بطولة العالم", equipment: "سيف - قناع - بدلة", benefits: "السرعة والتركيز", description: "رياضة أولمبية.", duration: "3 جولات", origin: "مصر القديمة", image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&h=250&fit=crop" },
    { name: "الرماية", emoji: "🏹", players: "فردي", coach: "كيم وو جين", bestPlayer: "كيم وو جين", worldCup: "كأس العالم", equipment: "قوس - أسهم", benefits: "التركيز والدقة", description: "رياضة دقة عالية.", duration: "حسب المسابقة", origin: "قديم جدًا", image: "https://images.unsplash.com/photo-1567591370504-8020998e4cee?w=400&h=250&fit=crop" },
    { name: "الزومبا", emoji: "💃", players: "جماعي", coach: "بيتو بيريز", bestPlayer: "-", worldCup: "-", equipment: "حذاء رياضي", benefits: "حرق السعرات", description: "رقصة لياقة ممتعة.", duration: "60 دقيقة", origin: "كولومبيا", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=250&fit=crop" },
    { name: "البيلاتس", emoji: "🧘", players: "فردي / جماعي", coach: "جوزيف بيلاتس", bestPlayer: "-", worldCup: "-", equipment: "سجادة - أجهزة", benefits: "العضلات العميقة", description: "تقوية الجذع.", duration: "45-60 د", origin: "ألمانيا", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop" },
  ]);

  const SPORT_ALIASES = Object.freeze({
    "السله":"كرة السلة","كورة السلة":"كرة السلة","باسكت":"كرة السلة",
    "كوره":"كرة القدم","الكورة":"كرة القدم","كورة القدم":"كرة القدم",
    "سباحه":"السباحة","عوم":"السباحة","الطايره":"الكرة الطائرة",
    "بوكس":"الملاكمة","كاراتي":"الكاراتيه","جيم":"اللياقة البدنية",
    "الحديد":"رفع الأثقال","اسكواش":"الإسكواش","عجل":"ركوب الدراجات",
    "بادمنتون":"الريشة الطائرة","بينج بونج":"تنس الطاولة",
  });

  const JOKES = Object.freeze([
    "😄 ليه اللاعب راح المستشفى؟<br>لأنه اتكسر فيه <b>الرقم القياسي</b>! 🏆",
    "😂 مدرب السباحة قال للاعب: عوم عوم!<br>اللاعب: مش عارف!<br>المدرب: طب <b>غوص غوص</b>! 🏊",
    "🤣 ليه كرة القدم مش بتتكلم؟<br>لأنها دايمًا <b>مضروبة</b>! ⚽",
    "😆 لاعب التنس راح الدكتور..<br>الدكتور: عندك مشكلة في <b>التركيز</b>!<br>اللاعب: لا، أنا بس <b>بضرب الكرة</b>! 🎾",
    "😄 إيه الفرق بين الملاكم والكمبيوتر؟<br>الملاكم بيضرب <b>باليد</b> والكمبيوتر بيضرب <b>بالكيبورد</b>! 🥊💻",
    "🤣 مدرب الجيم: ارفع الحديد!<br>المتدرب: مش قادر!<br>المدرب: طب ارفع <b>السماعة</b> واتصل بيا لما تقدر! 🏋️",
    "😂 ليه لاعب الكرة مش بيقدر ينام؟<br>لأن عنده <b>ماتش</b>! ⚽😴",
    "😆 واحد راح الجيم أول يوم..<br>قال لمراته: عملت <b>كارديو</b>!<br>مراته: يعني إيه؟<br>قال: <b>مشيت من الجيم للبيت</b>! 🏃‍️😂",
  ]);

  const QUOTES = Object.freeze([
    "💪 <b>«النجاح ليس نهائيًا، والفشل ليس قاتلًا. الشجاعة للاستمرار هي ما يهم.»</b><br>— ونستون تشرشل",
    "🏆 <b>«لا تنتظر اللحظة المثالية، خذ اللحظة واجعلها مثالية.»</b><br>— مجهول",
    "🔥 <b>«الطريق إلى النجاح والطريق إلى الفشل هما نفس الطريق.»</b><br>— كولين آر. ديفيس",
    "⭐ <b>«لا تقارن نفسك بالآخرين. قارن نفسك بالشخص الذي كنت عليه بالأمس.»</b>",
    "🌟 <b>«كل خبير كان يومًا مبتدئًا.»</b><br>— هيلين هايز",
    "💎 <b>«الألم مؤقت، لكن الاستسلام يدوم للأبد.»</b><br>— لانس أرمسترونج",
    "🚀 <b>«لا يهم كم مرة تسقط، المهم كم مرة تنهض.»</b><br>— فينس لومباردي",
    "🦅 <b>«إذا لم تبنِ حلمك، سيعطيك أحدهم وظيفة لبناء حلمه.»</b><br>— توني جاسكينز",
    "🌈 <b>«بعد كل عاصفة، يأتي الهدوء. وبعد كل تعب، يأتي النجاح.»</b>",
    "🏅 <b>«البطل ليس من يفوز دائمًا، بل من لا يستسلم أبدًا.»</b>",
  ]);

  function loadUserName() { userName = Utils.loadJSON(NAME_KEY, null); }
  function saveUserName(x) { userName = x; Utils.saveJSON(NAME_KEY, x); }
  function clearUserName() { userName = null; Utils.removeStorage(NAME_KEY); }
  function n() { return userName ? esc(userName) : null; }
  function getInsultCount() { return parseInt(Utils.loadJSON(CONFIG.STORAGE_KEYS.insultCount, 0) || "0", 10); }
  function bumpInsultCount() { const v = getInsultCount() + 1; Utils.saveJSON(CONFIG.STORAGE_KEYS.insultCount, String(v)); return v; }

  function injectLoginStyles() {
    if (document.getElementById("assistantLoginStyles")) return;
    const st = document.createElement("style");
    st.id = "assistantLoginStyles";
    st.textContent = `
      .assistant-login{position:absolute;inset:0;z-index:60;background:linear-gradient(160deg,#0a0a0f,#1a0a2e 40%,#0d1b2a);display:flex;align-items:center;justify-content:center;border-radius:inherit}
      .assistant-login.hidden{display:none}
      .login-box{width:85%;max-width:320px;text-align:center;padding:30px 22px;background:linear-gradient(170deg,rgba(255,255,255,.05),rgba(255,255,255,.01));border:1px solid rgba(200,170,80,.25);border-radius:22px;backdrop-filter:blur(20px);box-shadow:0 20px 50px rgba(0,0,0,.5);animation:loginPop .6s cubic-bezier(.16,1,.3,1)}
      @keyframes loginPop{from{opacity:0;transform:translateY(30px) scale(.92)}to{opacity:1;transform:translateY(0) scale(1)}}
      @keyframes loginPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
      @keyframes loginShimmer{0%{background-position:-200% center}100%{background-position:200% center}}
      .login-logo{font-size:56px;margin-bottom:10px;animation:loginPulse 3s ease infinite;display:block}
      .login-title{background:linear-gradient(135deg,#c9a84c,#f0d078,#c9a84c);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:loginShimmer 4s linear infinite;font-size:20px;font-weight:800;margin-bottom:6px}
      .login-sub{color:rgba(180,180,200,.65);font-size:12px;margin-bottom:18px;line-height:1.8}
      #loginNameInput{width:100%;padding:13px 16px;border:1px solid rgba(200,170,80,.2);border-radius:12px;background:rgba(10,10,20,.6);color:#e0d8c8;font-size:15px;text-align:center;outline:none;margin-bottom:12px;transition:all .3s}
      #loginNameInput:focus{border-color:rgba(200,170,80,.5);box-shadow:0 0 18px rgba(200,160,60,.12)}
      #loginBtn{width:100%;padding:13px;background:linear-gradient(135deg,#8b6914,#c9a84c,#8b6914);background-size:200% auto;border:none;border-radius:12px;color:#fff;font-size:15px;font-weight:700;cursor:pointer;transition:all .3s;box-shadow:0 4px 18px rgba(200,160,60,.25)}
      #loginBtn:hover{background-position:right center;transform:translateY(-2px)}
      #loginMsg{min-height:20px;margin-top:10px;font-size:12px;color:#e74c3c}
      .assistant-userbar{display:flex;align-items:center;justify-content:space-between;padding:8px 14px;background:linear-gradient(135deg,rgba(200,160,60,.08),rgba(120,80,200,.06));border-bottom:1px solid rgba(200,170,80,.15);font-size:13px;color:#d8cfa8}
      .assistant-userbar .ub-actions button{background:none;border:none;cursor:pointer;font-size:14px;margin-left:6px;opacity:.7;transition:opacity .2s}
      .assistant-userbar .ub-actions button:hover{opacity:1}
    `;
    document.head.appendChild(st);
  }

  function ensureAssistantPositioning() {
    if (!elements.assistant) return;
    if (getComputedStyle(elements.assistant).position === "static") elements.assistant.style.position = "relative";
  }

  function buildLoginOverlay() {
    if (!elements.assistant) return;
    loginOverlay = document.createElement("div");
    loginOverlay.className = "assistant-login";
    loginOverlay.setAttribute("role", "dialog");
    loginOverlay.setAttribute("aria-modal", "true");
    loginOverlay.setAttribute("aria-label", "تسجيل الدخول");
    loginOverlay.innerHTML = `<div class="login-box"><span class="login-logo" aria-hidden="true">🤖</span><h3 class="login-title">تسجيل الدخول</h3><p class="login-sub">اكتب اسمك عشان المساعد يناديك بيه<br>ويكون معاك تجربة شخصية 💙</p><input type="text" id="loginNameInput" aria-label="اسمك" placeholder="اسمك هنا..." maxlength="30" autocomplete="off"><button id="loginBtn" aria-label="تسجيل الدخول">دخول 🚀</button><div id="loginMsg" aria-live="polite"></div></div>`;
    elements.assistant.appendChild(loginOverlay);
    loginInput = loginOverlay.querySelector("#loginNameInput");
    loginMsg = loginOverlay.querySelector("#loginMsg");
    loginOverlay.querySelector("#loginBtn").addEventListener("click", handleLogin);
    loginInput.addEventListener("keydown", e => { if (e.key === "Enter") handleLogin(); });
  }

  function showLogin(prefill) {
    if (!loginOverlay) return;
    loginOverlay.classList.remove("hidden");
    if (prefill && userName) loginInput.value = userName;
    setChatEnabled(false);
    setTimeout(() => loginInput && loginInput.focus(), 100);
  }

  function hideLogin() { if (!loginOverlay) return; loginOverlay.classList.add("hidden"); setChatEnabled(true); }

  function setChatEnabled(on) {
    if (!elements.userInput) return;
    elements.userInput.disabled = !on;
    if (elements.sendBtn) elements.sendBtn.disabled = !on;
  }

  function isValidName(name) {
    if (name.length < 2) return "⚠️ الاسم لازم يكون حرفين على الأقل";
    if (name.length > 30) return "⚠️ الاسم طويل أوي (30 حرف كحد أقصى)";
    for (const w of BAD_WORDS) { if (name.toLowerCase().includes(w.toLowerCase())) return "⚠️ يرجى اختيار اسم مناسب 🌹"; }
    return null;
  }

  function handleLogin() {
    const name = (loginInput && loginInput.value.trim()) || "";
    const err = isValidName(name);
    if (err) { if (loginMsg) loginMsg.textContent = err; return; }
    const isFirst = !userName;
    saveUserName(name);
    if (loginInput) loginInput.value = "";
    if (loginMsg) loginMsg.textContent = "";
    hideLogin();
    updateUserBar();
    if (isFirst) { const tg = Utils.getTimeGreeting(); renderMessage(`<b>${esc(name)}</b>، ${tg.assistantMsg}`, "bot"); }
    else { renderMessage(`✅ تم تغيير اسمك إلى <b>${esc(name)}</b>! 🎉<br><br>من دلوقتي هناديك بالاسم الجديد 💙`, "bot"); }
  }

  function logout() {
    clearUserName(); memory = [];
    Utils.removeStorage(CONFIG.STORAGE_KEYS.chat);
    if (elements.chatMessages) elements.chatMessages.innerHTML = "";
    updateUserBar(); showLogin(false);
  }

  function updateUserBar() {
    if (!elements.chatMessages) return;
    let bar = document.getElementById("assistantUserBar");
    if (!userName) { if (bar) bar.style.display = "none"; return; }
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "assistantUserBar"; bar.className = "assistant-userbar";
      bar.innerHTML = `<span>👤 مرحبًا، <b id="ubName"></b></span><span class="ub-actions"><button id="ubEdit" aria-label="تغيير الاسم" title="تغيير الاسم">✏️</button><button id="ubLogout" aria-label="تسجيل خروج" title="تسجيل خروج">🚪</button></span>`;
      elements.chatMessages.before(bar);
      bar.querySelector("#ubEdit").addEventListener("click", () => showLogin(true));
      bar.querySelector("#ubLogout").addEventListener("click", logout);
    }
    bar.style.display = "flex";
    bar.querySelector("#ubName").textContent = userName;
  }

  function init() {
    if (initialized) return;
    initialized = true;
    cacheElements();
    if (!elements.assistant || !elements.chatMessages || !elements.userInput) return;
    loadUserName(); bindEvents(); ensureAssistantPositioning();
    injectLoginStyles(); buildLoginOverlay(); applySavedTheme(); updateUserBar();
    if (!userName) { showLogin(false); }
    else {
      hideLogin(); loadSavedChat();
      if (!sessionStorage.getItem("welcomed_" + userName)) {
        const tg = Utils.getTimeGreeting();
        renderMessage(`<b>${esc(userName)}</b>، ${tg.assistantMsg}`, "bot");
        sessionStorage.setItem("welcomed_" + userName, "1");
      }
    }
  }

  function cacheElements() {
    elements = {
      assistant: Utils.$(SELECTORS.assistant), toggleBtn: Utils.$(SELECTORS.assistantToggle),
      closeBtn: Utils.$(SELECTORS.closeAssistant), sendBtn: Utils.$(SELECTORS.sendBtn),
      userInput: Utils.$(SELECTORS.userInput), chatMessages: Utils.$(SELECTORS.chatMessages),
      voiceBtn: Utils.$(SELECTORS.voiceBtn), themeBtn: Utils.$(SELECTORS.themeBtn),
      newChatBtn: Utils.$(SELECTORS.newChatBtn), clearChatBtn: Utils.$(SELECTORS.clearChatBtn),
    };
  }

  function bindEvents() {
    elements.toggleBtn?.addEventListener("click", () => elements.assistant.classList.toggle("open"));
    elements.closeBtn?.addEventListener("click", () => elements.assistant.classList.remove("open"));
    elements.sendBtn?.addEventListener("click", sendMessage);
    elements.userInput?.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } });
    elements.newChatBtn?.addEventListener("click", startNewChat);
    elements.clearChatBtn?.addEventListener("click", clearChat);
    elements.themeBtn?.addEventListener("click", toggleTheme);
    initVoiceRecognition();
    elements.userInput?.setAttribute("aria-label", "اكتب رسالتك هنا");
    elements.sendBtn?.setAttribute("aria-label", "إرسال");
    elements.voiceBtn?.setAttribute("aria-label", "التحدث بالصوت");
    elements.themeBtn?.setAttribute("aria-label", "تبديل الوضع الليلي");
    elements.newChatBtn?.setAttribute("aria-label", "محادثة جديدة");
    elements.clearChatBtn?.setAttribute("aria-label", "مسح المحادثة");
    elements.toggleBtn?.setAttribute("aria-label", "فتح المساعد");
    elements.closeBtn?.setAttribute("aria-label", "إغلاق المساعد");
  }

  function checkBadWords(question) {
    for (const word of BAD_WORDS) {
      if (question.includes(word.toLowerCase())) {
        const count = bumpInsultCount();
        if (count >= MAX_INSULTS) {
          SiteBanModule.activateSiteBan(count);
          renderMessage(`🚫 <b>تم حظر الوصول إلى الموقع بالكامل${n() ? ' يا <b>'+n()+'</b>' : ''}.</b><br><br>بسبب استخدام ألفاظ غير لائقة متكررة.<br><br>سيتم إعادة التوجيه...`, "bot");
          setTimeout(() => location.reload(), 2000);
          return null;
        }
        if (count === 1) return `🤖 <b>تنبيه ودي${n() ? ' يا <b>'+n()+'</b>' : ''}:</b><br><br>أفضّل أن يكون حوارنا مبنيًا على الاحترام المتبادل. 🌹<br><br>أنا هنا لمساعدتك في أي سؤال رياضي! 💙<br><br><small style="color:#e74c3c;">⚠️ تحذير ${count}/${MAX_INSULTS}</small>`;
        if (count === 2) return `🤖 <b>⚠️ تحذير أخير${n() ? ' يا <b>'+n()+'</b>' : ''}!</b><br><br>لقد تم رصد ألفاظ غير مناسبة مرة أخرى.<br><br>🔴 <b style="color:#e74c3c;">المخالفة القادمة = حظر الموقع بالكامل!</b><br><br>أرجو أن نتحاور باحترام. 💙<br><br><small style="color:#e74c3c;">⚠️ تحذير ${count}/${MAX_INSULTS}</small>`;
        return null;
      }
    }
    return undefined;
  }

  function sendMessage() {
    if (!userName) return;
    const now = Date.now();
    if (now - lastMessageTime < CONFIG.ASSISTANT.messageRateLimit) return;
    lastMessageTime = now;
    const text = (elements.userInput && elements.userInput.value.trim()) || "";
    if (!text) return;
    if (text.length > CONFIG.ASSISTANT.maxMessageLength) { showToast(`⚠️ الرسالة طويلة أوي (${CONFIG.ASSISTANT.maxMessageLength} حرف كحد أقصى)`, "warning"); return; }
    renderMessage(text, "user");
    if (elements.userInput) { elements.userInput.value = ""; elements.userInput.focus(); }
    showTypingIndicator();
    const delay = CONFIG.ASSISTANT.responseDelay + Math.random() * 400;
    setTimeout(() => {
      hideTypingIndicator();
      const reply = getBotReply(text);
      if (reply === null) return;
      renderMessage(reply, "bot", text);
      remember(text, reply); saveChat(); speakText(reply);
    }, delay);
  }

  function getBotReply(rawQuestion) {
    const question = normalizeQuestion(rawQuestion);
    const badResult = checkBadWords(question);
    if (badResult !== undefined) return badResult;
    if (question.includes("اسمي ايه") || question.includes("اسمي إيه") || question.includes("افتكر اسمي") || question.includes("what is my name")) return `📛 اسمك هو <b>${n()}</b>! 😊<br><br>لو تحب تغيره اكتب "غير اسمي" ✏️`;
    if (question.includes("غير اسمي") || question.includes("غير اسمى") || question.includes("change name") || question.includes("بدل اسمي")) { showLogin(true); return `✏️ <b>تمام يا ${n()}!</b><br><br>فتحت لك شاشة تسجيل الدخول، اكتب اسمك الجديد 👇`; }
    if (question.includes("تسجيل خروج") || question.includes("logout") || question.includes("سجل خروج")) { setTimeout(logout, 800); return `🚪 <b>تمام يا ${n()}،</b> جاري تسجيل الخروج...<br><br>شكرًا إنك كنت معانا! 💙`; }
    if (question.includes("نكتة") || question.includes("ضحكني") || question.includes("قولي نكتة") || question.includes("عايز اضحك") || question.includes("joke") || question.includes("funny")) return getRandomJoke();
    if (question.includes("حكمة") || question.includes("اقتباس") || question.includes("تحفيز") || question.includes("حفزني") || question.includes("motivation") || question.includes("quote") || question.includes("كلام يحفز") || question.includes("كلام حلو")) return getRandomQuote();
    if (question.includes("الوقت") || question.includes("الساعة كام") || question.includes("كام الساعة") || question.includes("what time")) return `🕐 <b>الوقت الحالي:</b> ${Utils.getArabicTimeLive()}<br><br>⏰ ساعات عملنا: ${CONFIG.WEBSITE.workTime}`;
    if (question.includes("التاريخ") || question.includes("النهارده كام") || question.includes("اليوم كام") || question.includes("تاريخ اليوم") || question.includes("today")) return `📅 <b>تاريخ اليوم:</b> ${Utils.getArabicDate()}`;
    const greeting = searchGreetings(question);
    if (greeting) return greeting;
    const sportInfo = searchSport(question);
    if (sportInfo) { navigateToSection(question); return sportInfo + getSuggestions(question); }
    for (const item of DATABASE) {
      if (item.k.some(kw => question.includes(kw.toLowerCase()))) { navigateToSection(question); const ans = typeof item.a === "function" ? item.a(n()) : item.a; return ans + getSuggestions(question); }
    }
    const learned = searchLearned(question);
    if (learned) return learned;
    return getFallbackResponse();
  }

  function normalizeQuestion(text) { return text.trim().toLowerCase().replace(/[؟?!.,،؛;:]/g, "").replace(/\s+/g, " "); }
  function searchGreetings(question) { for (const g of GREETINGS_DB) { if (g.k.some(kw => question.includes(kw.toLowerCase()))) return g.f(n()); } return null; }

  function searchSport(question) {
    let sport = SPORTS_DB.find(s => question.includes(s.name));
    if (!sport) { const padded = ` ${question} `; for (const [alias, sportName] of Object.entries(SPORT_ALIASES)) { if (padded.includes(` ${alias} `)) { sport = SPORTS_DB.find(s => s.name === sportName); break; } } }
    if (!sport) return null;
    return `<div class="sport-card" role="article"><img src="${sport.image}" alt="${sport.name}" style="width:100%;height:150px;object-fit:cover;border-radius:8px;margin-bottom:10px;" loading="lazy" onerror="this.onerror=null;this.src='${IMG_FALLBACK}'"><h3>${sport.emoji} ${sport.name}</h3><hr><p>📖 <b>نبذة:</b> ${sport.description}</p><p>🏆 <b>أفضل لاعب:</b> ${sport.bestPlayer}</p><p>👨‍ <b>أفضل مدرب:</b> ${sport.coach}</p><p>👥 <b>عدد اللاعبين:</b> ${sport.players}</p><p>🏅 <b>البطولة:</b> ${sport.worldCup}</p><p>🎒 <b>المعدات:</b> ${sport.equipment}</p><p>💪 <b>الفوائد:</b> ${sport.benefits}</p><p>⏱️ <b>المدة:</b> ${sport.duration}</p><p>🌍 <b>النشأة:</b> ${sport.origin}</p></div>`;
  }

  function searchLearned(question) { const db = Utils.loadJSON(CONFIG.STORAGE_KEYS.learning, []); const found = db.find(item => question.includes(item.question)); if (!found) return null; return Utils.sanitizeHTML(found.answer); }
  function getSuggestions(question) { if (question.includes("رياضة") || question.includes("الرياضات")) return `<hr><p>💡 <b>يمكنك أيضًا السؤال عن:</b></p><p>🏆 أفضل المدربين | 🥇 أفضل اللاعبين | 📖 قوانين اللعبة | 💪 التمارين | 🎒 المعدات</p>`; if (question.includes("مدرب")) return `<hr><p>💡 <b>جرّب السؤال عن:</b> 🥇 أفضل لاعب | 🏆 البطولات | 📝 طريقة التسجيل</p>`; if (question.includes("سعر") || question.includes("اشتراك")) return `<hr><p>💡 <b>قد يهمك أيضًا:</b> 🎁 العروض | 📋 الشروط | ⏰ المواعيد</p>`; return ""; }
  function getFallbackResponse() { return `<div class="unknown-answer">🤖 <b>عذرًا${n() ? ' يا <b>'+n()+'</b>' : ''}، لم أفهم سؤالك تمامًا.</b><br><br><p>يمكنني مساعدتك في:</p><ul style="text-align:right;padding-right:20px;"><li>⚽ الرياضات المتاحة (${SPORTS_DB.length} رياضة)</li><li>👨 المدربين والأبطال</li><li>💰 الأسعار والاشتراكات</li><li>📝 طريقة التسجيل</li><li>🎁 العروض والخصومات</li><li>📍 العنوان والتواصل</li><li>⏰ مواعيد العمل</li><li>👶 برامج الأطفال والسيدات</li><li>😄 نكتة أو حكمة تحفيزية</li><li>🕐 الوقت والتاريخ</li><li>✏️ غير اسمي</li><li>🚪 تسجيل خروج</li></ul><p style="margin-top:10px;color:#888;">💡 جرّب تكتب بصيغة مختلفة أو اسأل "مساعدة"</p></div>`; }
  function getRandomJoke() { return `😄 <b>نكتة رياضية${n() ? ' يا '+n() : ''}:</b><br><br>${JOKES[Math.floor(Math.random() * JOKES.length)]}<br><br>😂 عجبك؟ اكتب "نكتة" عشان نكتة تانية!`; }
  function getRandomQuote() { return `${QUOTES[Math.floor(Math.random() * QUOTES.length)]}<br><br>✨ اكتب "حكمة" عشان حكمة تانية!`; }
  function navigateToSection(question) { const intentMap = { prices: ["سعر","اشتراك","فلوس","تكلفة"], registration: ["تسجيل","اشترك","سجل"], contact: ["عنوان","مكان","تواصل","رقم","هاتف"] }; for (const [id, kws] of Object.entries(intentMap)) { if (kws.some(kw => question.includes(kw))) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); break; } } }

  function renderMessage(text, sender, questionForFeedback) {
    if (!elements.chatMessages) return;
    const wrapper = document.createElement("div"); wrapper.className = sender + "-message"; wrapper.setAttribute("role", "log");
    const message = document.createElement("div"); message.className = "message"; message.innerHTML = sender === "user" ? esc(text) : text;
    const time = document.createElement("time"); time.className = "time"; time.textContent = Utils.getArabicTime(); time.setAttribute("datetime", new Date().toISOString());
    wrapper.append(message, time);
    if (sender === "bot" && questionForFeedback !== undefined) appendFeedback(wrapper, questionForFeedback, text);
    elements.chatMessages.appendChild(wrapper); elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  }

  function showTypingIndicator() { if (!elements.chatMessages) return; const typing = document.createElement("div"); typing.id = "typing-indicator"; typing.className = "bot-message"; typing.setAttribute("aria-live", "polite"); typing.innerHTML = `<div class="message typing-dots">🤖 يكتب<span class="dots-anim">...</span></div>`; elements.chatMessages.appendChild(typing); elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight; }
  function hideTypingIndicator() { document.getElementById("typing-indicator")?.remove(); }

  function appendFeedback(container, question, answer) {
    const feedback = document.createElement("div"); feedback.className = "feedback";
    feedback.innerHTML = `<p style="font-size:12px;color:#888;">هل كانت الإجابة مفيدة؟</p><button class="fb-like" aria-label="إجابة مفيدة">👍</button><button class="fb-dislike" aria-label="إجابة غير مفيدة">👎</button>`;
    container.appendChild(feedback);
    feedback.querySelector(".fb-like").addEventListener("click", () => { saveFeedback(question, answer, "positive"); feedback.innerHTML = "<p style='color:#27ae60;font-size:12px;'>✅ شكرًا!</p>"; });
    feedback.querySelector(".fb-dislike").addEventListener("click", () => { saveFeedback(question, answer, "negative"); feedback.innerHTML = "<p style='color:#e67e22;font-size:12px;'>⚠️ سنحسّن الإجابة.</p>"; });
  }

  function saveFeedback(question, answer, rating) { const db = Utils.loadJSON(CONFIG.STORAGE_KEYS.feedback, []); db.push({ question, answer, rating, date: Utils.getArabicDateTime() }); Utils.saveJSON(CONFIG.STORAGE_KEYS.feedback, db); }
  function remember(q, a) { memory.push({ question: q, answer: a, time: new Date() }); if (memory.length > CONFIG.ASSISTANT.maxMemory) memory.shift(); }
  function saveChat() { if (!CONFIG.ASSISTANT.saveChat) return; Utils.saveJSON(CONFIG.STORAGE_KEYS.chat, memory); }
  function loadSavedChat() { Utils.loadJSON(CONFIG.STORAGE_KEYS.chat, []).forEach(({ question, answer }) => { renderMessage(question, "user"); renderMessage(answer, "bot", question); }); }
  function startNewChat() { if (!userName) { showToast("⚠️ سجّل دخول الأول عشان تعمل محادثة جديدة", "warning"); return; } if (memory.length > 0) { const h = Utils.loadJSON(CONFIG.STORAGE_KEYS.history, []); h.push({ date: Utils.getArabicDateTime(), messages: [...memory] }); Utils.saveJSON(CONFIG.STORAGE_KEYS.history, h); } elements.chatMessages.innerHTML = ""; memory = []; const tg = Utils.getTimeGreeting(); renderMessage(`👋 محادثة جديدة يا <b>${n()}</b>! ${tg.title}<br><br>${tg.sub}`, "bot"); }
  function clearChat() { if (!userName) return; elements.chatMessages.innerHTML = ""; memory = []; Utils.removeStorage(CONFIG.STORAGE_KEYS.chat); renderMessage(`🗑️ تم مسح المحادثة بنجاح${n() ? ' يا <b>'+n()+'</b>' : ''}.`, "bot"); }
  function speakText(text) { if (!CONFIG.ASSISTANT.enableVoice || !("speechSynthesis" in window)) return; const u = new SpeechSynthesisUtterance(Utils.stripHTML(text)); u.lang = "ar-EG"; u.rate = 0.95; u.pitch = 1.05; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); }

  function initVoiceRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR || !elements.voiceBtn) return;
    const recognition = new SR();
    recognition.lang = "ar-EG"; recognition.continuous = false; recognition.interimResults = false;
    elements.voiceBtn.addEventListener("click", () => { try { recognition.start(); elements.voiceBtn.classList.add("listening"); elements.voiceBtn.textContent = "🔴"; } catch { /* active */ } });
    recognition.onresult = e => { elements.userInput.value = e.results[0][0].transcript; sendMessage(); };
    recognition.onend = () => { elements.voiceBtn.classList.remove("listening"); elements.voiceBtn.textContent = "🎤"; };
    recognition.onerror = () => { elements.voiceBtn.classList.remove("listening"); elements.voiceBtn.textContent = "🎤"; };
  }

  function toggleTheme() { document.body.classList.toggle("dark-mode"); Utils.saveJSON(CONFIG.STORAGE_KEYS.theme, document.body.classList.contains("dark-mode")); }
  function applySavedTheme() { if (Utils.loadJSON(CONFIG.STORAGE_KEYS.theme, false)) document.body.classList.add("dark-mode"); }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   § CSS: Time-Based Background + Live Clock
   ═══════════════════════════════════════════════════════════ */
(function injectTimeStyles() {
  if (document.getElementById("timeWelcomeStyles")) return;
  const st = document.createElement("style");
  st.id = "timeWelcomeStyles";
  st.textContent = `
    body::before{content:'';position:fixed;top:0;left:0;width:100%;height:100%;z-index:-2;transition:background 3s ease;pointer-events:none}
    body.time-morning::before{background:radial-gradient(ellipse at 20% 0%,rgba(255,180,50,.12),transparent 50%),radial-gradient(ellipse at 80% 100%,rgba(255,120,80,.08),transparent 50%)}
    body.time-afternoon::before{background:radial-gradient(ellipse at 50% 0%,rgba(79,172,254,.1),transparent 50%),radial-gradient(ellipse at 0% 100%,rgba(67,233,123,.06),transparent 50%)}
    body.time-evening::before{background:radial-gradient(ellipse at 70% 0%,rgba(161,140,209,.12),transparent 50%),radial-gradient(ellipse at 20% 100%,rgba(251,194,235,.08),transparent 50%)}
    body.time-night::before{background:radial-gradient(ellipse at 30% 0%,rgba(100,80,200,.12),transparent 50%),radial-gradient(ellipse at 80% 100%,rgba(45,27,105,.1),transparent 50%)}
    .tw-float-bar{position:fixed;top:0;left:0;right:0;z-index:9999;display:flex;align-items:center;gap:14px;padding:12px 24px;background:rgba(211,211,218,0);backdrop-filter:blur(30px) saturate(1.5);-webkit-backdrop-filter:blur(30px) saturate(1.5);border-bottom:1px solid rgba(255,255,255,.06);transform:translateY(-100%);transition:transform .8s cubic-bezier(.16,1,.3,1),background .5s ease;direction:rtl}
    .tw-float-bar.visible{transform:translateY(0)}
    .tw-fb-icon{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;animation:twFbPulse 3s ease-in-out infinite}
    .tw-fb-icon svg{width:18px;height:18px;fill:rgba(255,255,255,.85)}
    @keyframes twFbPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,.1)}50%{box-shadow:0 0 12px 2px rgba(255,255,255,.08)}}
    .tw-fb-text{display:flex;flex-direction:column;flex:1;min-width:0}
    .tw-fb-label{font-size:10px;font-weight:600;color:rgba(255,255,255,.45);letter-spacing:1.5px;text-transform:uppercase}
    .tw-fb-title{font-size:14px;font-weight:700;color:rgba(255,255,255,.9);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .tw-fb-time{font-size:13px;font-weight:600;color:rgba(255,255,255,.7);font-variant-numeric:tabular-nums;padding:5px 12px;background:rgba(255,255,255,.06);border-radius:20px;border:1px solid rgba(255,255,255,.06);flex-shrink:0;min-width:75px;text-align:center;letter-spacing:.5px}
    @media(max-width:600px){.tw-float-bar{padding:10px 16px;gap:10px}.tw-fb-icon{width:30px;height:30px}.tw-fb-icon svg{width:15px;height:15px}.tw-fb-title{font-size:12px}.tw-fb-time{font-size:11px;padding:4px 10px;min-width:65px}}
  `;
  document.head.appendChild(st);
})();


/* ═══════════════════════════════════════════════════════════
   § MODULE: Fireworks 🎆
   ═══════════════════════════════════════════════════════════ */
const FireworksModule = (() => {
  let canvas, ctx, rockets = [], particles = [], shootingStars = [];
  let audioCtx = null, soundEnabled = Utils.loadJSON("fireworks_sound", true);
  let lastLaunch = 0, nextDelay = 4000, lastShootingStar = 0, lastFinale = 0;
  const FINALE_INTERVAL = 45000;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const COLORS = ["#f0d078","#c9a84c","#fda085","#a18cd1","#4facfe","#fbc2eb","#ff6b6b","#48dbfb","#ff9ff3","#feca57","#ff4757","#2ed573","#1e90ff","#ffa502","#7bed9f","#eccc68","#ff6348","#70a1ff","#5352ed","#ff7979","#ffd32a","#ff5e78","#c56cf0","#7dffb2","#82ccdd","#f8c291","#e55039","#6a89cc","#b8e994","#f8a5c2"];
  const MAX_PARTICLES = 900;

  function init() {
    if (reduceMotion) return;
    injectStarStyles(); createStarField();
    canvas = document.createElement("canvas"); canvas.id = "fwCanvas";
    canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;";
    document.body.appendChild(canvas); ctx = canvas.getContext("2d"); resize();
    window.addEventListener("resize", resize);
    const unlock = () => { if (!audioCtx) { try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch {} } if (audioCtx && audioCtx.state === "suspended") audioCtx.resume(); document.removeEventListener("click", unlock); document.removeEventListener("keydown", unlock); };
    document.addEventListener("click", unlock); document.addEventListener("keydown", unlock);
    addToggleButton(); lastLaunch = performance.now(); lastFinale = performance.now(); lastShootingStar = performance.now();
    requestAnimationFrame(loop);
  }

  function resize() { if (!canvas) return; canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  function createStarField() { if (document.getElementById("skyStarField")) return; const field = document.createElement("div"); field.id = "skyStarField"; field.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;overflow:hidden;"; const count = Math.min(70, Math.floor(window.innerWidth / 18)); for (let i = 0; i < count; i++) { const s = document.createElement("span"); const size = Math.random() * 2 + 1; s.style.cssText = "position:absolute;top:" + (Math.random()*70) + "%;left:" + (Math.random()*100) + "%;width:" + size + "px;height:" + size + "px;border-radius:50%;background:#fff;animation:skyTwinkle " + (2+Math.random()*3) + "s ease-in-out " + (Math.random()*3) + "s infinite;"; field.appendChild(s); } document.body.appendChild(field); }
  function injectStarStyles() { if (document.getElementById("skyStarStyles")) return; const st = document.createElement("style"); st.id = "skyStarStyles"; st.textContent = "@keyframes skyTwinkle{0%,100%{opacity:.15;transform:scale(.8)}50%{opacity:.9;transform:scale(1.15)}}"; document.head.appendChild(st); }

  function loop(now) {
    requestAnimationFrame(loop); if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.globalCompositeOperation = "lighter";
    maybeSpawnShootingStar(now); updateShootingStars();
    if (now - lastLaunch > nextDelay) { lastLaunch = now; nextDelay = 4000 + Math.random() * 2500; launchBurst(7); }
    if (now - lastFinale > FINALE_INTERVAL) { lastFinale = now; launchBurst(12); }
    updateRockets(); updateParticles(); ctx.globalAlpha = 1;
  }

  function maybeSpawnShootingStar(now) { if (now - lastShootingStar < 10000 + Math.random() * 10000) return; lastShootingStar = now; shootingStars.push({ x: Math.random()*canvas.width*.6, y: Math.random()*canvas.height*.35, vx: 5+Math.random()*4, vy: 2+Math.random()*2, life: 45+Math.random()*25, size: 1.2+Math.random()*.8 }); }
  function updateShootingStars() { for (let i = shootingStars.length-1; i >= 0; i--) { const s = shootingStars[i]; s.x += s.vx; s.y += s.vy; s.life--; if (s.life <= 0 || s.x > canvas.width+50 || s.y > canvas.height+50) { shootingStars.splice(i,1); continue; } const grad = ctx.createLinearGradient(s.x,s.y,s.x-s.vx*10,s.y-s.vy*10); grad.addColorStop(0,"rgba(255,255,255,.9)"); grad.addColorStop(1,"rgba(255,255,255,0)"); ctx.strokeStyle = grad; ctx.lineWidth = s.size; ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(s.x-s.vx*10,s.y-s.vy*10); ctx.stroke(); ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.beginPath(); ctx.arc(s.x,s.y,s.size,0,Math.PI*2); ctx.fill(); } }
  function launchBurst(count) { for (let i = 0; i < count; i++) setTimeout(launchRocket, i*120); }
  function launchRocket() { const x = canvas.width*(.1+Math.random()*.8); rockets.push({ x, y: canvas.height+10, vx: (Math.random()-.5)*1.2, vy: -(5+Math.random()*3), life: 60+Math.random()*30 }); playWhistle(); }
  function updateRockets() { for (let i = rockets.length-1; i >= 0; i--) { const r = rockets[i]; r.x += r.vx; r.y += r.vy; r.vy += .02; r.life--; const grad = ctx.createLinearGradient(r.x,r.y,r.x-r.vx*6,r.y-r.vy*6); grad.addColorStop(0,"rgba(255,225,160,.85)"); grad.addColorStop(1,"rgba(255,225,160,0)"); ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(r.x,r.y); ctx.lineTo(r.x-r.vx*6,r.y-r.vy*6); ctx.stroke(); ctx.fillStyle = "rgba(255,245,210,.95)"; ctx.beginPath(); ctx.arc(r.x,r.y,2,0,Math.PI*2); ctx.fill(); if (r.life <= 0 || r.vy > -.5) { explode(r.x,r.y); rockets.splice(i,1); } } }
  function explode(x,y) { if (particles.length > MAX_PARTICLES) return; const types = ["peony","ring","willow","crackle","chrysanthemum"]; const type = types[Math.floor(Math.random()*types.length)]; const c1 = COLORS[Math.floor(Math.random()*COLORS.length)]; const c2 = COLORS[Math.floor(Math.random()*COLORS.length)]; switch(type) { case "peony": burstPeony(x,y,c1); break; case "ring": burstRing(x,y,c1); break; case "willow": burstWillow(x,y); break; case "crackle": burstCrackle(x,y,c1); break; case "chrysanthemum": burstChrysanthemum(x,y,c1,c2); break; } playBoom(type); }
  function makeParticle(x,y,angle,speed,color,opts={}) { return { x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,alpha:.95,size:opts.size||1.4,color,decay:opts.decay||.008,gravity:opts.gravity||.035,crackle:opts.crackle||false,crackled:false }; }
  function burstPeony(x,y,c) { const n = 45+Math.floor(Math.random()*20); for (let i=0;i<n;i++) { const a = (Math.PI*2/n)*i+Math.random()*.2; particles.push(makeParticle(x,y,a,1.5+Math.random()*2.5,c)); } }
  function burstRing(x,y,c) { const n=55; const sp=2.8+Math.random()*.8; for (let i=0;i<n;i++) { const a=(Math.PI*2/n)*i; particles.push(makeParticle(x,y,a,sp+Math.random()*.3,c,{size:1.2,decay:.01})); } }
  function burstWillow(x,y) { const n=40; for (let i=0;i<n;i++) { const a=(Math.PI*2/n)*i+Math.random()*.3; particles.push(makeParticle(x,y,a,1+Math.random()*1.8,"#f0d078",{size:1.3,decay:.004,gravity:.06})); } }
  function burstCrackle(x,y,c) { const n=32; for (let i=0;i<n;i++) { const a=(Math.PI*2/n)*i+Math.random()*.3; particles.push(makeParticle(x,y,a,1.5+Math.random()*2,c,{crackle:true,decay:.007})); } }
  function burstChrysanthemum(x,y,c1,c2) { const n=55; for (let i=0;i<n;i++) { const a=(Math.PI*2/n)*i+Math.random()*.15; const sp=1.5+Math.random()*2.6; particles.push(makeParticle(x,y,a,sp,sp>2.8?c1:c2,{size:1.5,decay:.007})); } }
  function spawnMicroSparks(x,y) { if (particles.length > MAX_PARTICLES) return; for (let i=0;i<3;i++) { const a=Math.random()*Math.PI*2; particles.push(makeParticle(x,y,a,.5+Math.random(),"#fff8dc",{size:.8,decay:.03,gravity:.02})); } }
  function updateParticles() { for (let i=particles.length-1;i>=0;i--) { const p=particles[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=p.gravity; p.vx*=.985; p.vy*=.985; p.alpha-=p.decay; if (p.crackle&&!p.crackled&&p.alpha<.35) { p.crackled=true; spawnMicroSparks(p.x,p.y); } if (p.alpha<=0) { particles.splice(i,1); continue; } ctx.globalAlpha=p.alpha; ctx.fillStyle=p.color; ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); } }
  function playWhistle() { if (!soundEnabled||!audioCtx||audioCtx.state!=="running") return; const t=audioCtx.currentTime; const osc=audioCtx.createOscillator(); const gain=audioCtx.createGain(); osc.type="sine"; osc.frequency.setValueAtTime(300,t); osc.frequency.exponentialRampToValueAtTime(900,t+.6); gain.gain.setValueAtTime(.0001,t); gain.gain.exponentialRampToValueAtTime(.018,t+.1); gain.gain.exponentialRampToValueAtTime(.0001,t+.6); osc.connect(gain); gain.connect(audioCtx.destination); osc.start(t); osc.stop(t+.65); }
  function playBoom(type) { if (!soundEnabled||!audioCtx||audioCtx.state!=="running") return; const t=audioCtx.currentTime; const dur=type==="willow"?1.4:1.1; const buffer=audioCtx.createBuffer(1,audioCtx.sampleRate*dur,audioCtx.sampleRate); const data=buffer.getChannelData(0); for (let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,2.6); const src=audioCtx.createBufferSource(); src.buffer=buffer; const filter=audioCtx.createBiquadFilter(); filter.type="lowpass"; filter.frequency.setValueAtTime(type==="crackle"?1400:800,t); filter.frequency.exponentialRampToValueAtTime(60,t+dur); const gain=audioCtx.createGain(); const vol=.04+Math.random()*.05; gain.gain.setValueAtTime(vol,t); gain.gain.exponentialRampToValueAtTime(.0001,t+dur); src.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination); src.start(t); }
  function addToggleButton() { const btn=document.createElement("button"); btn.id="fwSoundToggle"; btn.textContent=soundEnabled?"🔊":"🔇"; btn.setAttribute("aria-label",soundEnabled?"كتم صوت الألعاب النارية":"تشغيل صوت الألعاب النارية"); btn.style.cssText="position:fixed;bottom:20px;left:20px;z-index:9998;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.15);background:rgba(10,10,20,.5);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .3s;"; btn.addEventListener("click",e=>{e.stopPropagation();soundEnabled=!soundEnabled;Utils.saveJSON("fireworks_sound",soundEnabled);btn.textContent=soundEnabled?"🔊":"🔇";btn.setAttribute("aria-label",soundEnabled?"كتم صوت الألعاب النارية":"تشغيل صوت الألعاب النارية");if(soundEnabled&&audioCtx&&audioCtx.state==="suspended")audioCtx.resume();}); document.body.appendChild(btn); }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   § MODULE: Scroll Progress Bar 📊
   ═══════════════════════════════════════════════════════════ */
const ScrollProgressModule = (() => {
  function init() {
    const bar = document.createElement("div"); bar.id = "scrollProgressBar";
    bar.style.cssText = "position:fixed;top:0;left:0;height:3px;z-index:10000;background:linear-gradient(90deg,#c9a84c,#f0d078,#c9a84c);width:0%;transition:width .1s linear;pointer-events:none;";
    document.body.appendChild(bar);
    window.addEventListener("scroll", () => { const scrollTop = window.scrollY; const docHeight = document.documentElement.scrollHeight - window.innerHeight; const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0; bar.style.width = progress + "%"; }, { passive: true });
  }
  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   § MODULE: Reveal On Scroll ✨
   ═══════════════════════════════════════════════════════════ */
const RevealOnScrollModule = (() => {
  function init() {
    if (!document.getElementById("revealStyles")) { const st = document.createElement("style"); st.id = "revealStyles"; st.textContent = `.reveal-on-scroll{opacity:0;transform:translateY(40px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}.reveal-on-scroll.revealed{opacity:1;transform:translateY(0)}`; document.head.appendChild(st); }
    const selectors = ["h1","h2","h3",".sport-card",".gallery-item",".testimonial",".faq-container",".counter",".price-card",".contact-form",".section-title",".intro-text",".activities-grid > *",".features-grid > *"];
    const els = document.querySelectorAll(selectors.join(","));
    els.forEach((el, i) => { if (!el.classList.contains("reveal-on-scroll")) { el.classList.add("reveal-on-scroll"); el.style.transitionDelay = (i % 4) * 0.1 + "s"; } });
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("revealed"); observer.unobserve(entry.target); } }); }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll(".reveal-on-scroll").forEach(el => observer.observe(el));
  }
  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   § MODULE: 3D Tilt Cards 🃏
   ═══════════════════════════════════════════════════════════ */
const TiltCardModule = (() => {
  function init() {
    const cards = document.querySelectorAll(".sport-card, .price-card, .testimonial");
    if (!cards.length) return;
    cards.forEach(card => {
      card.style.transition = "transform .3s ease, box-shadow .3s ease";
      card.addEventListener("mousemove", e => { const rect = card.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; const cx = rect.width / 2; const cy = rect.height / 2; const rx = ((y-cy)/cy)*-8; const ry = ((x-cx)/cx)*8; card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`; card.style.boxShadow = `${-ry}px ${rx}px 25px rgba(201,168,76,.2)`; });
      card.addEventListener("mouseleave", () => { card.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale(1)"; card.style.boxShadow = ""; });
    });
  }
  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   § MODULE: Confetti 🎊
   ═══════════════════════════════════════════════════════════ */
const ConfettiModule = (() => {
  let canvas, ctx, pieces = [], animating = false;
  const COLORS = ["#c9a84c","#f0d078","#ff6b6b","#4facfe","#2ed573","#feca57","#ff9ff3","#5352ed"];
  function init() { const form = document.getElementById("registration-form"); if (form) form.addEventListener("submit", () => setTimeout(launchConfetti, 500)); }
  function launchConfetti() {
    if (animating) return; animating = true; pieces = [];
    canvas = document.createElement("canvas"); canvas.id = "confettiCanvas";
    canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;pointer-events:none;";
    document.body.appendChild(canvas); ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    for (let i = 0; i < 150; i++) pieces.push({ x: canvas.width/2+(Math.random()-.5)*200, y: canvas.height/2, vx: (Math.random()-.5)*15, vy: -(Math.random()*12+5), w: Math.random()*10+5, h: Math.random()*6+3, color: COLORS[Math.floor(Math.random()*COLORS.length)], rotation: Math.random()*360, rotSpeed: (Math.random()-.5)*10, gravity: .25, alpha: 1 });
    requestAnimationFrame(animate);
    setTimeout(() => { animating = false; if (canvas) canvas.remove(); }, 4000);
  }
  function animate() {
    if (!animating || !canvas) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (let i = pieces.length-1; i >= 0; i--) { const p = pieces[i]; p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.vx *= .99; p.rotation += p.rotSpeed; p.alpha -= .005; if (p.alpha <= 0) { pieces.splice(i,1); continue; } ctx.save(); ctx.translate(p.x,p.y); ctx.rotate((p.rotation*Math.PI)/180); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore(); }
    if (pieces.length > 0) requestAnimationFrame(animate); else { animating = false; if (canvas) canvas.remove(); }
  }
  return { init, launchConfetti };
})();


/* ═══════════════════════════════════════════════════════════
   § APPLICATION BOOTSTRAP
   ═══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  if (SITE_BLOCKED) return;

  console.info(`%c🏆 ${CONFIG.WEBSITE.name} v12.0 (Pro Layout ⚡) Initialized`, "color:#c9a84c;font-weight:bold;font-size:14px;");

const modules = [
  { name: "TimeWelcomeModule", ref: TimeWelcomeModule },
  { name: "ScrollProgressModule", ref: ScrollProgressModule },
  { name: "RevealOnScrollModule", ref: RevealOnScrollModule },
  { name: "TiltCardModule", ref: TiltCardModule },
  { name: "FormModule", ref: FormModule },
  { name: "SelectAllModule", ref: SelectAllModule },
  { name: "LoadingModule", ref: LoadingModule },
  { name: "ScrollModule", ref: ScrollModule },
  { name: "AssistantModule", ref: AssistantModule },
  { name: "CounterModule", ref: CounterModule },
  { name: "TestimonialModule", ref: TestimonialModule },
  { name: "FAQModule", ref: FAQModule },
  { name: "BrightnessModule", ref: BrightnessModule },
];

  const deferredModules = [
    { name: "FireworksModule", ref: FireworksModule },
    { name: "ConfettiModule", ref: ConfettiModule },
  ];

  // Init lightweight modules immediately
  modules.forEach(({ name, ref }) => {
    try { ref.init(); } catch (error) { console.error(`[Init] ${name} failed:`, error); }
  });

  // Defer heavy modules until user interaction or timeout
  let deferredDone = false;
  function initDeferred() {
    if (deferredDone) return;
    deferredDone = true;
    deferredModules.forEach(({ name, ref }) => {
      try { ref.init(); } catch (error) { console.error(`[Init-Deferred] ${name} failed:`, error); }
    });
  }
  document.addEventListener("click", initDeferred, { once: true, passive: true });
  document.addEventListener("keydown", initDeferred, { once: true, passive: true });
  setTimeout(initDeferred, 3000);
});