import {
    Heading,
    CardHeader,
    Card,
    Badge,
    Flex,
    CardBody,
} from "@chakra-ui/react";

import { NotebookMetadata } from "@/definitions/Notebook";
import { CardFooter } from "react-bootstrap";
import ColorfulTag from "@/components/ColorfulTag";

export default function NotebookCard({
    notebook,
    onClick,
}: {
    notebook: NotebookMetadata;
    onClick?: (n: NotebookMetadata) => void;
}) {
    return (
        <Card
            cursor={onClick ? "pointer" : undefined}
            onClick={() => {
                onClick && onClick(notebook);
            }}
        >
            <CardHeader>
                <Heading size="md">{notebook.title}</Heading>
            </CardHeader>
            <CardBody></CardBody>
            <CardFooter>
                <Flex wrap="wrap" direction="row" gap={2} p={3}>
                    {notebook.tags.map((tag, i) => (
                        <ColorfulTag key={`tag-${i}`} tag={tag} />
                    ))}
                </Flex>
            </CardFooter>
        </Card>
    );
}
