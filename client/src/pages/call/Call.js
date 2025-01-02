import { createComponent } from "crs-arch";
import { Videos } from "../../components/media/Video";
import { endCall, startCall } from "../../services/websocket";
import { Button } from "../../components/button/Button";
import { setCallId } from "../../stores/call";
import "./style.css";
import { router } from "../../router/router";

export const Call = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const remoteUsername = urlParams.get("username");
  const remoteUserId = urlParams.get("id");

  const handleEndCall = () => {
    endCall();
    router.navigate("/contacts");
  };

  return createComponent({
    content: `Call to: ${remoteUsername}`,
    class: "call-container",
    children: [
      Videos,
      createComponent({
        class: "buttons-group",
        children: [
          Button({
            title: "Начать звонок",
            onClick: () => {
              setCallId(remoteUserId);
              startCall(remoteUserId);
            },
          }),
          Button({ title: "Завершить звонок", onClick: handleEndCall }),
        ],
      }),
    ],
  });
};
