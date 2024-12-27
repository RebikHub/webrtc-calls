import { createComponent } from "crs-arch";
import { router } from "../router/router";
import { Toast } from "../components/toast/Toast";

export const Layout = () => {
  return router.layout(
    createComponent({
      children: [Toast],
    })
  );
};
