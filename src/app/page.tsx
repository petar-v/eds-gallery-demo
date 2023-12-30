import { getNotebookPreviews } from "@/lib/storage";

import Gallery from "./components/gallery";
import { Suspense } from "react";

export default async function Page() {
    const notebooksPreviews = await getNotebookPreviews();

    // TODO: add error boundaries
    return (
        <main>
            <Suspense fallback={<h1>Loading...</h1>}>
                <Gallery notebooks={notebooksPreviews} />
            </Suspense>
        </main>
    );
}
