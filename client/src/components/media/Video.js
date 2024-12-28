import { createComponent } from "crs-arch";

// peerConnection.ontrack = (event) => {
//   const remoteStream = event.streams[0];
//   showVideo(remoteStream, element);
// };

export const LocalVideo = () => {
  return createComponent({
    tag: "video",
    id: "localVideo",
    autoplay: true,
  });
};

export const RemoteVideo = () => {
  return createComponent({
    tag: "video",
    id: "remoteVideo",
    autoplay: true,
  });
};
