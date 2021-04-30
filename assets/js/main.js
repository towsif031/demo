/* --- service worker --- */
/* check if service worker supported */
if ('serviceWorker' in navigator) {
	addEventListener('load', () => {
		navigator.serviceWorker
			.register('../../sw.js')
			.then((reg) => console.log('Service Worker: Registered'))
			.catch((err) => console.log(`Service Worker: Error: ${err}`));
	});
}
/* --- -------------- --- */

console.log('JavaScript');
