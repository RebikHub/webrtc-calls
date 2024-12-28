import { RemoteVideo } from "../components/media/Video";
import { router } from "../router/router";
import { call } from "../stores/call";
import { setContacts } from "../stores/contacts";
import { setToastStatus } from "../stores/toast";
import storage from "./storage";
import {
  createOffer,
  getMediaStream,
  handleAnswer,
  handleCandidate,
  handleOffer,
} from "./webrtc";

export const ws = new WebSocket(import.meta.env.VITE_WSS);
export const peerConnection = new RTCPeerConnection({
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19305",
        "stun:stun1.l.google.com:19305",
        "stun:stun2.l.google.com:19305",
        "stun:stun3.l.google.com:19305",
        "stun:stun4.l.google.com:19305",
        "stun:stun.services.mozilla.com",
      ],
    },
  ],
});

console.log("Initial connection state:", peerConnection.connectionState);
console.log("Initial signaling state:", peerConnection.signalingState);
console.log("Initial ice connection state:", peerConnection.iceConnectionState);

peerConnection.onicecandidate = (event) => {
  console.log("onicecandidate: ", event);

  if (event.candidate && call.state.id) {
    ws.send(
      JSON.stringify({
        type: "ice-candidate",
        candidate: event.candidate,
        fromId: storage.get().id,
        toId: call.state.id,
      })
    );
  }
};

peerConnection.ontrack = (event) => {
  console.log("ontrack: ", event);

  const root = document.getElementById("root");
  const remoteVideo = document.getElementById("remoteVideo");
  if (!remoteVideo && root) {
    const element = RemoteVideo();
    root.appendChild(element);

    console.log(element, event.streams, event.streams[0]);

    if (element && event.streams && event.streams[0]) {
      console.log("stream: ", event.streams[0]);

      element.srcObject = event.streams[0];
      element.setAttribute("playsinline", true);
      element.play();
    }
  }
};

// Завершение звонка
export function endCall() {
  peerConnection.close();
  const localVideo = document.getElementById("localVideo");
  const remoteVideo = document.getElementById("remoteVideo");
  if (localVideo) localVideo.srcObject = null;
  if (remoteVideo) remoteVideo.srcObject = null;
}

// Инициализация звонка
export async function startCall(toId) {
  if (!peerConnection) {
    console.log("peerConnection не существует");
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error("getUserMedia не поддерживается в этом браузере");
    return;
  }

  const stream = await getMediaStream();

  const localVideo = document.getElementById("localVideo");
  if (localVideo) localVideo.srcObject = stream;

  stream.getTracks().forEach((track) => {
    console.log("track: ", track);
    console.log("stream: ", stream);

    peerConnection.addTrack(track, stream);
  });

  try {
    const offer = await createOffer(peerConnection);
    ws.send(
      JSON.stringify({
        type: "call",
        fromId: storage.get().id,
        toId,
        offer,
      })
    );
  } catch (error) {
    console.error("Ошибка при получении медиапотока:", error);
  }
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

  if (data.type === "offer") {
    console.log("offer data: ", data);
    handleOffer(data.offer, peerConnection).then((answer) => {
      console.log("type offer - answer: ", answer);

      ws.send(
        JSON.stringify({
          type: "answer",
          answer,
          fromId: storage.get().id,
          toId: data.toId,
        })
      );
    });
  } else if (data.type === "answer") {
    handleAnswer(data.answer, peerConnection);
  } else if (data.type === "ice-candidate") {
    handleCandidate(data.candidate, peerConnection);
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

peerConnection.oniceconnectionstatechange = () => {
  console.log(
    "ICE connection state changed:",
    peerConnection.iceConnectionState
  );
};

peerConnection.onsignalingstatechange = () => {
  console.log("Signaling state changed:", peerConnection.signalingState);
};

peerConnection.onconnectionstatechange = () => {
  console.log("Connection state changed:", peerConnection.connectionState);
};

// Регистрация Service Worker для обработки push-уведомлений
if ("serviceWorker" in navigator && "PushManager" in window) {
  navigator.serviceWorker
    .register("sw.js")
    .then((registration) => {
      console.log("Service Worker registered", registration);

      // Подписка на push-уведомления
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY), // Вставьте здесь ваш публичный VAPID ключ
      });
    })
    .then((subscription) => {
      console.log("User is subscribed:", subscription);

      // Отправьте объект подписки на сервер
      ws.send(
        JSON.stringify({
          type: "subscribe",
          subscription: subscription,
        })
      );
    })
    .catch((error) => {
      console.error("Failed to subscribe the user: ", error);
    });
}

// Вспомогательная функция для преобразования VAPID ключа из base64 в Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
