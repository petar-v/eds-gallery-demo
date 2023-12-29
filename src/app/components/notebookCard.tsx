import { Heading, CardHeader, Stack, Card, Badge } from "@chakra-ui/react";

import Notebook from "@/definitions/Notebook";
import { CardFooter } from "react-bootstrap";

export default function NotebookCard({
    notebook,
    onClick,
}: {
    notebook: Notebook;
    onClick?: (n: Notebook) => void;
}) {
    return (
        <Card
            onClick={() => {
                onClick && onClick(notebook);
            }}
            cursor={onClick ? "pointer" : undefined}
        >
            <CardHeader>
                <Heading size="md">{notebook.title}</Heading>
            </CardHeader>
            <CardFooter>
                <Stack direction="row">
                    {notebook.tags.map((tag, i) => (
                        <Badge key={`tag-${i}`}>tag</Badge>
                    ))}
                </Stack>
            </CardFooter>
        </Card>
    );
}
