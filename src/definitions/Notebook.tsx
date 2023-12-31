export type NotebookMetadata = {
    id?: number; // the ID of the notebook in the database. Cloud be undefined if the book is not there.
    title: string;
    tags: string[];
    author?: string;
    image?: string; // this is a base64 encoded image or src
};

export type NotebookData = string;

type Notebook = NotebookMetadata & {
    data: NotebookData; // this is the notebook itself
};

export default Notebook;
