class WebRTCInitiator {
  constructor(signalingServerUrl) {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    this.signalingSocket = new WebSocket(signalingServerUrl);
    this.setupSignaling();
  }

  setupSignaling() {
    this.signalingSocket.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "answer") {
        await this.peerConnection.setRemoteDescription(
          new RTCSessionDescription(message)
        );
      } else if (message.type === "candidate") {
        await this.peerConnection.addIceCandidate(
          new RTCIceCandidate(message.candidate)
        );
      }
    };

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.signalingSocket.send(
          JSON.stringify({ type: "candidate", candidate: event.candidate })
        );
      }
    };

    this.peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];
      showRemoteVideo(remoteStream);
    };
  }

  async startConnection() {
    const stream = await getMediaStream();
    if (stream) {
      showLocalVideo(stream);
      addMediaToConnection(this.peerConnection, stream);

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.signalingSocket.send(
        JSON.stringify({ type: "offer", sdp: offer.sdp })
      );
    }
  }
}
