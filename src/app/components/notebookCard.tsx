import { Heading, CardHeader, Card } from "@chakra-ui/react";

import Notebook from "@/definitions/Notebook";

export default function NotebookCard({ notebook, onClick }: { notebook: Notebook, onClick?: (n: Notebook) => void }) {
    return (
        <Card onClick={() => {onClick && onClick(notebook)}} cursor={onClick ? "pointer" : undefined}>
            <CardHeader>
                <Heading size="md">{notebook.title}</Heading>
            </CardHeader>
        </Card>
    );
}
