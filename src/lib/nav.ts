import { NotebookMetadata } from "@/definitions/Notebook";
import { Route } from "next";
import { convert as slugify } from "url-slug";

const notebookSlug = (title: string) =>
    slugify(title, { camelCase: true }).substring(0, 150);

export const notebookToUrl = ({ id, title }: NotebookMetadata): Route => {
    if (!id) {
        return `/404` as Route;
    }
    return `/${id}/${notebookSlug(title)}` as Route; // FIXME: fix the type safety here
};
