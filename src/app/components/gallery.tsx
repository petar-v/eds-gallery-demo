"use client";

import { Link } from "@chakra-ui/next-js";
import {
    Box,
    Heading,
    VStack,
    Input,
    InputLeftElement,
    InputGroup,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

import Notebook from "@/definitions/Notebook";

export default function Gallery({ notebooks }: { notebooks: Notebook[] }) {
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
            <p>Books: {notebooks.length}</p>
            {notebooks.map((book, i) => (
                <p key={i}>{book.title}</p>
            ))}
        </VStack>
    );
}
