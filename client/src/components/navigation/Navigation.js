import { createComponent } from "crs-arch";
import { Button } from "../button/Button";
import { router } from "../../router/router";
import "./style.css";

export const Navigation = () => {
  return createComponent({
    class: "navigation",
    children: [
      Button({
        title: "Login",
        onClick: () => router.navigate("/"),
      }),
      Button({
        title: "Registration",
        onClick: () => router.navigate("/registration"),
      }),
      Button({
        title: "Contacts",
        onClick: () => router.navigate("/contacts"),
      }),
    ],
  });
};
