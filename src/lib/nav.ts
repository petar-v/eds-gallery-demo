import { Route } from "next";
import { revalidatePath } from "next/cache";

import { convert as slugify } from "url-slug";

import { NotebookMetadata } from "@/definitions/Notebook";

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

export const galleryRoute: Route = `/`;

export const uploadNotebookRoute: Route = "/upload-book";

export const getInTouch: Route =
    "mailto:petar@flutterbit.com?subject=EDS%20Book";

export const purgeNotebookRouteCache = () => revalidatePath(galleryRoute);
