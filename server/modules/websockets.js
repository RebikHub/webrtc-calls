const WebSocket = require('ws');

class WebSocketServer {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = new Map();

        this.wss.on('connection', (ws) => {
            ws.on('message', (message) => this.handleMessage(ws, message));
            ws.on('close', () => this.handleClose(ws));
        });
    }

    handleMessage(ws, message) {
        const data = JSON.parse(message);
        if (data.type === 'register') {
            this.clients.set(data.id, ws);
            ws.id = data.id;
        } else if (data.type === 'signal') {
            const target = this.clients.get(data.targetId);
            if (target) {
                target.send(JSON.stringify(data));
            }
        }
    }

    handleClose(ws) {
        this.clients.delete(ws.id);
    }

    sendSignal(targetId, signal) {
        const target = this.clients.get(targetId);
        if (target) {
            target.send(JSON.stringify(signal));
        }
    }
}

module.exports = WebSocketServer;