import React from "react";
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
    LinkBox,
    LinkOverlay,
    Highlight,
} from "@chakra-ui/react";

import { NotebookMetadata } from "@/definitions/Notebook";
import { CardFooter } from "react-bootstrap";
import ColorfulTag from "@/components/ColorfulTag";
import { notebookToUrl } from "@/lib/nav";

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

const containsStringCi = (str: string, search: string[]) => {
    const cleanedStr = str.trim().toLowerCase();
    const res = search
        .filter((s) => s.length > 0)
        .find((s) => cleanedStr.includes(s.trim().toLocaleLowerCase()));
    return !!res;
};

export default function NotebookCard({
    notebook,
    highlight,
}: {
    notebook: NotebookMetadata;
    highlight?: string;
}) {
    const { title, author, tags, image } = notebook;
    const query = highlight?.split(" ");

    return (
        <LinkBox as="article" maxW="sm" rounded="md">
            <Card size="sm">
                <CardHeader>
                    <LinkOverlay href={notebookToUrl(notebook)}>
                        <Heading size="xs">
                            <Highlight
                                query={query || []}
                                styles={{
                                    px: "1",
                                    py: "1",
                                    rounded: "full",
                                    bg: "teal.100",
                                }}
                            >
                                {title}
                            </Highlight>
                        </Heading>
                    </LinkOverlay>
                </CardHeader>
                <CardBody>
                    {image && <Image maxH="10em" alt={title} src={image} />}
                </CardBody>
                <CardFooter>
                    <Box p={3}>{author && <AuthorTag author={author} />}</Box>
                    <Divider m={0} />
                    <Box p={3}>
                        <Flex wrap="wrap" direction="row" gap={2}>
                            {tags.map((tag, i) => {
                                const match =
                                    query && containsStringCi(tag, query);
                                const radius = match ? "none" : "full";
                                const variant = match ? "solid" : "subtle";
                                return (
                                    <ColorfulTag
                                        key={`tag-${i}`}
                                        size="sm"
                                        tag={tag}
                                        borderRadius={radius}
                                        variant={variant}
                                    />
                                );
                            })}
                        </Flex>
                    </Box>
                </CardFooter>
            </Card>
        </LinkBox>
    );
}
