import { observe } from "crs-arch";
import { setToastStatus, toast } from "../../stores/toast";
import "./style.css";
// import { router } from "../../router/router";

let timer = null;

export const Toast = () =>
  observe({
    store: toast,
    props: {
      style: `display: none`,
      content: "",
      class: "toast",
    },
    render: ({ status }) => {
      if (status) {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
          // if (status === "Пользователь найден") {
          //   router.navigate("/contacts");
          // }
          setToastStatus("");
        }, 5000);
      }
      return {
        style: `display: ${status ? "flex" : "none"}`,
        content: status,
      };
    },
  });
