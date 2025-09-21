const CACHE_NAME = 'geomancy-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // シンボル画像
  './1111.png',
  './1112.png',
  './1121.png',
  './1122.png',
  './1211.png',
  './1212.png',
  './1221.png',
  './1222.png',
  './2111.png',
  './2112.png',
  './2121.png',
  './2122.png',
  './2211.png',
  './2212.png',
  './2221.png',
  './2222.png',
  // CDNのライブラリ（オンライン時のみ）
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.js'
];

// インストール時にキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // 画像とHTMLのみをキャッシュ（CDNライブラリはネットワーク優先）
        return cache.addAll([
          './',
          './index.html',
          './manifest.json',
          './1111.png',
          './1112.png',
          './1121.png',
          './1122.png',
          './1211.png',
          './1212.png',
          './1221.png',
          './1222.png',
          './2111.png',
          './2112.png',
          './2121.png',
          './2122.png',
          './2211.png',
          './2212.png',
          './2221.png',
          './2222.png'
        ]);
      })
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// フェッチ時の処理（ネットワーク優先、失敗時にキャッシュ）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // レスポンスをクローンしてキャッシュに保存
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // ネットワークが失敗した場合はキャッシュから返す
        return caches.match(event.request);
      })
  );
});
