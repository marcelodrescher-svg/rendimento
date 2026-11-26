// Guarda o aplicativo no aparelho para abrir mesmo sem internet.
// Ao publicar uma nova versão, aumente o número abaixo (v1 -> v2).
const CACHE = "rendimento-v9";
const ARQUIVOS = [
  "./", "./index.html", "./config.js", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png",
  "./lib/jspdf.umd.min.js", "./lib/jspdf.plugin.autotable.min.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // O servidor de cadastros (Google) nunca passa pelo cache.
  if (url.hostname.endsWith("google.com") || url.hostname.endsWith("googleusercontent.com")) return;

  // Fontes: usa a cópia guardada e atualiza em segundo plano.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === "opaque") c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin !== location.origin) return;

  // Página e configuração: tenta a internet primeiro (para receber atualizações), senão usa a cópia.
  if (req.mode === "navigate" || url.pathname.endsWith("/config.js") || url.pathname.endsWith("/index.html")) {
    e.respondWith(fetch(req).then(r => {
      const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return r;
    }).catch(() => caches.match(req).then(r => r || caches.match("./index.html"))));
    return;
  }
  // Demais arquivos: cópia guardada primeiro.
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
