import { createComponent, observe } from "crs-arch";
import storage from "../../services/storage";
import { router } from "../../router/router";
import { wSocket, ws } from "../../services/websocket";
import { contacts } from "../../stores/contacts";
import "./style.css";

export const Contacts = () => {
  console.log("render Contacts");

  const user = storage.get();

  if (user?.username) {
    wSocket(ws)
      .then((socket) => {
        socket.send(
          JSON.stringify({
            name: user.username,
            type: "authorization",
          })
        );
      })
      .catch((error) => {
        console.error("Failed to open WebSocket connection:", error);
      });
  }

  return createComponent({
    content: "Contacts page",
    children: [
      createComponent({
        tag: "p",
        content: user
          ? `id: ${user.id} name: ${user.username}`
          : "Необходимо авторизоваться",
      }),
      !user
        ? createComponent({
            tag: "button",
            content: "Авторизоваться",
            events: {
              click: () => router.navigate("/"),
            },
          })
        : null,
      observe({
        store: contacts,
        props: {
          children: contacts.state.map((item) =>
            createComponent({
              class: "contact",
              content: `user-name: ${item.username}; user-id: ${item.id}`,
              events: {
                click: () => {
                  window.location.href = `/call?username=${item.username}&id=${item.id}`;
                  console.log(
                    `user-name: ${item.username}; user-id: ${item.id}`
                  );
                },
              },
            })
          ),
        },
        render: (state) => ({
          children: state.map((item) =>
            createComponent({
              class: "contact",
              content: `user-name: ${item.username}; user-id: ${item.id}`,
              events: {
                click: () => {
                  window.location.href = `/call?username=${item.username}&id=${item.id}`;
                  console.log(
                    `user-name: ${item.username}; user-id: ${item.id}`
                  );
                },
              },
            })
          ),
        }),
      }),
    ],
  });
};
