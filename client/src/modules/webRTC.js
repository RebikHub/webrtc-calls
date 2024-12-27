export class WebRTCHandler {
  constructor(signalingSocket) {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    this.signalingSocket = signalingSocket;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.signalingSocket.send(
          JSON.stringify({ type: "candidate", candidate: event.candidate })
        );
      }
    };

    this.peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];
      this.onRemoteStream(remoteStream);
    };
  }

  async createOffer() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.signalingSocket.send(
      JSON.stringify({ type: "offer", sdp: offer.sdp })
    );
  }

  async handleAnswer(answer) {
    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  }

  async handleOffer(offer) {
    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    this.signalingSocket.send(
      JSON.stringify({ type: "answer", sdp: answer.sdp })
    );
  }

  async addIceCandidate(candidate) {
    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  handleSignalingData(data) {
    switch (data.type) {
      case "offer":
        this.handleOffer(data);
        break;
      case "answer":
        this.handleAnswer(data);
        break;
      case "candidate":
        this.addIceCandidate(data.candidate);
        break;
      default:
        console.warn("Неизвестный тип сообщения:", data.type);
    }
  }

  onRemoteStream(stream) {
    // Обработка удаленного потока (например, отображение видео)
    const remoteVideo = document.getElementById("remoteVideo");
    if (remoteVideo) {
      remoteVideo.srcObject = stream;
    }
  }

  async addLocalStream(stream) {
    stream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, stream);
    });

    const localVideo = document.getElementById("localVideo");
    if (localVideo) {
      localVideo.srcObject = stream;
    }
  }
}
