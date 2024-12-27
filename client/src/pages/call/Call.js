import { createComponent } from "crs-arch";
import { LocalVideo, RemoteVideo } from "../../components/media/Video";
import { endCall, startCall } from "../../services/websocket";
import { Button } from "../../components/button/Button";

export const Call = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const remoteUsername = urlParams.get("username");
  const remoteUserId = urlParams.get("id");
  return createComponent({
    content: `Call to: ${remoteUsername}`,
    children: [
      LocalVideo,
      RemoteVideo,
      Button({
        title: "Начать звонок",
        onClick: () => startCall(remoteUserId),
      }),
      Button({ title: "Завершить звонок", onClick: endCall }),
    ],
  });
};
