import { createComponent } from "crs-arch";

export const Button = ({ title, onClick }) =>
  createComponent({
    tag: "button",
    content: title,
    events: {
      click: onClick,
    },
  });
