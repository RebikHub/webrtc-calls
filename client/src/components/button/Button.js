import { createComponent } from "crs-arch";
import "./style.css";

export const Button = ({ title, onClick }) =>
  createComponent({
    tag: "button",
    class: "btn",
    content: title,
    events: {
      click: onClick,
    },
  });
