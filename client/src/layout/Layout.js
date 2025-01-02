import { createComponent } from "crs-arch";
import { router } from "../router/router";
import { Toast } from "../components/toast/Toast";
import storage from "../services/storage";
import { ws, wSocket } from "../services/websocket";
import "./style.css";

export const Layout = () => {
  const item = storage.get();

  if (item?.username) {
    wSocket(ws)
      .then((socket) => {
        socket.send(
          JSON.stringify({
            name: item.username,
            type: "authorization",
          })
        );
      })
      .catch((error) => {
        console.error("Failed to open WebSocket connection:", error);
      });
  }

  return router.layout(
    createComponent({
      class: "layout",
      children: [Toast],
    })
  );
};
