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

import { NotebookMetadata } from "@/definitions/Notebook";
import NotebookCard from "./notebookCard";
import { notebookToUrl } from "@/lib/nav";

export default function Gallery({
    notebooks,
}: {
    notebooks: NotebookMetadata[];
}) {
    const router = useRouter();

    const openNotebook = (nmd: NotebookMetadata) => {
        router.push(notebookToUrl(nmd));
    };

    return (
        <VStack align="center" direction="column" p={5} spacing={4}>
            <Heading>EDS Books Gallery</Heading>
            <Link
                href="/upload-book"
                color="blue.400"
                _hover={{ color: "blue.500" }}
            >
                Upload a book
            </Link>

            <Box w="full" bg="white" rounded="md">
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
                w="full"
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
