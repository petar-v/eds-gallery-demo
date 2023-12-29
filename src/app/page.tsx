import { getNotebooks } from "@/lib/storage";

import Gallery from "./components/gallery";

export default async function Page() {
    const notebooks = await getNotebooks();
    return (
        <main>
            <Gallery notebooks={notebooks} />
        </main>
    );
}
