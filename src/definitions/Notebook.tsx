type Notebook = {
    title: string;
    tags: string[];
    author?: string;
    image?: string; // this is a base64 encoded image or src
    data: string; // this is the notebook itself
};

export default Notebook;
