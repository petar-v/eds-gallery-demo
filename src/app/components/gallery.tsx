"use client";

import { Link } from "@chakra-ui/next-js";
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

export default function Gallery({
    notebooks,
}: {
    notebooks: NotebookMetadata[];
}) {
    return (
        <VStack
            h="100vh"
            direction="column"
            bg="gray.100"
            align="center"
            p={5}
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

            <Box bg="white" w="100%" rounded="md">
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <Search2Icon boxSize="1.2em" color="gray.300" />
                    </InputLeftElement>
                    <Input
                        bg="white"
                        size="lg"
                        variant="filled"
                        placeholder="Search in the gallery"
                    />
                </InputGroup>
            </Box>
            <Box
                maxW="lg"
                w="full"
                bg="white"
                boxShadow="lg"
                rounded="md"
            ></Box>
            <p>Number of Notebooks: {notebooks.length}</p>
            <SimpleGrid
                spacing={4}
                templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
            >
                {notebooks.map((book, i) => (
                    <NotebookCard
                        notebook={book}
                        key={`notebook-${i}`}
                        onClick={(notebook) => {
                            alert("open " + notebook.title);
                        }}
                    />
                ))}
            </SimpleGrid>
        </VStack>
    );
}
