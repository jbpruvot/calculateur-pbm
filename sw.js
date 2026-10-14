'use strict';
// Service worker minimal : réseau d'abord (toujours la version à jour), cache en secours hors ligne.
const CACHE = 'pbm-v1';
const FILES = ['./','index.html','styles.css','app.js','logo.webp','favicon.svg','icon-192.png','icon-512.png','manifest.webmanifest',
  'fonts/montserrat-latin-800-normal.woff2','fonts/inter-latin-400-normal.woff2','fonts/inter-latin-700-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
