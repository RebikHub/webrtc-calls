import { createComponent } from "crs-arch";
import { router } from "../router/router";
import storage from "../services/storage";
import { ws } from "../services/websocket";
import { Toast } from "../components/toast/Toast";

export const Layout = () => {
  const item = storage.get()

  if (item) {
    ws.send(JSON.stringify({
      name: item.name,
      uuid: item.uuid
    }));
    router.navigate('/contacts')
  } else {
    router.navigate('/registration')
  }


  return router.layout(createComponent({
  content: 'Root Layout',
  children: [Toast]
}))}