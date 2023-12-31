"use client";

import { Link } from "@chakra-ui/next-js";
import { useRouter } from "next/navigation";
import {
    Box,
    Heading,
    VStack,
    Input,
    InputLeftElement,
    InputGroup,
    SimpleGrid,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { convert as slugify } from "url-slug";

import { NotebookMetadata } from "@/definitions/Notebook";
import NotebookCard from "./notebookCard";

export default function Gallery({
    notebooks,
}: {
    notebooks: NotebookMetadata[];
}) {
    const router = useRouter();

    const openNotebook = ({ id, title }: NotebookMetadata) => {
        const slug = slugify(title, { camelCase: true });
        router.push(`/${id}/${slug}`);
    };

    return (
        <VStack
            align="center"
            direction="column"
            h="100vh"
            p={5}
            bg="gray.100"
            spacing={4}
        >
            <Heading>EDS Books Gallery</Heading>
            <Link
                href="/upload-book"
                color="blue.400"
                _hover={{ color: "blue.500" }}
            >
                Upload a book
            </Link>

            <Box w="100%" bg="white" rounded="md">
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <Search2Icon boxSize="1.2em" color="gray.300" />
                    </InputLeftElement>
                    <Input
                        bg="white"
                        placeholder="Search in the gallery"
                        size="lg"
                        variant="filled"
                    />
                </InputGroup>
            </Box>
            <Box w="full" maxW="lg" bg="white" shadow="lg" rounded="md"></Box>
            <p>Number of Notebooks: {notebooks.length}</p>
            <SimpleGrid
                templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                spacing={4}
            >
                {notebooks.map((book, i) => (
                    <NotebookCard
                        notebook={book}
                        key={`notebook-${i}`}
                        onClick={openNotebook}
                    />
                ))}
            </SimpleGrid>
        </VStack>
    );
}
