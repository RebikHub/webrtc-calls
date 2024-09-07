import { observe } from "crs-arch";
import { setToastStatus, toast } from "../../stores/toast";

export const Toast = () => observe({
  store: toast,
  props: {
    style: `display: none`,
    content: '',
  },
  render: ({status}) => {
    if (status) {
      setTimeout(() => setToastStatus(''), 5000)
    }
    return ({
    style: `display: ${status ? 'flex' : 'none'}`,
    content: status
  })}
})