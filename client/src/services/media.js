export async function getMediaStream() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true, // Включаем видео
      audio: true, // Включаем аудио
    });
    return stream;
  } catch (error) {
    console.error("Ошибка доступа к медиаустройствам:", error);
    return null;
  }
}

export async function addMediaToConnection(peerConnection, stream) {
  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });
}

export const showVideo = (stream, element) => {
  element.srcObject = stream;
};
