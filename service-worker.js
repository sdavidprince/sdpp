'use strict';
// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = 'sdavidprince-space-static-cache-v1';

const FILES_TO_CACHE = ['https://rawcdn.githack.com/sdavidprince/sdpp/a03cd14b7e909ec0a801fbc7d36d248cc594c284/offline.html'];

self.addEventListener('install', (evt) => {
	console.log('[ServiceWorker] Install');
	evt.waitUntil(caches.open(CACHE_NAME).then((cache) => {
		console.log('[ServiceWorker] Pre-caching offline page');
		return cache.addAll(FILES_TO_CACHE);
	}));
	self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
	console.log('[ServiceWorker] Activate');
	evt.waitUntil(caches.keys().then((keyList) => {
		return Promise.all(keyList.map((key) => {
			if (key !== CACHE_NAME) {
				console.log('[ServiceWorker] Removing old cache', key);
				return caches.delete(key);
			}
		}));
	}));
	self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
	console.log('[ServiceWorker] Fetch', evt.request.url);
	if (evt.request.mode !== 'navigate') {
		return;
	}
	evt.respondWith(fetch(evt.request).catch(() => {
		return caches.open(CACHE_NAME).then((cache) => {
			return cache.match('offline.html');
		});
	}));
});
