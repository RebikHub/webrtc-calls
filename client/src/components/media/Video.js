import { createComponent } from "crs-arch";
import "./style.css";

const LocalVideo = () => {
  return createComponent({
    class: "local-video",
    tag: "video",
    id: "localVideo",
    autoplay: true,
  });
};

const RemoteVideo = () => {
  return createComponent({
    class: "remote-video",
    tag: "video",
    id: "remoteVideo",
    autoplay: true,
  });
};

export const Videos = () => {
  return createComponent({
    class: "videos-wrapper",
    children: [LocalVideo, RemoteVideo],
  });
};
