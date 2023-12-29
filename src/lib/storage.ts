import Notebook from "@/definitions/Notebook";

const notebooks: Notebook[] = [];

export const getNotebooks = async () => notebooks;

export const addNotebook = async (notebook: Notebook) =>
    notebooks.push(notebook);

export const searchNotebooks = async (query: string) =>
    notebooks.filter((notebook) => notebook.title.includes(query));
