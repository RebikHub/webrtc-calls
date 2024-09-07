import { setToastStatus } from "../stores/toast";

export const ws = new WebSocket(import.meta.env.VITE_WS);

ws.onopen = () => {
  console.log('Соединение установлено');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('Получено сообщение от сервера: ', data);
  setToastStatus(data.message)
};

ws.onclose = () => {
  console.log('Соединение закрыто');
};