self.addEventListener('push', event => {
  const data = event.data.json();
  const title = data.title || 'Incoming Call';
  const options = {
      body: data.body || 'Tap to answer',
      icon: 'icon.png',
      data: data
  };

  event.waitUntil(
      self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  // Вызов функции для начала звонка
  event.waitUntil(
      clients.openWindow('/call')
  );
});

