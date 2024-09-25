export default class SignalingServer {
  constructor(wsServer) {
    this.wsServer = wsServer;
  }

  handleSignal(senderId, targetId, signal) {
    this.wsServer.sendSignal(targetId, signal);
  }
}
