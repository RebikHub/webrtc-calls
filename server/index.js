const http = require('http');
const WebSocketServer = require('./modules/websockets');
const PushServer = require('./modules/notifications');
const SignalingServer = require('./modules/signals');
const ConnectionManager = require('./modules/manager');

const server = http.createServer();

const wsServer = new WebSocketServer(server);
const pushServer = new PushServer();
const signalingServer = new SignalingServer(wsServer);
const connectionManager = new ConnectionManager(wsServer, pushServer, signalingServer);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});