import { WebSocketServer } from "ws";
import crypto from "crypto";
import { readDB, writeDB } from "../db/db.mjs";

export default class WebSocket {
  constructor(server) {
    this.wss = new WebSocketServer({ server });
    this.clients = new Map();

    this.wss.on("connection", (ws) => {
      console.log("connection");
      ws.on("message", (message) => this.handleMessage(ws, message));
      ws.on("close", () => this.handleClose(ws));
    });
  }

  handleMessage(ws, message) {
    const data = JSON.parse(message);
    console.log("data: ", data);

    if (data.type === "register" && data.name?.trim() !== "") {
      const userId = crypto.randomUUID();
      writeDB(userId, {
        username: data.name,
        id: userId,
      });
      this.clients.set(userId, ws);
      ws.id = userId;

      ws.send(
        JSON.stringify({
          status: "received",
          message: "Пользователь успешно создан",
          user: {
            username: data.name,
            id: userId,
          },
        })
      );
    } else if (data.type === "authorization" && data.name?.trim() !== "") {
      const dataDb = readDB();
      console.log("auth dataDb: ", dataDb);

      if (dataDb.length > 0) {
        const user = dataDb.find((item) => item.username === data.name);

        this.clients.set(user.id, ws);
        ws.id = user.id;
        if (user) {
          const contacts = dataDb.filter((item) => item.username !== data.name);
          ws.send(
            JSON.stringify({
              status: "success",
              message: "Пользователь найден",
              user,
              contacts,
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              status: "not found user",
              message: "Нет такого пользователя",
            })
          );
        }
      }
    } else if (data.type === "call") {
      const { from, to, sdp } = data;
      const targetClient = this.clients.get(to);
      if (targetClient) {
        targetClient.send(
          JSON.stringify({
            type: "call",
            from,
            sdp,
          })
        );
      }
    } else if (data.type === "answer") {
      const { from, to, sdp } = data;
      const targetClient = this.clients.get(to);
      if (targetClient) {
        targetClient.send(
          JSON.stringify({
            type: "answer",
            from,
            sdp,
          })
        );
      }
    } else if (data.type === "ice-candidate") {
      const { from, to, candidate } = data;
      const targetClient = this.clients.get(to);
      if (targetClient) {
        targetClient.send(
          JSON.stringify({
            type: "ice-candidate",
            from,
            candidate,
          })
        );
      }
    }
  }

  handleClose(ws) {
    this.clients.delete(ws.id);
  }
}
