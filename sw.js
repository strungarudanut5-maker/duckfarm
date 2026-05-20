self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

const timers = new Map();

self.addEventListener('message', (event) => {
  const { type, id, title, body, delay } = event.data || {};
  if (type === 'SCHEDULE') {
    if (timers.has(id)) clearTimeout(timers.get(id));
    const t = setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: '/duky.svg',
        badge: '/duky.svg',
        tag: id,
        renotify: true,
        vibrate: [200, 100, 200],
      });
      timers.delete(id);
    }, Math.max(delay, 0));
    timers.set(id, t);
  }
  if (type === 'CANCEL') {
    if (timers.has(id)) { clearTimeout(timers.get(id)); timers.delete(id); }
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window' }).then(list => {
    if (list.length) return list[0].focus();
    return clients.openWindow('/');
  }));
});
