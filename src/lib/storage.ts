import md5 from "md5";

import Notebook from "@/definitions/Notebook";

const notebooks: { [hash in string]: Notebook } = {};

export const getNotebooks = async (): Promise<Notebook[]> =>
    Object.values(notebooks);

export const removeNotebookByID = async (id: string) => {
    delete notebooks[md5(id.trim())];
};

export const removeNotebook = async (nb: Notebook) => {
    delete notebooks[md5(nb.title.trim())];
};

export const addNotebook = async (notebook: Notebook) =>
    (notebooks[md5(notebook.title.trim())] = notebook);

export const searchNotebooks = async (query: string): Promise<Notebook[]> => {
    const byTitle = Object.values(notebooks).filter((notebook) =>
        notebook.title.includes(query),
    );

    // TODO: search by tags
    // dedupe
    return [...byTitle];
};
