import type { Metadata } from "next";

import React from "react";

import Gallery from "./components/gallery";
import { getNotebookPreviews } from "@/lib/storage";

export const metadata: Metadata = {
    title: "EDS Book Gallery",
    description:
        "Environmental Data Science book or EDS book is a living, open and community-driven online resource to showcase and support the publication of data, research and open-source tools for collaborative, reproducible and transparent Environmental Data Science.",
};

const Page = async () => {
    const notebooksPreviews = await getNotebookPreviews();

    // TODO: add error boundaries
    return (
        <main>
            {/* <Suspense fallback={<h1>Loading...</h1>}> */}
            <Gallery notebooks={notebooksPreviews} />
            {/* </Suspense> */}
        </main>
    );
};

export default Page;
