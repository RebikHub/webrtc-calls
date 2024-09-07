const webPush = require('web-push');
const { publicKey, privateKey } = require('../utils/vapidKeys');

class PushServer {
    constructor() {
        webPush.setVapidDetails(
            'mailto:your-email@example.com',
            publicKey,
            privateKey
        );
        this.subscriptions = new Map();
    }

    addSubscription(userId, subscription) {
        this.subscriptions.set(userId, subscription);
    }

    sendNotification(userId, payload) {
        const subscription = this.subscriptions.get(userId);
        if (subscription) {
            webPush.sendNotification(subscription, JSON.stringify(payload))
                .catch(err => console.error('Push notification error:', err));
        }
    }
}

module.exports = PushServer;