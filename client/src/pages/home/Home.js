import { createComponent } from "crs-arch";
import { Form } from "../../components/form/Form";
import { wSocket, ws } from "../../services/websocket";
import storage from "../../services/storage";
import { router } from "../../router/router";

export const Home = () => {
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
        router.navigate("/contacts");
      })
      .catch((error) => {
        console.error("Failed to open WebSocket connection:", error);
      });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const username = data.get("username");
    console.log("formdata: ", username);

    if (username) {
      ws.send(
        JSON.stringify({
          name: username,
          type: "authorization",
        })
      );
    } else {
      router.navigate("/registration");
    }
  };

  return createComponent({
    content: "Home page",
    children: [
      Form({ handleSubmit }),
      createComponent({
        tag: "button",
        content: "Registration",
        events: { click: () => router.navigate("/registration") },
      }),
      createComponent({
        tag: "button",
        content: "Contacts",
        events: { click: () => router.navigate("/contacts") },
      }),
    ],
  });
};
