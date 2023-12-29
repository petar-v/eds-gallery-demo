import { Heading, CardHeader, Card, Badge, Flex } from "@chakra-ui/react";

import Notebook from "@/definitions/Notebook";
import { CardFooter } from "react-bootstrap";

const colors = [
    "gray",
    "red",
    "orange",
    "yellow",
    "green",
    "teal",
    "blue",
    "cyan",
    "purple",
    "pink",
    "linkedin",
    "facebook",
    "messenger",
    "whatsapp",
    "twitter",
    "telegram",
];

const ColorfulBadge = ({ tag }: { tag: string }) => {
    const hashString = tag
        .split("")
        .map((char) => char.charCodeAt(0))
        .reduce((a, b) => a + b, 0);

    const color = colors[hashString % colors.length];
    return <Badge colorScheme={color}>{tag}</Badge>;
};

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
                        <ColorfulBadge key={`tag-${i}`} tag={tag} />
                    ))}
                </Flex>
            </CardFooter>
        </Card>
    );
}
