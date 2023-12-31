"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";

import {
    Box,
    Heading,
    Input,
    InputLeftElement,
    InputGroup,
    SimpleGrid,
    Flex,
    Image,
    Text,
    Button,
    InputRightElement,
    IconButton,
} from "@chakra-ui/react";
import { Search2Icon, SmallCloseIcon } from "@chakra-ui/icons";

import { NotebookMetadata } from "@/definitions/Notebook";
import NotebookCard from "./notebookCard";
import notebooksSearcher, { SearcherType } from "@/lib/search";

const SearchBar = ({
    onSearch,
    query,
}: {
    query: string;
    onSearch: (query: string) => void;
}) => {
    const update = (val: string) => {
        onSearch && onSearch(val);
    };
    return (
        <Box w="full" bg="white" rounded="md">
            <InputGroup size="md">
                <InputLeftElement pointerEvents="none">
                    <Search2Icon color="gray.300" />
                </InputLeftElement>
                <Input
                    pr="6rem"
                    bg="white"
                    onChange={(event) => update(event.target.value.trim())}
                    placeholder="Try the Fuzzy search here"
                    value={query}
                    variant="filled"
                />
                {query.length > 0 && (
                    <InputRightElement>
                        <IconButton
                            aria-label="Clear Search"
                            icon={<SmallCloseIcon />}
                            onClick={() => update("")}
                            size="sm"
                            variant="solid"
                            // colorScheme="blackAlpha"
                        />
                    </InputRightElement>
                )}
            </InputGroup>
        </Box>
    );
};

const EmptySearchResults = ({
    query,
    onClear,
}: {
    query: string;
    onClear: () => void;
}) => (
    <Flex align="center" direction="column">
        <Image
            boxSize="300px"
            maxW="md"
            objectFit="cover"
            alt="No notebooks here."
            src="/not-found.svg"
        />
        <Heading>Nothing found.</Heading>
        <Text>
            No results have been found for: <strong>{query}</strong>
        </Text>
        <Button
            colorScheme="blue"
            leftIcon={<SmallCloseIcon />}
            onClick={onClear}
        >
            Clear Search
        </Button>
    </Flex>
);

const NotebooksDisplay = ({ notebooks }: { notebooks: NotebookMetadata[] }) => {
    const [query, setQuery] = useState("");

    // Some heavy caching for the searching. Currently the search is client-side only.
    // TODO: make this server side.
    const searcher = useRef<SearcherType>();
    useEffect(() => {
        searcher.current = notebooksSearcher(notebooks);
    }, [notebooks]);

    const filtered = useMemo(
        () =>
            query.length === 0
                ? notebooks
                : searcher.current?.search(query) || [],
        [query],
    );

    return (
        <>
            <SearchBar query={query} onSearch={setQuery} />

            {filtered.length === 0 ? (
                <EmptySearchResults
                    query={query}
                    onClear={() => setQuery("")}
                />
            ) : (
                <SimpleGrid
                    templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                    w="full"
                    spacing={4}
                >
                    {/* TODO: maybe use wrap with wrap element */}
                    {filtered.map((book, i) => (
                        // TODO: add highlight for matched strings
                        <NotebookCard notebook={book} key={`notebook-${i}`} />
                    ))}
                </SimpleGrid>
            )}
        </>
    );
};

export default NotebooksDisplay;
