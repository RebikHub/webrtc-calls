self.__WB_MANIFEST;

self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
  event.waitUntil(self.skipWaiting()); // Принудительно активировать новый сервис-воркер
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
  event.waitUntil(self.clients.claim()); // Принудительно взять управление всеми клиентами
});
self.addEventListener("fetch", (event) => {
  console.log("Fetching:", event.request.url);
});

self.addEventListener("push", (event) => {
  const data = event.data.json();
  const title = data.title || "Incoming Call";
  const options = {
    body: data.body || "Tap to answer",
    icon: "icon.png",
    data: data,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Вызов функции для начала звонка
  event.waitUntil(self.clients.openWindow("/call"));
});
