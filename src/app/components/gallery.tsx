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
    Flex,
    Image,
    Text,
    Button,
} from "@chakra-ui/react";
import { AttachmentIcon, Search2Icon } from "@chakra-ui/icons";

import { NotebookMetadata } from "@/definitions/Notebook";
import NotebookCard from "./notebookCard";
import { notebookToUrl } from "@/lib/nav";

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

const SearchBar = () => (
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
);

export default function Gallery({
    notebooks,
}: {
    notebooks: NotebookMetadata[];
}) {
    const router = useRouter();

    const openNotebook = (nmd: NotebookMetadata) => {
        router.push(notebookToUrl(nmd));
    };
    const hasNotebooks = notebooks.length > 0;

    return (
        <VStack align="center" direction="column" p={5} spacing={4}>
            <Heading>EDS Books Gallery</Heading>

            {hasNotebooks && <SearchBar />}

            <Box w="full" maxW="lg" bg="white" shadow="lg" rounded="md"></Box>
            {hasNotebooks ? (
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
            ) : (
                <EmptyGallery />
            )}
        </VStack>
    );
}
