import { notFound } from "next/navigation";

import type { Metadata, ResolvingMetadata } from "next";

import { getNotebookData, getNotebookMetaData } from "@/lib/storage";
import dynamic from "next/dynamic";

// import NotebookView from "./components/notebookView";

type Props = {
    params: { id: number };
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    // read route params
    const id = params.id;
    // TODO: do some sort of caching here
    const notebook = await getNotebookMetaData(id);

    if (!notebook) return {};

    const resolvedParent = await parent;

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = resolvedParent.openGraph?.images || [];
    const images = notebook.image ? [notebook.image, ...previousImages] : [];
    // TODO: make an endpoint for the images.

    const title = notebook.title;
    const description = `${notebook.title} by ${notebook.author}`;
    const authors = notebook.author
        ? {
              name: notebook.author,
          }
        : undefined;

    return {
        title,
        description,
        authors,
        keywords: notebook.tags,
        // metadataBase: resolvedParent.metadataBase,
        openGraph: {
            title,
            description,
            // images,
        },
    };
}

const NotebookView = dynamic(() => import("./components/notebookView"), {
    ssr: false,
    loading: () => <>LOADING...</>, // TODO: create a loading component
});

export default async function Page({ params: { id } }: Props) {
    const notebook = await getNotebookData(id);
    if (!notebook) {
        return notFound();
    }
    // TODO: add error boundaries
    return (
        <main>
            {/* TODO: add suspense */}
            <NotebookView notebook={notebook} />
        </main>
    );
}
