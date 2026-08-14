/**
 * EliteSports Pro — Service Worker
 * بيخزن (cache) الصفحات والملفات الأساسية عشان الموقع يفتح بسرعة أكبر
 * وبعض الأقسام تفضل شغالة حتى لو النت وقع مؤقتًا.
 * ده مش "أوفلاين كامل" - الفورمات والمميزات اللي محتاجة إنترنت (زي إرسال التسجيل) هتفضل محتاجة نت شغال.
 */
"use strict";

const CACHE_NAME = "elitesports-pro-cache-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./javascript/script.js",
  "./javascript/enhancements.js",
  "./javascript/global-bg.js",
  "./javascript/admin-panel.js",
  "./javascript/pricing-tools.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .catch(err => console.warn("[ServiceWorker] Cache install failed (non-fatal):", err))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  // مانخزنش نداءات الشبكة الخاصة بإرسال الفورم (Web3Forms) عشان تفضل دايمًا لايف
  if (event.request.url.includes("api.web3forms.com")) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request)
        .then(response => {
          if (response && response.status === 200 && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});