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

	e.respondWith(
		caches.open(cacheName).then(async (cache) => {
			const response = await cache.match(e.request);
			return (
				response ||
				fetch(e.request).then((response_1) => {
					const responseClone = response_1.clone();
					cache.put(e.request, responseClone);
				})
			);
		})
	);
});
