// Service Worker для Телеграммы по Кубани
// Нужен для того, чтобы работали уведомления на iOS (Safari требует именно
// Service Worker + showNotification(), обычный `new Notification()` на iOS
// для обычных сайтов не работает вообще — только для установленных на
// главный экран PWA).

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Показ уведомления по команде из открытой вкладки (когда пришло новое сообщение).
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'show-notification') {
    self.registration.showNotification(data.title || 'Новое сообщение', {
      body: data.body || '',
      icon: data.icon,
      tag: data.tag,
      renotify: true,
      badge: data.icon
    });
  }
});

// Клик по уведомлению — фокусируем/открываем вкладку с мессенджером.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});
