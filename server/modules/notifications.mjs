import pkg from "web-push";
const { setVapidDetails, sendNotification } = pkg;
import { publicKey, privateKey } from "../utils/generate-keys.mjs";

export default class PushServer {
  constructor() {
    setVapidDetails("mailto:your-email@example.com", publicKey, privateKey);
    this.subscriptions = new Map();
  }

  addSubscription(userId, subscription) {
    this.subscriptions.set(userId, subscription);
  }

  sendNotification(userId, payload) {
    const subscription = this.subscriptions.get(userId);
    if (subscription) {
      sendNotification(subscription, JSON.stringify(payload)).catch((err) =>
        console.error("Push notification error:", err)
      );
    }
  }
}
