import {
    Heading,
    CardHeader,
    Card,
    Flex,
    CardBody,
    Avatar,
    Text,
    Box,
    Divider,
    Image,
} from "@chakra-ui/react";

import { NotebookMetadata } from "@/definitions/Notebook";
import { CardFooter } from "react-bootstrap";
import ColorfulTag from "@/components/ColorfulTag";

const AuthorTag = ({ author }: { author: string }) => (
    <Flex>
        <Avatar mr={1} name={author} size="sm" />
        <Flex direction="column">
            <Text m={0} fontSize="sm">
                {author}
            </Text>
            <Text m={0} fontSize="xs">
                Author
            </Text>
        </Flex>
    </Flex>
);

export default function NotebookCard({
    notebook,
    onClick,
}: {
    notebook: NotebookMetadata;
    onClick?: (n: NotebookMetadata) => void;
}) {
    const { title, author, tags, image } = notebook;
    return (
        <Card
            cursor={onClick ? "pointer" : undefined}
            onClick={() => {
                onClick && onClick(notebook);
            }}
            size="sm"
        >
            <CardHeader>
                <Heading size="xs">{title}</Heading>
            </CardHeader>
            <CardBody>
                {image && <Image maxH="10em" alt={title} src={image} />}
            </CardBody>
            <CardFooter>
                <Box p={3}>{author && <AuthorTag author={author} />}</Box>
                <Divider m={0} />
                <Box p={3}>
                    <Flex wrap="wrap" direction="row" gap={2}>
                        {tags.map((tag, i) => (
                            <ColorfulTag key={`tag-${i}`} size="sm" tag={tag} />
                        ))}
                    </Flex>
                </Box>
            </CardFooter>
        </Card>
    );
}
