import { NotebookMetadata } from "@/definitions/Notebook";
import { sortKind, Searcher, FullOptions } from "fast-fuzzy";

const keySelector = ({ title, author, tags }: NotebookMetadata) => [
    title,
    author || "",
    ...tags,
];

const notebookSearchConfig: FullOptions<NotebookMetadata> = {
    keySelector,
    // returnMatchData: true,
    ignoreCase: true,
    sortBy: sortKind.bestMatch,
    threshold: 0.8, // make this almost exact
    // useDamerau: false,
    // useSellers: false,
};

export type SearcherType = Searcher<
    NotebookMetadata,
    typeof notebookSearchConfig
>;

const notebooksSearcher = (notebooks: NotebookMetadata[]): SearcherType => {
    return new Searcher(notebooks, notebookSearchConfig);
};

export default notebooksSearcher;
