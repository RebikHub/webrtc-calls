import { WebSocketServer as Server } from "ws";

const wss = new Server({
  port: 4000,
});

wss.on("connection", (socket, request) => {
  console.log("connection");

  socket.on("open", () => {
    console.log("socket-open");
  });

  socket.on("message", (message) => {
    try {
      // Парсим JSON-сообщение
      const data = JSON.parse(message);

      // Выводим полученные данные в консоль
      console.log("Получено сообщение:", data);

      // Пример обработки данных
      if (data.uuid && data.name) {
        console.log(`ID: ${data.id}, Name: ${data.name}`);

        // Отправляем ответ обратно клиенту
        socket.send(
          JSON.stringify({
            status: "received",
            message: "Сообщение успешно получено",
          })
        );
      } else {
        console.log("Некорректные данные");
        socket.send(
          JSON.stringify({ status: "error", message: "Некорректные данные" })
        );
      }
    } catch (error) {
      console.error("Ошибка при парсинге JSON:", error);
      socket.send(
        JSON.stringify({ status: "error", message: "Ошибка при парсинге JSON" })
      );
    }
  });

  socket.on("close", () => {
    console.log("socket-close");
  });

  socket.on("error", (error) => {
    console.log("socket-error: ", error);
  });
});
