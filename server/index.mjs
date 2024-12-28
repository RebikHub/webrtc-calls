import { createServer } from "node:https";
import { readFileSync } from "node:fs";
import WebSocket from "./modules/websockets.mjs";
import PushServer from "./modules/notifications.mjs";
import SignalingServer from "./modules/signals.mjs";
import ConnectionManager from "./modules/manager.mjs";

// Загрузка SSL-сертификатов
const options = {
  key: readFileSync("./certs/localhost+1-key.pem"), // Путь к приватному ключу
  cert: readFileSync("./certs/localhost+1.pem"), // Путь к сертификату
};

const server = createServer(options);
const wsServer = new WebSocket(server, {
  rejectUnauthorized: false,
});
const pushServer = new PushServer();
const signalingServer = new SignalingServer(wsServer);
const connectionManager = new ConnectionManager(
  wsServer,
  pushServer,
  signalingServer
);

const PORT = process.env.PORT || 4000;
server.listen(PORT, "192.168.0.164", () => {
  console.log(`Server is running on port ${PORT}`);
});
