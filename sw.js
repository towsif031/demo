const cacheName = 'v1';

/* install event */
addEventListener('install', (e) => {
	console.log('Service Worker: Installed.');
});

/* activate event */
addEventListener('activate', (e) => {
	console.log('Service Worker: Activated.');

	e.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cache) => {
					if (cache !== cacheName) {
						console.log('Service Worker: Clearing Old Cache.');
						return caches.delete(cache);
					}
				})
			);
		})
	);
});

/* fetch event */
addEventListener('fetch', (e) => {
	console.log('Service Worker: Fetching.');

	e.respondWith(
		fetch(e.request)
			.then((res) => {
				/* make a clone of the response */
				const resClone = res.clone();
				/* open cache */
				caches.open(cacheName).then((cache) => {
					/* add response to cache */
					cache.put(e.request, resClone);
				});
				return res;
			})
			.catch((err) => caches.match(e.request).then((res) => res))
	);
});
