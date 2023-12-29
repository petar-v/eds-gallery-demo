import { getNotebooks } from "@/lib/storage";

import Gallery from "./components/gallery";
import { Suspense } from "react";

export default async function Page() {
    const notebooks = await getNotebooks();
    return (
        <main>
            <Suspense fallback={<h1>Loading</h1>}>
                <Gallery notebooks={notebooks} />
            </Suspense>
        </main>
    );
}
