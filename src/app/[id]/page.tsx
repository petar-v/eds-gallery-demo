import { notFound } from "next/navigation";

import type { Metadata, ResolvingMetadata } from "next";

import { Box } from "@chakra-ui/react";

import { getNotebookData, getNotebookMetaData } from "@/lib/storage";

import NotebookView from "./components/notebookView";

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

export default async function Page({ params: { id } }: Props) {
    const notebook = await getNotebookData(id);
    if (!notebook) {
        return notFound();
    }
    // TODO: add error boundaries
    return (
        <>
            {/* <header>
                <Heading>{notebook.title}</Heading>
            </header> */}
            <main>
                <Box
                    w="full"
                    maxW="4xl"
                    p={5}
                    bg="white"
                    shadow="lg"
                    rounded="md"
                >
                    {/* TODO: add suspense */}
                    <NotebookView notebook={notebook} />
                </Box>
            </main>
        </>
    );
}
