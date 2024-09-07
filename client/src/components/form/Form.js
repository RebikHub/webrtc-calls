import { createComponent } from "crs-arch"
import { ws } from "../../services/websocket"

export const Form = () => {
  return createComponent({
    tag: 'form',
    events: {
      submit: (evt) => {
        evt.preventDefault()
        const data = new FormData(evt.target)
        const username = data.get('username');
        console.log('formdata: ', username);
        ws.send(JSON.stringify({
          name: username
        }));
      }
    },
    children: [
      createComponent({
        tag: 'label',
        content: 'Input username',
        children: [createComponent({
          tag: 'input',
          name: 'username',
          placeholder: 'Username'
        })]
      }),
      createComponent({
        tag: 'button',
        content: 'Submit',
        type: 'submit'
      })
    ]
  })
}