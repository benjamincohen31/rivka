const V='rivka-v1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./apple-touch-icon.png','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./icon.svg'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(V).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url); if(u.origin!==location.origin) return;
  if(e.request.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/')){
    e.respondWith(fetch(e.request).then(r=>{ const cp=r.clone(); caches.open(V).then(c=>c.put('./index.html',cp)); return r; }).catch(()=>caches.match('./index.html')));
    return; }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(x=>{ const cp=x.clone(); caches.open(V).then(c=>c.put(e.request,cp)); return x; })));
});
