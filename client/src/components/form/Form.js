import { createComponent } from "crs-arch";
import "./style.css";
import { Button } from "../button/Button";

export const Form = ({ handleSubmit }) => {
  return createComponent({
    tag: "form",
    class: "form-container",
    events: {
      submit: handleSubmit || undefined,
    },
    children: [
      createComponent({
        tag: "label",
        content: "Input username",
        children: [
          createComponent({
            tag: "input",
            name: "username",
            placeholder: "Username",
          }),
        ],
      }),
      Button({
        title: "Submit",
        type: "submit",
      }),
    ],
  });
};
