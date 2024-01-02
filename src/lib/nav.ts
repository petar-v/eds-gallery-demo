import { NotebookMetadata } from "@/definitions/Notebook";
import { Route } from "next";
import { convert as slugify } from "url-slug";

const MAX_SLUGS = 7;
const SLUG_SEPARATOR = "-";
export const slug = (str: string, maxSlugs?: number): string => {
    return slugify(str.trim(), {
        camelCase: true,
        separator: SLUG_SEPARATOR,
    })
        .split(SLUG_SEPARATOR)
        .slice(0, maxSlugs || MAX_SLUGS)
        .join(SLUG_SEPARATOR);
};

export const notebookToUrl = ({ id, title }: NotebookMetadata): Route => {
    if (!id) {
        return `/404` as Route;
    }
    return `/${id}/${slug(title)}` as Route;
};
