const cacheName = 'v1';

const cacheAssets = [
	'/demo/index.html',
	'/demo/assets/css/main.css.map',
	'/demo/assets/css/main.css',
	'/demo/assets/js/main.js'
];

// Call Install Event
self.addEventListener('install', (e) => {
	console.log('Service Worker: Installed');

	e.waitUntil(
		caches
			.open(cacheName)
			.then((cache) => {
				console.log('Service Worker: Caching Files');
				cache.addAll(cacheAssets);
			})
			.then(() => self.skipWaiting())
	);
});

// Call Activate Event
self.addEventListener('activate', (e) => {
	console.log('Service Worker: Activated');
	// Remove unwanted caches
	e.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cache) => {
					if (cache !== cacheName) {
						console.log('Service Worker: Clearing Old Cache');
						return caches.delete(cache);
					}
				})
			);
		})
	);
});

// Call Fetch Event
self.addEventListener('fetch', (e) => {
	console.log('Service Worker: Fetching');
	// e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));

	// e.respondWith(
	// 	fetch(e.request).catch(() => {
	// 		return caches.match(e.request);
	// 	})
	// );

	e.respondWith(
		caches.open(cacheName).then((cache) => {
			return cache.match(e.request).then((response) => {
				return (
					response ||
					fetch(e.request).then((response) => {
						const responseClone = response.clone();
						cache.put(e.request, responseClone);
					})
				);
			});
		})
	);
});
