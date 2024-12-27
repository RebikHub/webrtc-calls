import { createComponent } from "crs-arch";

export const Form = ({ handleSubmit }) => {
  return createComponent({
    tag: "form",
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
      createComponent({
        tag: "button",
        content: "Submit",
        type: "submit",
      }),
    ],
  });
};
