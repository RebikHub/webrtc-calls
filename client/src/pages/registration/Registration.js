import { createComponent } from "crs-arch";
import { Form } from "../../components/form/Form";
import { ws } from "../../services/websocket";

export const Registration = () => {
  const handleSubmit = (evt) => {
    evt.preventDefault();
    const data = new FormData(evt.target);
    const username = data.get("username");
    console.log("formdata: ", username);
    ws.send(
      JSON.stringify({
        name: username,
        type: "register",
      })
    );
  };

  return createComponent({
    content: "Registration page",
    children: [Form({ handleSubmit })],
  });
};
