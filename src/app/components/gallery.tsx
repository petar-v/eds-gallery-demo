"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";
import {
    Box,
    Heading,
    VStack,
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
import {
    AttachmentIcon,
    CloseIcon,
    Search2Icon,
    SmallCloseIcon,
} from "@chakra-ui/icons";
import { search, sortKind } from "fast-fuzzy";

import { NotebookMetadata } from "@/definitions/Notebook";
import NotebookCard from "./notebookCard";

const EmptyGallery = () => {
    const router = useRouter();

    return (
        <Flex align="center" direction="column">
            <Image
                boxSize="500px"
                maxW="lg"
                objectFit="cover"
                alt="No notebooks here."
                src="/no-results.svg"
            />
            <Heading>Oh no! No Notebooks here yet...</Heading>
            <Text>
                There are no EDS Jupyter notebook around. Luckily you can fix
                that by uploading some!
            </Text>
            <Button
                colorScheme="blue"
                leftIcon={<AttachmentIcon />}
                onClick={() => {
                    router.push("/upload-book");
                }}
            >
                Upload now
            </Button>
        </Flex>
    );
};

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
    const [value, setValue] = useState("");
    const update = (val: string) => {
        onSearch && onSearch(val);
        setValue(val);
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
                    placeholder="Type to search in the gallery"
                    value={value}
                    variant="filled"
                />
                {value.length > 0 && (
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

const filterNotebooks = (
    notebooks: NotebookMetadata[],
    query: string,
): NotebookMetadata[] => {
    const keySelector = ({ title, author, tags }: NotebookMetadata) => [
        title,
        author || "",
        ...tags,
    ];
    const results = search(query, notebooks, {
        keySelector,
        returnMatchData: true,
        ignoreCase: true,
        sortBy: sortKind.bestMatch,
    });
    return results.map((match) => match.item);
};

const NotebooksDisplay = ({ notebooks }: { notebooks: NotebookMetadata[] }) => {
    const [filtered, setFiltered] = useState(notebooks);

    const onSearch = (query: string) => {
        if (query.length === 0) {
            return setFiltered(notebooks);
        }
        setFiltered(filterNotebooks(notebooks, query));
    };

    return (
        <>
            <SearchBar onSearch={onSearch} />
            {/* TODO: maybe use wrap with wrap element */}
            <SimpleGrid
                templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                w="full"
                spacing={4}
            >
                {filtered.map((book, i) => (
                    // TODO: add highlight for matched strings
                    <NotebookCard notebook={book} key={`notebook-${i}`} />
                ))}
            </SimpleGrid>
        </>
    );
};

export default function Gallery({
    notebooks,
}: {
    notebooks: NotebookMetadata[];
}) {
    const hasNotebooks = notebooks.length > 0;
    return (
        <VStack align="center" direction="column" p={5} spacing={4}>
            <Heading>EDS Books Gallery</Heading>
            {hasNotebooks ? (
                <NotebooksDisplay notebooks={notebooks} />
            ) : (
                <EmptyGallery />
            )}
        </VStack>
    );
}
