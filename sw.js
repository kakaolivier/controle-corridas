const CACHE_NAME = 'daily-runs-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/sw.js'
    // Em uma implantação real, você incluiria URLs para os ícones
];

// Evento de Instalação: Armazena o cache inicial
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache aberto e arquivos pré-armazenados.');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento de Fetch: Serve os arquivos do cache
self.addEventListener('fetch', (event) => {
    // Tenta obter do cache, e se falhar, busca na rede
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Evento de Ativação: Limpa caches antigos
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
