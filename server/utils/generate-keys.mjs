import pkg from "web-push";
const { generateVAPIDKeys } = pkg;

// Генерация пары VAPID ключей (публичного и приватного)
const vapidKeys = generateVAPIDKeys();

const PUBLIC_KEY =
  "BO8t_iSuUTFBjhJBlcJlDu76Xe0uNGnOn8jETuoxhurSsq7KMgHRkfwQr0ZsCUIczRZoKMK5NSYXkUlwlWqd0r4";
const PRIVATE_KEY = "JXAhxYhLZIHzQDEIxZXxOjhszPxWMxqMzNcOkLxCgug";

console.log("Public Key: ", vapidKeys.publicKey);
console.log("Private Key: ", vapidKeys.privateKey);

export const publicKey = vapidKeys.publicKey;
export const privateKey = vapidKeys.privateKey;
export const PUBLIC_KEY_CONST = PUBLIC_KEY;
export const PRIVATE_KEY_CONST = PRIVATE_KEY;
