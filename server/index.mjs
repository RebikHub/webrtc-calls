import { createServer } from "node:http";
import WebSocket from "./modules/websockets.mjs";
import PushServer from "./modules/notifications.mjs";
import SignalingServer from "./modules/signals.mjs";
import ConnectionManager from "./modules/manager.mjs";

const server = createServer();

const wsServer = new WebSocket(server);
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
