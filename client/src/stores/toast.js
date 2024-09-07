import { createState } from "crs-arch";

export const toast = createState({status: ''})

export const setToastStatus = (status) => toast.set({status})