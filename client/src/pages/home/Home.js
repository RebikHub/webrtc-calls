import { createComponent } from "crs-arch";
import { Form } from "../../components/form/Form";
import { ws, wSocket } from "../../services/websocket";
import { router } from "../../router/router";
import { Navigation } from "../../components/navigation/Navigation";

export const Home = () => {
  console.log("render Home");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const username = data.get("username");
    console.log("formdata: ", username);

    if (username) {
      wSocket(ws).then((socket) => {
        socket.send(
          JSON.stringify({
            name: username,
            type: "authorization",
          })
        );
      });
    } else {
      router.navigate("/registration");
    }
  };

  return createComponent({
    content: "Home page",
    children: [Navigation, Form({ handleSubmit })],
  });
};
