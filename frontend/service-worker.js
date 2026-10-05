const cacheName = 'crud-jwt-v3'
const arquivos = [
  '/',
  '/index.html',
  '/usuarios.html',
  '/style.css',
  '/auth.js',
  '/usuarios.js',
  '/manifest.json'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(arquivos))
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resposta => resposta || fetch(event.request))
  )
})
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(nomes =>
      Promise.all(
        nomes.filter(nome => nome !== cacheName).map(nome => caches.delete(nome))
      )
    )
  )
})
