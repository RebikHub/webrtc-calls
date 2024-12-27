import { createState } from "crs-arch";

export const contacts = createState([]);

export const setContacts = (data) => contacts.set([...data]);
