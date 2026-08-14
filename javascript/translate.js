/*==========================================================
            SMART TRANSLATOR - FINAL CLEAN VERSION
            ✅ قاموس مدمج + API محدود
            ✅ بدون حلقة لا نهائية
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

  const languageBtn = document.getElementById("languageBtn");
  const translateMenu = document.getElementById("translateMenu");
  const langButtons = document.querySelectorAll(".lang-btn");
  const originalTexts = new Map();
  const translatedCache = new Map(); // ✅ كاش لتجنب التكرار

  // ✅ قاموس مدمج كبير (بدون API)
  const DICTIONARY = {
    ar: {
      // العناوين الرئيسية
      "EliteSports Pro": "مركز EliteSports Pro",
      "Welcome To Our Professional EliteSports Pro": "مرحباً بكم في مركز EliteSports Pro الاحترافي",
      "Search": "بحث",
      "Activities": "الأنشطة",
      "Gallery": "المعرض",
      "Prices": "الأسعار",
      "Login": "تسجيل الدخول",
      "Mental Arithmetic": "الحساب الذهني",
      "Contact": "تواصل معنا",
      "Language": "اللغة",

      // الأقسام
      "Our Facilities": "مرافقنا",
      "We Have All Sports": "لدينا جميع الرياضات",
      "Activities & Fields": "الأنشطة والملاعب",
      "Affordable Prices": "أسعار مناسبة",
      "Registration Form": "نموذج التسجيل",
      "Our Achievements": "إنجازاتنا",
      "What Our Members Say": "ماذا يقول أعضاؤنا",
      "Contact Us": "تواصل معنا",
      "Frequently Asked Questions": "الأسئلة الشائعة",

      // الأزرار
      "Send": "إرسال",
      "delete": "حذف",
      "View": "عرض",
      "Enter The Web": "ادخل الموقع",
      "Send Email": "أرسل إيميلاً",

      // النموذج
      "Username": "اسم المستخدم",
      "Password": "كلمة المرور",
      "Phone Number": "رقم الهاتف",
      "Email": "البريد الإلكتروني",
      "Message": "الرسالة",
      "Choose The Sport You Prefer": "اختر الرياضة المفضلة",

      // الإحصائيات
      "Happy Members": "عضو سعيد",
      "Professional Coaches": "مدرب محترف",
      "Championships": "بطولة",
      "Customer Satisfaction %": "رضا العملاء %",
      "Numbers That Speak For Us": "أرقام تتحدث عنا",

      // الرياضات
      "Football": "كرة القدم",
      "Basketball": "كرة السلة",
      "Volleyball": "الكرة الطائرة",
      "Handball": "كرة اليد",
      "Water Polo": "كرة الماء",
      "Squash": "الإسكواش",
      "Tennis": "التنس",
      "Table Tennis": "تنس الطاولة",
      "Badminton": "الريشة الطائرة",
      "Swimming": "السباحة",
      "Athletics": "ألعاب القوى",
      "Running": "الجري",
      "Cycling": "ركوب الدراجات",
      "Boxing": "الملاكمة",
      "Wrestling": "المصارعة",
      "Judo": "الجودو",
      "Karate": "الكاراتيه",
      "Taekwondo": "التايكوندو",
      "Kickboxing": "الكيك بوكسينج",
      "Kung Fu": "الكونغ فو",
      "Sambo": "السامبو",
      "Fencing": "المبارزة",
      "Weightlifting": "رفع الأثقال",
      "Gymnastics": "الجمباز",
      "Shooting": "الرماية",
      "Archery": "الرماية بالقوس",
      "Equestrian": "الفروسية",
      "Rowing": "التجديف",
      "Sailing": "الشراع",
      "Diving": "الغطس",
      "Chess": "الشطرنج",
      "Billiards": "البلياردو",
      "Skateboarding": "التزلج على اللوح",
      "Rock Climbing": "تسلق الصخور",
      "Yoga": "اليوجا",
      "Fitness": "اللياقة البدنية",
      "CrossFit": "كروس فت",

      // جداول الأسعار
      "Sport": "الرياضة",
      "Old Price": "السعر القديم",
      "New Price": "السعر الجديد",
      "EGP": "جنيه"
    }
  };

  // =========================================
  // كشف اللغة تلقائياً
  // =========================================
  function detectLanguage(text) {
    if (!text) return 'unknown';
    if (/[\u0600-\u06FF]/.test(text)) return 'ar';
    if (/^[\d\s.,%$€£×÷=+?]+$/.test(text)) return 'numbers';
    if (/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}]+$/u.test(text)) return 'emoji';
    return 'en';
  }

  // =========================================
  // التحقق من النص
  // =========================================
  function shouldTranslate(text) {
    if (!text || text.trim().length < 2) return false;
    if (text.trim().length > 200) return false;

    const lang = detectLanguage(text);
    if (lang === 'ar' || lang === 'numbers' || lang === 'emoji' || lang === 'unknown') return false;

    // تجاهل النصوص اللي فيها أيقونات كتير
    const emojiCount = (text.match(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/gu) || []).length;
    if (emojiCount > text.length * 0.3) return false;

    return true;
  }

  // =========================================
  // حفظ النصوص الأصلية
  // =========================================
  function saveOriginalTexts() {
    // ✅ بس العناوين والفقرات المهمة (مش كل حاجة)
    const elements = document.querySelectorAll(
      'h1, h2, h3, .gallery-title, .gallery-subtitle, .intro-text, .intro-name, .tab-btn span, .no-results h3, .testimonial h3, .testimonial p, .faq-question, .faq-answer p, .free1, .free2, .free3, .free5, .free7, .free9'
    );

    elements.forEach((el, index) => {
      const text = el.textContent.trim();
      if (!shouldTranslate(text)) return;

      const id = `translate-${index}`;
      el.setAttribute('data-translate-id', id);
      originalTexts.set(id, text);
    });

  }

  // =========================================
  // البحث في القاموس
  // =========================================
  function searchInDictionary(text, targetLang) {
    const dict = DICTIONARY[targetLang];
    if (!dict) return null;

    // بحث مباشر
    if (dict[text]) return dict[text];

    // بحث بدون أيقونات
    const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}]/gu, '').trim();
    if (dict[cleanText]) return dict[cleanText];

    return null;
  }

  // =========================================
  // الترجمة عبر API (مع حد أقصى للمحاولات)
  // =========================================
  async function translateViaAPI(text, targetLang) {
    // ✅ لو مترجم قبل كده، ارجع من الكاش
    const cacheKey = `${text}|${targetLang}`;
    if (translatedCache.has(cacheKey)) {
      return translatedCache.get(cacheKey);
    }

    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
      const response = await fetch(url);

      // ✅ لو 429، ارجع النص الأصلي (مش نعمل retry لا نهائي)
      if (response.status === 429) {
        return text;
      }

      const data = await response.json();

      if (data.responseStatus === 200 && data.responseData) {
        const translated = data.responseData.translatedText;
        if (translated && translated !== text && !translated.includes("MYMEMORY")) {
          translatedCache.set(cacheKey, translated);
          return translated;
        }
      }

      return text;
    } catch (error) {
      console.error("خطأ:", error);
      return text;
    }
  }

  // =========================================
  // الترجمة الذكية
  // =========================================
  async function smartTranslate(text, targetLang) {
    // 1️⃣ القاموس أولاً
    const dictResult = searchInDictionary(text, targetLang);
    if (dictResult) return dictResult;

    // 2️⃣ API
    return translateViaAPI(text, targetLang);
  }

  // =========================================
  // ترجمة الصفحة
  // =========================================
  async function translatePage(targetLang) {
    if (targetLang === 'en') {
      resetToEnglish();
      return;
    }

    const statusMsg = showStatusMessage("⏳ جاري الترجمة...");
    const elements = document.querySelectorAll('[data-translate-id]');

    let translated = 0;
    let total = elements.length;

    for (const el of elements) {
      const id = el.getAttribute('data-translate-id');
      const originalText = originalTexts.get(id);

      if (originalText) {
        const translatedText = await smartTranslate(originalText, targetLang);
        el.textContent = translatedText;
        translated++;

        if (statusMsg) {
          statusMsg.textContent = `⏳ ${translated}/${total}`;
        }

        // ✅ تأخير بسيط بين كل ترجمة
        await new Promise(r => setTimeout(r, 200));
      }
    }

    if (statusMsg) {
      statusMsg.textContent = `✅ تمت الترجمة (${translated} عنصر)`;
      setTimeout(() => statusMsg.remove(), 2000);
    }

    localStorage.setItem('selectedLanguage', targetLang);
  }

  // =========================================
  // إعادة الإنجليزية
  // =========================================
  function resetToEnglish() {
    document.querySelectorAll('[data-translate-id]').forEach(el => {
      const id = el.getAttribute('data-translate-id');
      const originalText = originalTexts.get(id);
      if (originalText) el.textContent = originalText;
    });

    localStorage.removeItem('selectedLanguage');
    translatedCache.clear();

    const statusMsg = showStatusMessage("✅ تم الرجوع للإنجليزية");
    setTimeout(() => statusMsg.remove(), 2000);
  }

  // =========================================
  // رسالة الحالة
  // =========================================
  function showStatusMessage(message) {
    const existing = document.getElementById('translate-status');
    if (existing) existing.remove();

    const statusMsg = document.createElement('div');
    statusMsg.id = 'translate-status';
    statusMsg.textContent = message;
    statusMsg.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #00e5ff, #00ff99);
      color: #0f172a;
      padding: 15px 30px;
      border-radius: 50px;
      font-weight: bold;
      font-size: 16px;
      z-index: 99999;
      box-shadow: 0 5px 25px rgba(0, 229, 255, 0.5);
    `;

    document.body.appendChild(statusMsg);
    return statusMsg;
  }

  // =========================================
  // فتح/قفل القائمة
  // =========================================
  if (languageBtn && translateMenu) {
    languageBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      translateMenu.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!translateMenu.contains(e.target) && e.target !== languageBtn) {
        translateMenu.classList.remove("show");
      }
    });
  }

  // =========================================
  // ربط الأزرار
  // =========================================
  langButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const onclick = btn.getAttribute("onclick");
      if (onclick) {
        const match = onclick.match(/translatePage\(['"]([^'"]+)['"]\)/);
        if (match) translatePage(match[1]);
      }

      translateMenu.classList.remove("show");
    });
  });

  // =========================================
  // تشغيل
  // =========================================
  saveOriginalTexts();

  const savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang && savedLang !== 'en') {
    setTimeout(() => translatePage(savedLang), 500);
  }


});


/*==========================================================
   ⏱️ TIME GREETING + LIVE CLOCK
   + 🎆 SKY SHOW (نجوم + شهب + صواريخ)
   (مستقل تماماً عن المترجم)
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

  /* ----- مساعد بسيط للتخزين ----- */
  const getStored = (key, fallback) => {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  };
  const setStored = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  };

  /* ----- الوقت والترحيب ----- */
  function getTimePeriod() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
  }

  function getArabicTimeLive() {
    return new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }

  const GREETINGS = {
    morning:   { label: "صباح الخير", title: "صباح الفل والياسمين" },
    afternoon: { label: "طاب يومك",   title: "النهار لسه في عزه" },
    evening:   { label: "مساء الخير", title: "مساء النور والهدوء" },
    night:     { label: "طابت ليلتك", title: "ليلة هادئة وسعيدة" },
  };

  const TIME_ICONS = {
    morning:   `<svg viewBox="0 0 24 24"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
    afternoon: `<svg viewBox="0 0 24 24"><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 6a6 6 0 100 12 6 6 0 000-12z"/></svg>`,
    evening:   `<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`,
    night:     `<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/><circle cx="17" cy="5" r="1"/><circle cx="19" cy="9" r=".5"/><circle cx="15" cy="3" r=".5"/></svg>`,
  };

  /* ----- حقن CSS الخاص بالتوقيت والبار والنجوم ----- */
  (function injectTimeStyles() {
    if (document.getElementById("timeWelcomeStyles")) return;
    const st = document.createElement("style");
    st.id = "timeWelcomeStyles";
    st.textContent = `
      body::before {
        content:''; position:fixed; top:0; left:0; width:100%; height:100%;
        z-index:-2; transition:background 3s ease; pointer-events:none;
      }
      body.time-morning::before {
        background: radial-gradient(ellipse at 20% 0%, rgba(255,180,50,0.12) 0%, transparent 50%),
                    radial-gradient(ellipse at 80% 100%, rgba(255,120,80,0.08) 0%, transparent 50%);
      }
      body.time-afternoon::before {
        background: radial-gradient(ellipse at 50% 0%, rgba(79,172,254,0.1) 0%, transparent 50%),
                    radial-gradient(ellipse at 0% 100%, rgba(67,233,123,0.06) 0%, transparent 50%);
      }
      body.time-evening::before {
        background: radial-gradient(ellipse at 70% 0%, rgba(161,140,209,0.12) 0%, transparent 50%),
                    radial-gradient(ellipse at 20% 100%, rgba(251,194,235,0.08) 0%, transparent 50%);
      }
      body.time-night::before {
        background: radial-gradient(ellipse at 30% 0%, rgba(100,80,200,0.12) 0%, transparent 50%),
                    radial-gradient(ellipse at 80% 100%, rgba(45,27,105,0.1) 0%, transparent 50%);
      }
      .tw-float-bar {
        position:fixed; top:0; left:0; right:0; z-index:9999;
        display:flex; align-items:center; gap:14px; padding:12px 24px;
        background:rgba(10,10,20,0.4);
        backdrop-filter:blur(30px) saturate(1.5);
        -webkit-backdrop-filter:blur(30px) saturate(1.5);
        border-bottom:1px solid rgba(255,255,255,0.06);
        transform:translateY(-100%);
        transition:transform 0.8s cubic-bezier(0.16,1,0.3,1), background 0.5s ease;
        direction:rtl;
      }
      .tw-float-bar.visible { transform:translateY(0); }
      .tw-float-bar:hover { background:rgba(10,10,20,0.55); }
      .tw-fb-icon {
        width:36px; height:36px; border-radius:50%;
        background:rgba(255,255,255,0.08);
        border:1px solid rgba(255,255,255,0.1);
        display:flex; align-items:center; justify-content:center;
        flex-shrink:0; animation:twFbPulse 3s ease-in-out infinite;
      }
      .tw-fb-icon svg { width:18px; height:18px; fill:rgba(255,255,255,0.85); }
      @keyframes twFbPulse {
        0%,100% { box-shadow:0 0 0 0 rgba(255,255,255,0.1); }
        50% { box-shadow:0 0 12px 2px rgba(255,255,255,0.08); }
      }
      .tw-fb-text { display:flex; flex-direction:column; flex:1; min-width:0; }
      .tw-fb-label {
        font-size:10px; font-weight:600; color:rgba(255,255,255,0.45);
        letter-spacing:1.5px; text-transform:uppercase;
      }
      .tw-fb-title {
        font-size:14px; font-weight:700; color:rgba(255,255,255,0.9);
        white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
      }
      .tw-fb-time {
        font-size:13px; font-weight:600; color:rgba(255,255,255,0.7);
        font-variant-numeric:tabular-nums; padding:5px 12px;
        background:rgba(255,255,255,0.06); border-radius:20px;
        border:1px solid rgba(255,255,255,0.06);
        flex-shrink:0; min-width:75px; text-align:center; letter-spacing:0.5px;
      }
      @keyframes skyTwinkle {
        0%,100% { opacity:0.15; transform:scale(0.8); }
        50% { opacity:0.9; transform:scale(1.15); }
      }
      @media (max-width:600px) {
        .tw-float-bar { padding:10px 16px; gap:10px; }
        .tw-fb-icon { width:30px; height:30px; }
        .tw-fb-icon svg { width:15px; height:15px; }
        .tw-fb-title { font-size:12px; }
        .tw-fb-time { font-size:11px; padding:4px 10px; min-width:65px; }
      }
    `;
    document.head.appendChild(st);
  })();

  /* ----- البار العائم + الساعة الحية ----- */
  (function initTimeBar() {
    const period = getTimePeriod();
    const g = GREETINGS[period];
    document.body.classList.add("time-" + period);

    if (!document.getElementById("twFloatBar")) {
      const bar = document.createElement("div");
      bar.id = "twFloatBar";
      bar.className = "tw-float-bar";
      bar.innerHTML = `
        <div class="tw-fb-icon">${TIME_ICONS[period]}</div>
        <div class="tw-fb-text">
          <span class="tw-fb-label">${g.label}</span>
          <span class="tw-fb-title">${g.title}</span>
        </div>
        <div class="tw-fb-time" id="twLiveTime">${getArabicTimeLive()}</div>
      `;
      document.body.appendChild(bar);
      setTimeout(() => bar.classList.add("visible"), 2500);
    }

    const clockEl = document.getElementById("twLiveTime");
    if (clockEl) {
      setInterval(() => { clockEl.textContent = getArabicTimeLive(); }, 1000);
    }
  })();

  /* ----- العرض السماوي: نجوم + شهب + صواريخ ----- */
  (function initSkyShow() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let canvas, ctx;
    let rockets = [], particles = [], shootingStars = [];
    let audioCtx = null;
    let soundEnabled = getStored("fireworks_sound", true);
    let lastLaunch = 0, nextDelay = 4000;
    let lastShootingStar = 0, lastFinale = 0;
    const FINALE_INTERVAL = 45000;

    const COLORS = [
      "#f0d078","#c9a84c","#fda085","#a18cd1","#4facfe",
      "#fbc2eb","#ff6b6b","#48dbfb","#ff9ff3","#feca57",
      "#ff4757","#2ed573","#1e90ff","#ffa502","#7bed9f",
      "#eccc68","#ff6348","#70a1ff","#5352ed","#ff7979",
      "#ffd32a","#ff5e78","#c56cf0","#7dffb2","#82ccdd",
      "#f8c291","#e55039","#6a89cc","#b8e994","#f8a5c2",
    ];
    const MAX_PARTICLES = 900;

    /* نجوم بتلمع في الخلفية */
    function createStarField() {
      if (document.getElementById("skyStarField")) return;
      const field = document.createElement("div");
      field.id = "skyStarField";
      field.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;overflow:hidden;";
      const count = Math.min(70, Math.floor(window.innerWidth / 18));
      for (let i = 0; i < count; i++) {
        const s = document.createElement("span");
        const size = Math.random() * 2 + 1;
        s.style.cssText =
          "position:absolute;top:" + (Math.random() * 70) + "%;left:" + (Math.random() * 100) + "%;" +
          "width:" + size + "px;height:" + size + "px;border-radius:50%;background:#fff;" +
          "animation:skyTwinkle " + (2 + Math.random() * 3) + "s ease-in-out " + (Math.random() * 3) + "s infinite;";
        field.appendChild(s);
      }
      document.body.appendChild(field);
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function loop(now) {
      requestAnimationFrame(loop);

      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      maybeSpawnShootingStar(now);
      updateShootingStars();

      if (now - lastLaunch > nextDelay) {
        lastLaunch = now;
        nextDelay = 4000 + Math.random() * 2500;
        launchBurst(7);
      }

      if (now - lastFinale > FINALE_INTERVAL) {
        lastFinale = now;
        launchBurst(12);
      }

      updateRockets();
      updateParticles();
      ctx.globalAlpha = 1;
    }

    /* 🌠 شهاب عابر */
    function maybeSpawnShootingStar(now) {
      if (now - lastShootingStar < 10000 + Math.random() * 10000) return;
      lastShootingStar = now;
      shootingStars.push({
        x: Math.random() * canvas.width * 0.6,
        y: Math.random() * canvas.height * 0.35,
        vx: 5 + Math.random() * 4,
        vy: 2 + Math.random() * 2,
        life: 45 + Math.random() * 25,
        size: 1.2 + Math.random() * 0.8,
      });
    }

    function updateShootingStars() {
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx; s.y += s.vy; s.life--;
        if (s.life <= 0 || s.x > canvas.width + 50 || s.y > canvas.height + 50) { shootingStars.splice(i, 1); continue; }
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 10, s.y - s.vy * 10);
        grad.addColorStop(0, "rgba(255,255,255,0.9)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 10, s.y - s.vy * 10);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* 🚀 إطلاق صواريخ بالتتابع */
    function launchBurst(count) {
      for (let i = 0; i < count; i++) {
        setTimeout(launchRocket, i * 120);
      }
    }

    function launchRocket() {
      const x = canvas.width * (0.1 + Math.random() * 0.8);
      rockets.push({
        x, y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(5 + Math.random() * 3),
        life: 60 + Math.random() * 30,
      });
      playWhistle();
    }

    function updateRockets() {
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx; r.y += r.vy; r.vy += 0.02; r.life--;

        const grad = ctx.createLinearGradient(r.x, r.y, r.x - r.vx * 6, r.y - r.vy * 6);
        grad.addColorStop(0, "rgba(255,225,160,0.85)");
        grad.addColorStop(1, "rgba(255,225,160,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - r.vx * 6, r.y - r.vy * 6);
        ctx.stroke();

        ctx.fillStyle = "rgba(255,245,210,0.95)";
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
        ctx.fill();

        if (r.life <= 0 || r.vy > -0.5) { explode(r.x, r.y); rockets.splice(i, 1); }
      }
    }

    /* 🎆 5 أشكال انفجار */
    function explode(x, y) {
      if (particles.length > MAX_PARTICLES) return;
      const types = ["peony", "ring", "willow", "crackle", "chrysanthemum"];
      const type = types[Math.floor(Math.random() * types.length)];
      const c1 = COLORS[Math.floor(Math.random() * COLORS.length)];
      const c2 = COLORS[Math.floor(Math.random() * COLORS.length)];

      switch (type) {
        case "peony": burstPeony(x, y, c1); break;
        case "ring": burstRing(x, y, c1); break;
        case "willow": burstWillow(x, y); break;
        case "crackle": burstCrackle(x, y, c1); break;
        case "chrysanthemum": burstChrysanthemum(x, y, c1, c2); break;
      }
      playBoom(type);
    }

    function makeParticle(x, y, angle, speed, color, opts = {}) {
      return {
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 0.95,
        size: opts.size || 1.4,
        color,
        decay: opts.decay || 0.008,
        gravity: opts.gravity || 0.035,
        crackle: opts.crackle || false,
        crackled: false,
      };
    }

    function burstPeony(x, y, c) {
      const n = 45 + Math.floor(Math.random() * 20);
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 / n) * i + Math.random() * 0.2;
        particles.push(makeParticle(x, y, a, 1.5 + Math.random() * 2.5, c));
      }
    }

    function burstRing(x, y, c) {
      const n = 55;
      const sp = 2.8 + Math.random() * 0.8;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 / n) * i;
        particles.push(makeParticle(x, y, a, sp + Math.random() * 0.3, c, { size: 1.2, decay: 0.01 }));
      }
    }

    function burstWillow(x, y) {
      const n = 40;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 / n) * i + Math.random() * 0.3;
        particles.push(makeParticle(x, y, a, 1 + Math.random() * 1.8, "#f0d078", { size: 1.3, decay: 0.004, gravity: 0.06 }));
      }
    }

    function burstCrackle(x, y, c) {
      const n = 32;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 / n) * i + Math.random() * 0.3;
        particles.push(makeParticle(x, y, a, 1.5 + Math.random() * 2, c, { crackle: true, decay: 0.007 }));
      }
    }

    function burstChrysanthemum(x, y, c1, c2) {
      const n = 55;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 / n) * i + Math.random() * 0.15;
        const sp = 1.5 + Math.random() * 2.6;
        particles.push(makeParticle(x, y, a, sp, sp > 2.8 ? c1 : c2, { size: 1.5, decay: 0.007 }));
      }
    }

    function spawnMicroSparks(x, y) {
      if (particles.length > MAX_PARTICLES) return;
      for (let i = 0; i < 3; i++) {
        const a = Math.random() * Math.PI * 2;
        particles.push(makeParticle(x, y, a, 0.5 + Math.random(), "#fff8dc", { size: 0.8, decay: 0.03, gravity: 0.02 }));
      }
    }

    function updateParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985; p.vy *= 0.985;
        p.alpha -= p.decay;

        if (p.crackle && !p.crackled && p.alpha < 0.35) {
          p.crackled = true;
          spawnMicroSparks(p.x, p.y);
        }

        if (p.alpha <= 0) { particles.splice(i, 1); continue; }
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* 🔊 صافرة إطلاق */
    function playWhistle() {
      if (!soundEnabled || !audioCtx || audioCtx.state !== "running") return;
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(900, t + 0.6);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.018, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(t); osc.stop(t + 0.65);
    }

    /* 💥 صوت انفجار متنوع */
    function playBoom(type) {
      if (!soundEnabled || !audioCtx || audioCtx.state !== "running") return;
      const t = audioCtx.currentTime;
      const dur = type === "willow" ? 1.4 : 1.1;

      const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * dur, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.6);
      }

      const src = audioCtx.createBufferSource();
      src.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(type === "crackle" ? 1400 : 800, t);
      filter.frequency.exponentialRampToValueAtTime(60, t + dur);

      const gain = audioCtx.createGain();
      const vol = 0.04 + Math.random() * 0.05;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      src.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
      src.start(t);
    }

    /* 🔊 زرار الصوت */
    function addToggleButton() {
      const btn = document.createElement("button");
      btn.id = "fwSoundToggle";
      btn.textContent = soundEnabled ? "🔊" : "🔇";
      btn.setAttribute("aria-label", soundEnabled ? "كتم صوت الألعاب النارية" : "تشغيل صوت الألعاب النارية");
      btn.style.cssText =
        "position:fixed;bottom:20px;left:20px;z-index:9998;width:44px;height:44px;" +
        "border-radius:50%;border:1px solid rgba(255,255,255,0.15);background:rgba(10,10,20,0.5);" +
        "backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font-size:18px;cursor:pointer;" +
        "display:flex;align-items:center;justify-content:center;transition:all .3s;";
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        soundEnabled = !soundEnabled;
        setStored("fireworks_sound", soundEnabled);
        btn.textContent = soundEnabled ? "🔊" : "🔇";
        btn.setAttribute("aria-label", soundEnabled ? "كتم صوت الألعاب النارية" : "تشغيل صوت الألعاب النارية");
        if (soundEnabled && audioCtx && audioCtx.state === "suspended") audioCtx.resume();
      });
      document.body.appendChild(btn);
    }

    /* ----- التشغيل ----- */
    createStarField();
    canvas = document.createElement("canvas");
    canvas.id = "fwCanvas";
    canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize);

    const unlock = () => {
      if (!audioCtx) {
        try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
      }
      if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };
    document.addEventListener("click", unlock);
    document.addEventListener("keydown", unlock);

    addToggleButton();
    lastLaunch = performance.now();
    lastFinale = performance.now();
    lastShootingStar = performance.now();
    requestAnimationFrame(loop);
  })();

}); // ✅ قفل DOMContentLoaded الخاص بالساعة والعرض السماوي