let localStream;
let remoteStream;
let peerConnection;
let ws;

const callButton = document.getElementById('call-button');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

const PUBLIC_KEY = 'BO8t_iSuUTFBjhJBlcJlDu76Xe0uNGnOn8jETuoxhurSsq7KMgHRkfwQr0ZsCUIczRZoKMK5NSYXkUlwlWqd0r4'

const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

// Подключение к сигнальному серверу через WebSocket
ws = new WebSocket('wss://localhost:4000');

// Получаем медиа-поток
async function getMedia() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
}

getMedia();

callButton.onclick = async () => {
    peerConnection = new RTCPeerConnection(configuration);
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
    
    peerConnection.ontrack = event => {
        remoteStream = event.streams[0];
        remoteVideo.srcObject = remoteStream;
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Отправляем сигнал вызова через WebSocket
    ws.send(JSON.stringify({
        type: 'call',
        offer: offer,
        targetClientId: 'target-client-id', // Здесь нужно указать ID вызываемого клиента
        callerClientId: 'your-client-id'    // Здесь нужно указать ID вызывающего клиента
    }));
};

ws.onmessage = async (event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
        case 'call':
            peerConnection = new RTCPeerConnection(configuration);
            localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
            
            peerConnection.ontrack = event => {
                remoteStream = event.streams[0];
                remoteVideo.srcObject = remoteStream;
            };

            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            ws.send(JSON.stringify({
                type: 'answer',
                answer: answer,
                callerClientId: data.callerClientId
            }));
            break;

        case 'answer':
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            break;

        case 'ice-candidate':
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
            break;

        default:
            console.error('Unknown message type:', data.type);
    }
};

peerConnection.onicecandidate = event => {
    if (event.candidate) {
        ws.send(JSON.stringify({
            type: 'ice-candidate',
            candidate: event.candidate,
            targetClientId: 'target-client-id' // Здесь нужно указать ID клиента, которому предназначен ICE-кандидат
        }));
    }
};

// Регистрация Service Worker для обработки push-уведомлений
if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('sw.js')
    .then(registration => {
        console.log('Service Worker registered', registration);

        // Подписка на push-уведомления
        return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY) // Вставьте здесь ваш публичный VAPID ключ
        });
    })
    .then(subscription => {
        console.log('User is subscribed:', subscription);

        // Отправьте объект подписки на сервер
        ws.send(JSON.stringify({
            type: 'subscribe',
            subscription: subscription
        }));
    })
    .catch(error => {
        console.error('Failed to subscribe the user: ', error);
    });
}

// Вспомогательная функция для преобразования VAPID ключа из base64 в Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


