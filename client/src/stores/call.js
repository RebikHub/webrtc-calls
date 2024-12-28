import { createState } from "crs-arch";

export const call = createState({ id: null });

export const setCallId = (id) => call.set({ id });
