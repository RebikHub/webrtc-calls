export default class ConnectionManager {
  constructor(wsServer, pushServer, signalingServer) {
    this.wsServer = wsServer;
    this.pushServer = pushServer;
    this.signalingServer = signalingServer;
  }

  initiateCall(callerId, calleeId) {
    const callee = this.wsServer.clients.get(calleeId);
    if (callee) {
      this.signalingServer.handleSignal(callerId, calleeId, { type: "call" });
    } else {
      this.pushServer.sendNotification(calleeId, { type: "call" });
    }
  }
}
