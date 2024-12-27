import { WebRTCHandler } from "../modules/webRTC";
import { router } from "../router/router";
import { setContacts } from "../stores/contacts";
import { setToastStatus } from "../stores/toast";
import storage from "./storage";

export const ws = new WebSocket(import.meta.env.VITE_WS);
const peerConnection = new RTCPeerConnection();

const user = storage.get();

// // Создаем экземпляр WebRTCHandler
// const webrtcHandler = new WebRTCHandler(ws);

// // Начало звонка
// export async function startCall(targetUserId) {
//   const stream = await navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true,
//   });
//   webrtcHandler.addLocalStream(stream);

//   // Отправляем сигнал начала звонка через WebSocket
//   ws.send(
//     JSON.stringify({
//       type: "call-init",
//       targetUserId: targetUserId,
//     })
//   );

//   // Создаем предложение (offer)
//   webrtcHandler.createOffer();
// }

// // Завершение звонка
export function endCall() {
  peerConnection.close();
  const localVideo = document.getElementById("localVideo");
  const remoteVideo = document.getElementById("remoteVideo");
  if (localVideo) localVideo.srcObject = null;
  if (remoteVideo) remoteVideo.srcObject = null;
}

// Инициализация звонка
export function startCall(to) {
  peerConnection
    .createOffer()
    .then((offer) => peerConnection.setLocalDescription(offer))
    .then(() => {
      ws.send(
        JSON.stringify({
          type: "call",
          from: user.id,
          to,
          sdp: peerConnection.localDescription,
        })
      );
    });

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      ws.send(
        JSON.stringify({
          type: "ice-candidate",
          from: user.id,
          to,
          candidate: event.candidate,
        })
      );
    }
  };
}

ws.onopen = () => {
  console.log("Соединение установлено");
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Получено сообщение от сервера: ", data);
  setToastStatus(data.message);

  if (data && data.status === "received") {
    storage.set(data.user);
  }

  if (data.status === "success") {
    storage.set(data.user);
    setContacts(data.contacts);
  }

  // if (
  //   data.type === "offer" ||
  //   data.type === "answer" ||
  //   data.type === "candidate"
  // ) {
  //   webrtcHandler.handleSignalingData(data);
  // } else if (data.type === "call-init") {
  //   const acceptCall = confirm(
  //     `${data.callerUsername} звонит вам. Принять звонок?`
  //   );
  //   if (acceptCall) {
  //     // Начать звонок
  //     startCall(data.callerUserId);
  //   }
  // }

  if (data.type === "call") {
    const { from, sdp } = data;
    // Обработка входящего звонка
    const peerConnection = new RTCPeerConnection();
    peerConnection
      .setRemoteDescription(new RTCSessionDescription(sdp))
      .then(() => peerConnection.createAnswer())
      .then((answer) => peerConnection.setLocalDescription(answer))
      .then(() => {
        ws.send(
          JSON.stringify({
            type: "answer",
            from: user.id,
            to: from,
            sdp: peerConnection.localDescription,
          })
        );
      });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        ws.send(
          JSON.stringify({
            type: "ice-candidate",
            from: user.id,
            to: from,
            candidate: event.candidate,
          })
        );
      }
    };
  } else if (data.type === "answer") {
    const { from, sdp } = data;
    // Обработка ответа на звонок
    peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
  } else if (data.type === "ice-candidate") {
    const { from, candidate } = data;
    // Добавление ICE кандидата
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }
};

ws.onclose = () => {
  console.log("Соединение закрыто");
};

ws.onerror = (e) => {
  console.warn(e);
};

export const wSocket = (socket) => {
  return new Promise((resolve, reject) => {
    if (socket.readyState === 1) {
      resolve(socket);
    }

    socket.onopen = () => {
      resolve(socket);
    };

    socket.onerror = () => {
      reject();
    };
  });
};
