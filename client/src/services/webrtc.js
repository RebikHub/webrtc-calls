export async function getMediaStream() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    return stream;
  } catch (error) {
    console.error("Ошибка при получении медиапотока:", error);
  }
}

export async function createOffer(peerConnection) {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log("After setLocalDescription (offer):");
  console.log("Initial connection state:", peerConnection.connectionState);
  console.log("Initial signaling state:", peerConnection.signalingState);
  console.log(
    "Initial ice connection state:",
    peerConnection.iceConnectionState
  );
  return offer;
}

export async function handleOffer(offer, peerConnection) {
  try {
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    console.log("After setLocalDescription (answer):");
    console.log("Initial connection state:", peerConnection.connectionState);
    console.log("Initial signaling state:", peerConnection.signalingState);
    console.log(
      "Initial ice connection state:",
      peerConnection.iceConnectionState
    );
    return answer;
  } catch (error) {
    console.error("Ошибка при обработке предложения:", error);
  }
}

export async function handleAnswer(answer, peerConnection) {
  try {
    await peerConnection.setRemoteDescription(answer);
    console.log("After setRemoteDescription (answer):");
    console.log("Connection state:", peerConnection.connectionState);
    console.log("Signaling state:", peerConnection.signalingState);
    console.log("Ice connection state:", peerConnection.iceConnectionState);
  } catch (error) {
    console.error("Ошибка при установке remoteDescription:", error);
  }
}

export async function handleCandidate(candidate, peerConnection) {
  // if (peerConnection.remoteDescription) {
  await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  // }

  console.log("After addIceCandidate:");
  console.log("Connection state:", peerConnection.connectionState);
  console.log("Signaling state:", peerConnection.signalingState);
  console.log("Ice connection state:", peerConnection.iceConnectionState);
}
