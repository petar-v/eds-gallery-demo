import { NotebookMetadata } from "@/definitions/Notebook";
import Fuse, { Expression } from "fuse.js";

const fuseOptions = {
    // includeScore: false,
    // includeMatches: false,
    findAllMatches: true,
    // minMatchCharLength: 1,
    // location: 0,
    isCaseSensitive: false,
    shouldSort: true,
    threshold: 0.3,
    // distance: 100,
    useExtendedSearch: true,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    keys: ["title", "author", "tags"],
};

export type SearcherType = (query: string) => NotebookMetadata[];

const notebooksSearcher = (notebooks: NotebookMetadata[]): SearcherType => {
    const fuse = new Fuse(notebooks, fuseOptions);
    return (query: string): NotebookMetadata[] =>
        fuse.search(query).map((res) => res.item);
};

export default notebooksSearcher;
