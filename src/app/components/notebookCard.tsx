import { Heading, CardHeader, Card, Badge, Flex } from "@chakra-ui/react";

import Notebook from "@/definitions/Notebook";
import { CardFooter } from "react-bootstrap";
import ColorfulTag from "@/components/ColorfulTag";

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
                <Flex direction="row" p={3} gap={2} wrap="wrap">
                    {notebook.tags.map((tag, i) => (
                        <ColorfulTag key={`tag-${i}`} tag={tag} />
                    ))}
                </Flex>
            </CardFooter>
        </Card>
    );
}
