import { createComponent } from "crs-arch";
import { Form } from "../../components/form/Form";

export const Registration = () => createComponent({
  content: 'Registration page',
  children: [Form]
})