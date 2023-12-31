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
    Link,
    Text,
    Button,
    InputRightElement,
    IconButton,
    Tooltip,
} from "@chakra-ui/react";
import { Search2Icon, SmallCloseIcon } from "@chakra-ui/icons";

import { NotebookMetadata } from "@/definitions/Notebook";
import NotebookCard from "./notebookCard";
import notebooksSearcher, { SearcherType } from "@/lib/search-fuse";

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
    const tooltip = (
        <>
            <Text>
                You can use{" "}
                <Link
                    href="https://www.fusejs.io/examples.html#extended-search"
                    isExternal
                >
                    unix-like search commands.
                </Link>
                White space acts as an AND operator, while a single pipe (|)
                character acts as an OR operator.
            </Text>
            <Text>
                Fuzzy search is not as accurate as a database. After all, this
                is just a demo app.
            </Text>
        </>
    );

    return (
        <Box w="full" bg="white" rounded="md">
            <Tooltip
                color="gray.900"
                bg="gray.200"
                closeDelay={1000}
                hasArrow
                label={tooltip}
            >
                <InputGroup size="md">
                    <InputLeftElement pointerEvents="none">
                        <Search2Icon color="gray.300" />
                    </InputLeftElement>
                    <Input
                        pr="6rem"
                        bg="white"
                        onChange={(event) => update(event.target.value)}
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
            </Tooltip>
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
                : (searcher.current && searcher.current(query)) || [],
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
                        <NotebookCard
                            notebook={book}
                            key={`notebook-${i}`}
                            highlight={query}
                        />
                    ))}
                </SimpleGrid>
            )}
        </>
    );
};

export default NotebooksDisplay;
