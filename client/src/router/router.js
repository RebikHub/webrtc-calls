import { createRouter } from "crs-arch";
import { Registration } from "../pages/registration/Registration";
import { Contacts } from "../pages/contacts/Contacts";

export const router = createRouter()

router.add('/', Contacts)
router.add('/registration', Registration)
router.add('/contacts', Contacts)