import pkg from 'web-push';
const { generateVAPIDKeys } = pkg;

// Генерация пары VAPID ключей (публичного и приватного)
const vapidKeys = generateVAPIDKeys();

const PUBLIC_KEY = 'BO8t_iSuUTFBjhJBlcJlDu76Xe0uNGnOn8jETuoxhurSsq7KMgHRkfwQr0ZsCUIczRZoKMK5NSYXkUlwlWqd0r4'
const PRIVATE_KEY = 'JXAhxYhLZIHzQDEIxZXxOjhszPxWMxqMzNcOkLxCgug'

console.log('Public Key: ', vapidKeys.publicKey);
console.log('Private Key: ', vapidKeys.privateKey);

module.exports = {
    publicKey: vapidKeys.publicKey,
    privateKey: vapidKeys.privateKey,
    PUBLIC_KEY,
    PRIVATE_KEY
};