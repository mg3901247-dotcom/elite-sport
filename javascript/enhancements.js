/**
 * @fileoverview EliteSports Pro - Enhancements Module
 * @version 2.2.0 (Final - All Button Positions)
 * @description Theme Toggle + Sports Filter + Coaches Page
 * @author EliteSports Team
 * @lastModified 2026-08-12
 */

"use strict";


/* ═══════════════════════════════════════════════════════════
   § MODULE: Theme Toggle 🌙☀️ (Dark / Light Mode)
   ═══════════════════════════════════════════════════════════ */
const ThemeToggleModule = (() => {
  const STORAGE_KEY = "esp_theme_mode";

  function init() {
    const savedTheme = localStorage.getItem(STORAGE_KEY) || "light";
    applyTheme(savedTheme);

    if (document.getElementById("esp-theme-switch")) return;

    if (!document.getElementById("espThemeStyles")) {
      const st = document.createElement("style");
      st.id = "espThemeStyles";
      st.textContent = `
        #esp-theme-switch {
          position: fixed;
          top: 20%;
          left: 2px;
          transform: translateY(-50%);
          z-index: 9999;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px solid rgba(5, 224, 224, 0.3);
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          font-size: 22px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 0 15px rgba(5, 224, 224, 0.2);
        }
        #esp-theme-switch:hover {
          transform: translateY(-50%) scale(1.15) rotate(20deg);
          box-shadow: 0 0 25px rgba(5, 224, 224, 0.4);
          border-color: var(--primary, #05e0e0);
        }
        #esp-theme-switch:active {
          transform: translateY(-50%) scale(0.95);
        }

        [data-theme="light"] body::after {
          content: '';
          position: fixed;
          inset: 0;
          background: rgba(255, 255, 255, 0.75);
          z-index: -1;
          pointer-events: none;
        }
        [data-theme="light"] header,
        [data-theme="light"] main,
        [data-theme="light"] section,
        [data-theme="light"] form,
        [data-theme="light"] footer {
          background: rgba(255, 255, 255, 0.85) !important;
        }
        [data-theme="light"] h1,
        [data-theme="light"] h2,
        [data-theme="light"] h3,
        [data-theme="light"] p,
        [data-theme="light"] span,
        [data-theme="light"] label,
        [data-theme="light"] li,
        [data-theme="light"] td,
        [data-theme="light"] th,
        [data-theme="light"] blockquote {
          color: #1a1a2e !important;
          text-shadow: none !important;
        }
        [data-theme="light"] nav a { color: #b8973b; }
        [data-theme="light"] .activities-table,
        [data-theme="light"] .prices-table {
          background: rgba(255, 255, 255, 0.9);
        }
        [data-theme="light"] .activities-table td,
        [data-theme="light"] .prices-table td {
          color: #333;
          border-bottom-color: rgba(0, 0, 0, 0.08);
        }
        [data-theme="light"] .offer-card {
          background: rgba(255, 255, 255, 0.85);
        }
        [data-theme="light"] .offer-title,
        [data-theme="light"] .offer-detail,
        [data-theme="light"] .offer-contact-label {
          color: #333;
        }
        [data-theme="light"] #assistant-panel {
          background: #f0f0f4;
        }
        [data-theme="light"] #chat-messages {
          background: #e8e8ee;
        }
        [data-theme="light"] .faq-item {
          background: #f5f5f7;
        }
        [data-theme="light"] .faq-question {
          background: #e8e8ee;
          color: #6f388f;
        }
        [data-theme="light"] .faq-answer {
          background: #f0f0f4;
        }
        [data-theme="light"] .faq-answer p {
          color: #333;
        }
        [data-theme="light"] .testimonial {
          background: rgba(255, 255, 255, 0.9);
        }
        [data-theme="light"] .testimonial h3 { color: #1a1a2e; }
        [data-theme="light"] .testimonial p { color: #555; }
        [data-theme="light"] .counter-section h2 { color: #1a1a2e; }
        [data-theme="light"] .counter-box span { color: #333; }
        [data-theme="light"] .counter { color: #0891b2; }
        [data-theme="light"] footer p { color: #e1096e; }
        [data-theme="light"] .dev-badge {
          background: coral;
          color: #000;
        }

        @media (max-width: 600px) {
          #esp-theme-switch {
            width: 42px;
            height: 42px;
            font-size: 18px;
            top: 20%;
            left: 2px;
          }
        }
      `;
      document.head.appendChild(st);
    }

    const btn = document.createElement("button");
    btn.id = "esp-theme-switch";
    btn.setAttribute("aria-label", "تبديل الوضع الليلي/النهاري");
    btn.innerHTML = savedTheme === "dark" ? "☀️" : "🌙";
    document.body.appendChild(btn);

    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const newTheme = current === "dark" ? "light" : "dark";
      applyTheme(newTheme);
      btn.innerHTML = newTheme === "dark" ? "☀️" : "🌙";
      localStorage.setItem(STORAGE_KEY, newTheme);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   § MODULE: Sports Filter 🏅
   ═══════════════════════════════════════════════════════════ */
const SportsFilterModule = (() => {

  const CATEGORIES = [
    { id: "all", label: "🏅 الكل" },
    { id: "team", label: "👥 جماعية" },
    { id: "individual", label: "🏃 فردية" },
    { id: "combat", label: "🥊 قتالية" },
    { id: "fitness", label: "💪 لياقة" },
    { id: "water", label: "🏊 مائية" },
  ];

  const SPORT_CATEGORIES = {
    "football": "team",
    "basketball": "team",
    "volleyball": "team",
    "handball": "team",
    "water polo": "water",
    "squash": "individual",
    "tennis": "individual",
    "table tennis": "individual",
    "badminton": "individual",
    "swimming": "water",
    "athletics": "individual",
    "running": "individual",
    "cycling": "individual",
    "boxing": "combat",
    "wrestling": "combat",
    "judo": "combat",
    "karate": "combat",
    "taekwondo": "combat",
    "kickboxing": "combat",
    "kung fu": "combat",
    "sambo": "combat",
    "fencing": "combat",
    "weightlifting": "fitness",
    "gymnastics": "individual",
    "shooting": "individual",
    "archery": "individual",
    "equestrian": "individual",
    "rowing": "water",
    "canoe/kayak": "water",
    "sailing": "water",
    "diving": "water",
    "water skiing": "water",
    "chess": "individual",
    "billiards": "individual",
    "modern pentathlon": "individual",
    "triathlon": "individual",
    "skateboarding": "individual",
    "rock climbing": "individual",
    "yoga": "fitness",
    "fitness": "fitness",
    "crossfit": "fitness",
  };

  function init() {
    const tables = document.querySelectorAll(".activities-table");
    if (!tables.length) return;

    if (!document.getElementById("espFilterStyles")) {
      const st = document.createElement("style");
      st.id = "espFilterStyles";
      st.textContent = `
        .esp-filter-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin: 30px auto;
          padding: 6px;
          max-width: 750px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 50px;
          border: 1px solid rgba(5, 224, 224, 0.15);
        }
        .esp-filter-chip {
          padding: 10px 22px;
          border-radius: 50px;
          border: none;
          background: transparent;
          color: var(--text, #fff8dc);
          font-size: 13px;
          font-weight: 600;
          font-family: "Noto Sans", sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .esp-filter-chip:hover {
          color: var(--secondary, #ffd500);
          transform: translateY(-1px);
        }
        .esp-filter-chip.esp-active {
          background: linear-gradient(135deg, var(--primary, #05e0e0), var(--secondary, #ffd500));
          color: #111;
          box-shadow: 0 4px 15px rgba(5, 224, 224, 0.3);
          transform: translateY(-1px);
        }
        .esp-table-row {
          transition: opacity 0.35s ease, transform 0.35s ease, background 0.2s ease;
        }
        .esp-table-row:hover {
          background: rgba(5, 224, 224, 0.08) !important;
        }
        .esp-table-row.esp-hidden {
          opacity: 0;
          transform: translateX(-10px);
        }
        .esp-table-row.esp-visible {
          opacity: 1;
          transform: translateX(0);
        }
        @media (max-width: 600px) {
          .esp-filter-chip {
            padding: 8px 14px;
            font-size: 11px;
          }
          .esp-filter-bar {
            gap: 6px;
            padding: 4px;
          }
        }
      `;
      document.head.appendChild(st);
    }

    const filterContainer = document.createElement("div");
    filterContainer.className = "esp-filter-bar";

    CATEGORIES.forEach((cat, idx) => {
      const tab = document.createElement("button");
      tab.className = "esp-filter-chip" + (idx === 0 ? " esp-active" : "");
      tab.textContent = cat.label;
      tab.dataset.filter = cat.id;
      tab.addEventListener("click", () => {
        filterContainer.querySelectorAll(".esp-filter-chip").forEach(t => t.classList.remove("esp-active"));
        tab.classList.add("esp-active");
        filterSports(cat.id);
      });
      filterContainer.appendChild(tab);
    });

    tables[0].parentNode.insertBefore(filterContainer, tables[0]);
    assignCategories(tables);
  }

  function assignCategories(tables) {
    tables.forEach(table => {
      const rows = table.querySelectorAll("tbody tr");
      rows.forEach(row => {
        const firstTd = row.querySelector("td");
        if (!firstTd) return;
        const text = firstTd.textContent.trim();
        const sportName = text.replace(/[^\w\s\/]/g, "").trim().toLowerCase();
        const category = SPORT_CATEGORIES[sportName] || "individual";
        row.dataset.category = category;
        row.classList.add("esp-table-row");
      });
    });
  }

  function filterSports(category) {
    const rows = document.querySelectorAll(".esp-table-row");
    rows.forEach(row => {
      const rowCat = row.dataset.category;
      const show = category === "all" || rowCat === category;
      row.style.display = show ? "" : "none";
      row.style.transition = "opacity 0.3s ease";
      row.style.opacity = show ? "1" : "0";
    });
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════
   § MODULE: Coaches Page 👨‍🏫
   ═══════════════════════════════════════════════════════════ */
const CoachesModule = (() => {

  const COACHES = [
    {
      id: 1,
      name: "كابتن أحمد محمود",
      specialty: "كرة القدم",
      experience: "12 سنة خبرة",
      rating: 4.8,
      sports: ["كرة القدم", "ألعاب القوى"],
      image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      name: "كابتن سارة عبدالله",
      specialty: "السباحة",
      experience: "8 سنوات خبرة",
      rating: 4.9,
      sports: ["السباحة", "الغوص"],
      image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      name: "كابتن محمد علي",
      specialty: "الملاكمة",
      experience: "15 سنة خبرة",
      rating: 4.7,
      sports: ["الملاكمة", "الكيك بوكسينج"],
      image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      name: "كابتن ليلى حسن",
      specialty: "اليوجا واللياقة",
      experience: "6 سنوات خبرة",
      rating: 4.9,
      sports: ["اليوجا", "البيلاتس", "اللياقة البدنية"],
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      name: "كابتن خالد إبراهيم",
      specialty: "كرة السلة",
      experience: "10 سنوات خبرة",
      rating: 4.6,
      sports: ["كرة السلة", "كرة اليد"],
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      name: "كابتن نور الدين",
      specialty: "الكاراتيه",
      experience: "20 سنة خبرة",
      rating: 5.0,
      sports: ["الكاراتيه", "الجودو"],
      image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&h=300&fit=crop",
    },
  ];

  let currentFilter = "all";

  function init() {
    if (!document.getElementById("espCoachStyles")) {
      const st = document.createElement("style");
      st.id = "espCoachStyles";
      st.textContent = `
        .esp-coaches-section {
          padding: 80px 20px;
          background: rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        }
        .esp-coaches-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(5, 224, 224, 0.05) 0%, transparent 70%);
          pointer-events: none;
        }
        .esp-coaches-section h2 {
          text-align: center;
          font-size: 34px;
          margin-bottom: 12px;
          color: var(--purple, #8377e0);
        }
        .esp-coach-subtitle {
          text-align: center;
          color: #cbd5e1;
          margin-bottom: 40px;
          font-size: 15px;
        }
        .esp-coach-filter-bar {
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 35px;
        }
        .esp-coaches-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .esp-coach-card {
          border-radius: 25px 0 25px 0;
          overflow: hidden;
          padding: 0;
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          position: relative;
        }
        .esp-coach-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(135deg, var(--primary, #05e0e0), var(--secondary, #ffd500));
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2;
        }
        .esp-coach-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(5, 224, 224, 0.2);
          border-color: var(--primary, #05e0e0);
        }
        .esp-coach-card:hover::before {
          opacity: 1;
        }
        .esp-coach-photo {
          width: 100%;
          height: 210px;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
          margin: 0;
          max-width: none;
          border-radius: 0;
          box-shadow: none;
        }
        .esp-coach-card:hover .esp-coach-photo {
          transform: scale(1.05);
        }
        .esp-coach-info {
          padding: 22px;
        }
        .esp-coach-name {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }
        .esp-coach-role {
          font-size: 13px;
          color: var(--secondary, #ffd500);
          font-weight: 600;
          margin-bottom: 8px;
        }
        .esp-coach-exp {
          font-size: 12px;
          color: #8888a0;
          margin-bottom: 14px;
        }
        .esp-coach-stars {
          display: flex;
          align-items: center;
          gap: 3px;
          margin-bottom: 14px;
        }
        .esp-coach-stars .star {
          color: var(--secondary, #ffd500);
          font-size: 15px;
          text-shadow: 0 0 8px rgba(255, 213, 0, 0.3);
        }
        .esp-coach-stars .star.esp-empty {
          color: rgba(255, 255, 255, 0.15);
          text-shadow: none;
        }
        .esp-coach-stars .esp-rating-num {
          font-size: 13px;
          color: #8888a0;
          margin-right: 8px;
          font-weight: 600;
        }
        .esp-coach-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 18px;
        }
        .esp-coach-tag {
          padding: 5px 14px;
          border-radius: 50px;
          background: rgba(5, 224, 224, 0.1);
          color: var(--primary, #05e0e0);
          font-size: 11px;
          font-weight: 600;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }
        .esp-coach-tag:hover {
          background: rgba(5, 224, 224, 0.2);
          border-color: var(--primary, #05e0e0);
        }
        .esp-coach-book {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 25px 0 25px 0;
          background: linear-gradient(135deg, var(--primary, #05e0e0), var(--secondary, #ffd500));
          background-size: 200% auto;
          color: #111;
          font-size: 14px;
          font-weight: 700;
          font-family: "Noto Sans", sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .esp-coach-book:hover {
          background-position: left center;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(5, 224, 224, 0.3);
        }
        .esp-coach-book:active {
          transform: translateY(0) scale(0.98);
        }
        .esp-booking-overlay {
          position: fixed;
          inset: 0;
          z-index: 99990;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: espBmFadeIn 0.3s ease;
        }
        @keyframes espBmFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .esp-booking-dialog {
          background: var(--dark, #111827);
          border: 1px solid rgba(5, 224, 224, 0.2);
          border-radius: 25px 0 25px 0;
          padding: 32px;
          max-width: 460px;
          width: 100%;
          direction: rtl;
          text-align: center;
          color: var(--text, #fff8dc);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
          animation: espBmSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          max-height: 85vh;
          overflow-y: auto;
          position: relative;
        }
        @keyframes espBmSlideUp {
          from { opacity: 0; transform: translateY(50px) scale(0.93); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .esp-booking-dialog h3 {
          color: var(--secondary, #ffd500);
          font-size: 20px;
          margin-bottom: 18px;
        }
        .esp-booking-coach {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 22px;
          padding: 14px;
          background: rgba(5, 224, 224, 0.08);
          border-radius: var(--radius, 15px);
          border: 1px solid rgba(5, 224, 224, 0.15);
        }
        .esp-booking-coach img {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary, #05e0e0);
          margin: 0;
          max-width: none;
          box-shadow: none;
        }
        .esp-booking-coach .esp-bc-info {
          text-align: right;
        }
        .esp-booking-coach .esp-bc-info h4 {
          font-size: 15px;
          color: #fff;
          margin-bottom: 2px;
        }
        .esp-booking-coach .esp-bc-info p {
          font-size: 12px;
          color: #8888a0;
        }
        .esp-booking-dialog input,
        .esp-booking-dialog select {
          width: 100%;
          padding: 13px 16px;
          margin: 7px 0;
          border-radius: 25px 0 25px 0;
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-size: 15px;
          font-family: "Noto Sans", sans-serif;
          outline: none;
          transition: all 0.2s ease;
          direction: rtl;
        }
        .esp-booking-dialog input:focus,
        .esp-booking-dialog select:focus {
          border-color: var(--primary, #05e0e0);
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 0 3px rgba(5, 224, 224, 0.15);
        }
        .esp-booking-dialog input::placeholder {
          color: #8888a0;
        }
        .esp-booking-dialog select option {
          background: var(--dark, #111827);
          color: #fff;
        }
        .esp-booking-confirm {
          width: 100%;
          padding: 14px;
          margin-top: 14px;
          border: none;
          border-radius: 25px 0 25px 0;
          background: linear-gradient(135deg, var(--primary, #05e0e0), var(--secondary, #ffd500));
          background-size: 200% auto;
          color: #111;
          font-size: 15px;
          font-weight: 700;
          font-family: "Noto Sans", sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .esp-booking-confirm:hover {
          background-position: left center;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(5, 224, 224, 0.3);
        }
        .esp-booking-confirm:active {
          transform: translateY(0) scale(0.98);
        }
        .esp-booking-close {
          position: absolute;
          top: 16px;
          left: 16px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .esp-booking-close:hover {
          background: #ef4444;
          border-color: #ef4444;
          transform: rotate(90deg);
        }
        .esp-booking-success {
          padding: 24px;
          text-align: center;
          animation: espBmSlideUp 0.4s ease;
        }
        .esp-booking-success .esp-bs-icon {
          font-size: 56px;
          margin-bottom: 14px;
          animation: espBsBounce 0.6s ease;
        }
        @keyframes espBsBounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .esp-booking-success h4 {
          color: #2ed573;
          font-size: 20px;
          margin-bottom: 8px;
        }
        .esp-booking-success p {
          color: #8888a0;
          font-size: 13px;
          line-height: 1.8;
        }
        @media (max-width: 768px) {
          .esp-coaches-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 16px;
          }
          .esp-coaches-section h2 {
            font-size: 26px;
          }
        }
        @media (max-width: 600px) {
          .esp-coaches-grid {
            grid-template-columns: 1fr;
          }
          .esp-coaches-section {
            padding: 50px 15px;
          }
          .esp-coaches-section h2 {
            font-size: 22px;
          }
          .esp-booking-dialog {
            padding: 22px;
            margin: 10px;
          }
        }
      `;
      document.head.appendChild(st);
    }

    let section = document.getElementById("espCoachesSection");
    if (!section) {
      section = document.createElement("section");
      section.id = "espCoachesSection";
      section.className = "esp-coaches-section";
      const contactSection = document.getElementById("contact") || document.querySelector("footer");
      if (contactSection) {
        contactSection.parentNode.insertBefore(section, contactSection);
      } else {
        document.body.appendChild(section);
      }
    }

    renderSection(section);
  }

  function renderSection(section) {
    section.innerHTML = `
      <h2>👨‍🏫 فريق المدربين</h2>
      <p class="esp-coach-subtitle">نخبة من أفضل المدربين المعتمدين دولياً</p>
      <div class="esp-coach-filter-bar" id="espCoachFilterBar"></div>
      <div class="esp-coaches-grid" id="espCoachesGrid"></div>
    `;
    renderFilters(section.querySelector("#espCoachFilterBar"));
    renderCoaches(section.querySelector("#espCoachesGrid"), "all");
  }

  function renderFilters(container) {
    const allSports = [...new Set(COACHES.flatMap(c => c.sports))];
    const allBtn = createFilterBtn("all", "🏅 الكل", true);
    container.appendChild(allBtn);
    allSports.forEach(sport => {
      const btn = createFilterBtn(sport, sport, false);
      container.appendChild(btn);
    });
    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".esp-filter-chip");
      if (!btn) return;
      container.querySelectorAll(".esp-filter-chip").forEach(b => b.classList.remove("esp-active"));
      btn.classList.add("esp-active");
      currentFilter = btn.dataset.filter;
      const grid = document.getElementById("espCoachesGrid");
      renderCoaches(grid, currentFilter);
    });
  }

  function createFilterBtn(filter, label, isActive) {
    const btn = document.createElement("button");
    btn.className = "esp-filter-chip" + (isActive ? " esp-active" : "");
    btn.textContent = label;
    btn.dataset.filter = filter;
    return btn;
  }

  function renderCoaches(grid, filter) {
    const filtered = filter === "all"
      ? COACHES
      : COACHES.filter(c => c.sports.includes(filter));

    grid.innerHTML = filtered.map(coach => `
      <div class="esp-coach-card" data-coach-id="${coach.id}">
        <img class="esp-coach-photo" src="${coach.image}" alt="${coach.name}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=300&fit=crop'">
        <div class="esp-coach-info">
          <h3 class="esp-coach-name">${coach.name}</h3>
          <p class="esp-coach-role">🏆 ${coach.specialty}</p>
          <p class="esp-coach-exp">📅 ${coach.experience}</p>
          <div class="esp-coach-stars">${renderStars(coach.rating)}<span class="esp-rating-num">${coach.rating}</span></div>
          <div class="esp-coach-tags">
            ${coach.sports.map(s => `<span class="esp-coach-tag">${s}</span>`).join("")}
          </div>
          <button class="esp-coach-book" onclick="CoachesModule.openBooking(${coach.id})">📅 احجز موعد</button>
        </div>
      </div>
    `).join("");
  }

  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    let html = "";
    for (let i = 0; i < full; i++) html += '<span class="star">★</span>';
    if (half) html += '<span class="star">★</span>';
    for (let i = 0; i < empty; i++) html += '<span class="star esp-empty">★</span>';
    return html;
  }

  function openBooking(coachId) {
    const coach = COACHES.find(c => c.id === coachId);
    if (!coach) return;

    document.body.style.overflow = "hidden";

    const overlay = document.createElement("div");
    overlay.className = "esp-booking-overlay";
    overlay.innerHTML = `
      <div class="esp-booking-dialog">
        <button class="esp-booking-close" aria-label="إغلاق">✕</button>
        <h3>📅 حجز موعد مع ${coach.name}</h3>
        <div class="esp-booking-coach">
          <img src="${coach.image}" alt="${coach.name}"
               onerror="this.src='https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=300&fit=crop'">
          <div class="esp-bc-info">
            <h4>${coach.name}</h4>
            <p>${coach.specialty} • ${coach.experience}</p>
          </div>
        </div>
        <input type="text" id="espBookName" placeholder="اسمك الكامل" required>
        <input type="tel" id="espBookPhone" placeholder="رقم الهاتف" required>
        <select id="espBookSport">
          <option value="">اختر الرياضة</option>
          ${coach.sports.map(s => `<option value="${s}">${s}</option>`).join("")}
        </select>
        <input type="date" id="espBookDate" required>
        <select id="espBookTime">
          <option value="">اختر الوقت</option>
          <option value="09:00">9:00 صباحاً</option>
          <option value="10:00">10:00 صباحاً</option>
          <option value="11:00">11:00 صباحاً</option>
          <option value="12:00">12:00 ظهراً</option>
          <option value="16:00">4:00 عصراً</option>
          <option value="17:00">5:00 مساءً</option>
          <option value="18:00">6:00 مساءً</option>
          <option value="19:00">7:00 مساءً</option>
          <option value="20:00">8:00 مساءً</option>
        </select>
        <button class="esp-booking-confirm" id="espBookSubmitBtn">✅ تأكيد الحجز</button>
      </div>
    `;

    document.body.appendChild(overlay);

    const closeModal = () => {
      overlay.remove();
      document.body.style.overflow = "";
    };

    overlay.querySelector(".esp-booking-close").addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });

    overlay.querySelector("#espBookSubmitBtn").addEventListener("click", () => {
      const name = overlay.querySelector("#espBookName").value.trim();
      const phone = overlay.querySelector("#espBookPhone").value.trim();
      const sport = overlay.querySelector("#espBookSport").value;
      const date = overlay.querySelector("#espBookDate").value;
      const time = overlay.querySelector("#espBookTime").value;

      if (!name || !phone || !sport || !date || !time) {
        showToast("⚠️ يرجى ملء جميع الحقول", "warning");
        return;
      }

      const bookings = JSON.parse(localStorage.getItem("esp_bookings") || "[]");
      bookings.push({
        id: Date.now(),
        coachId: coach.id,
        coachName: coach.name,
        name, phone, sport, date, time,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("esp_bookings", JSON.stringify(bookings));

      overlay.querySelector(".esp-booking-dialog").innerHTML = `
        <div class="esp-booking-success">
          <div class="esp-bs-icon">🎉</div>
          <h4>تم الحجز بنجاح!</h4>
          <p>هيتواصل معاك ${coach.name} في أقرب وقت</p>
          <p style="margin-top:12px;font-size:12px;color:#8888a0;">
            📅 ${date} • ⏰ ${time} • 🏆 ${sport}
          </p>
          <button class="esp-booking-confirm" onclick="this.closest('.esp-booking-overlay').remove(); document.body.style.overflow='';" style="margin-top:20px;">تمام 👍</button>
        </div>
      `;

      if (typeof ConfettiModule !== "undefined") ConfettiModule.launchConfetti();
    });
  }

  return { init, openBooking };
})();


/* ═══════════════════════════════════════════════════════════
   § BOOTSTRAP - تشغيل الموديولات + تغيير أماكن الأزرار
   ═══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  const enhancementModules = [
    { name: "ThemeToggleModule", ref: ThemeToggleModule },
    { name: "SportsFilterModule", ref: SportsFilterModule },
    { name: "CoachesModule", ref: CoachesModule },
  ];

  enhancementModules.forEach(({ name, ref }) => {
    try { ref.init(); }
    catch (error) { console.error(`[Enhancement] ${name} failed:`, error); }
  });

 /* ═══ تغيير أماكن الأزرار العائمة ═══ */
  setTimeout(() => {

    /* 🏷️ الاسم (dev-badge) - يمين تحت */
    const devBadge = document.querySelector(".dev-badge");
    if (devBadge) {
      devBadge.style.position = "fixed";
      devBadge.style.top = "auto";
      devBadge.style.bottom = "1%";
      devBadge.style.right = "2px";
      devBadge.style.left = "auto";
      devBadge.style.transform = "none";
      devBadge.style.background = "coral";
    }

    /* 🤖 المساعد - شمال 90% */
    const assistantToggle = document.querySelector(".assistant-toggle");
    if (assistantToggle) {
      assistantToggle.style.top = "90%";
      assistantToggle.style.bottom = "auto";
      assistantToggle.style.left = "2px";
      assistantToggle.style.right = "auto";
      assistantToggle.style.transform = "translateY(-50%)";
    }

    /* ⚙️ الإعدادات - شمال 40% */
    const apTrigger = document.getElementById("apTrigger");
    if (apTrigger) {
      apTrigger.style.top = "40%";
      apTrigger.style.bottom = "auto";
      apTrigger.style.left = "2px";
      apTrigger.style.right = "auto";
      apTrigger.style.transform = "translateY(-50%)";
    }

    /* 🌙 النايت مود - شمال 20% */
    const espTheme = document.getElementById("esp-theme-switch");
    if (espTheme) {
      espTheme.style.top = "20%";
      espTheme.style.bottom = "auto";
      espTheme.style.left = "2px";
      espTheme.style.right = "auto";
      espTheme.style.transform = "translateY(-50%)";
    }

    /* 🔇 كتم الصوت - شمال 62.5% */
    const fwSound = document.getElementById("fwSoundToggle");
    if (fwSound) {
      fwSound.style.top = "62.5%";
      fwSound.style.bottom = "auto";
      fwSound.style.left = "2px";
      fwSound.style.right = "auto";
      fwSound.style.transform = "translateY(-50%)";
    }

    /* 🎨 Theme Studio - يمين 20% */
    const tsTrigger = document.getElementById("tsTrigger");
    if (tsTrigger) {
      tsTrigger.style.top = "20%";
      tsTrigger.style.bottom = "auto";
      tsTrigger.style.right = "2px";
      tsTrigger.style.left = "auto";
      tsTrigger.style.transform = "translateY(-50%)";
    }

    /* 🌞 السطوع - شمال نص */
    const brightness = document.querySelector(".brightness-control");
    if (brightness) {
      brightness.style.top = "50%";
      brightness.style.bottom = "auto";
      brightness.style.left = "20px";
      brightness.style.right = "auto";
      brightness.style.transform = "translateY(-50%)";
    }

    /* ⬆️⬇️ أزرار الصعود والنزول - يمين تحت */
    const scrollBtns = document.querySelector(".scroll-buttons");
    if (scrollBtns) {
      scrollBtns.style.top = "auto";
      scrollBtns.style.bottom = "80px";
      scrollBtns.style.right = "20px";
      scrollBtns.style.left = "auto";
      scrollBtns.style.transform = "none";
    }

  }, 500);

  console.info("%c✨ Enhancements Phase 1 Loaded!", "color:#c9a84c;font-weight:bold;font-size:14px;");
});