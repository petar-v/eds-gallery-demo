import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import type { Metadata, ResolvingMetadata } from "next";

import {
    getNotebookData,
    getNotebookMetaData,
    removeNotebookByID,
} from "@/lib/storage";

import { DeleteNotebookFunctionType } from "./components/notebookView";
import { Box } from "@chakra-ui/react";
import { purgeNotebookRouteCache } from "@/lib/nav";

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
    loading: () => (
        <Box alignItems="center" w="100%" p={10}>
            Loading this notebook, please be patient...
        </Box>
    ), // TODO: create a loading component
});

const deleteNotebook: DeleteNotebookFunctionType = async (notebookId) => {
    "use server";
    if (notebookId === undefined) {
        return {
            success: false,
            error: "No valid notebook ID provided.",
        };
    }
    try {
        const changedRows = await removeNotebookByID(notebookId);
        console.log(`Removed notebook with ID ${notebookId}`);
        if (changedRows === 0) {
            return {
                success: false,
                error: "It seems that this notebook has not been deleted. Maybe someone else has deleted it already?",
            };
        }
        // purge cache in gallery so the notebook will not appear
        purgeNotebookRouteCache();
        return { success: true };
    } catch (err) {
        return {
            success: false,
            error: "The notebook could not be saved to the database.",
        };
    }
};

export default async function Page({ params: { id } }: Props) {
    const notebook = await getNotebookData(id);

    if (!notebook) {
        return notFound();
    }

    // TODO: add error boundaries
    return (
        <main>
            {/* TODO: add suspense */}
            <NotebookView notebook={notebook} deleteNotebook={deleteNotebook} />
        </main>
    );
}
