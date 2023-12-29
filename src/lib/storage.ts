import Notebook from "@/definitions/Notebook";

const notebooks: Notebook[] = [];

export const getNotebooks = () => notebooks;

export const addNotebook = (notebook: Notebook) => notebooks.push(notebook);
