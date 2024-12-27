import { createRouter } from "crs-arch";
import { Registration } from "../pages/registration/Registration";
import { Contacts } from "../pages/contacts/Contacts";
import { Home } from "../pages/home/Home";
import { Call } from "../pages/call/Call";

export const router = createRouter();

router.add("/", Home);
router.add("/registration", Registration);
router.add("/contacts", Contacts);
router.add("/call", Call);
