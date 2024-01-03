"use client";

import React, { useRef } from "react";

import { Flex, Container, Heading, Box } from "@chakra-ui/react";
import { HamburgerIcon, InfoIcon } from "@chakra-ui/icons";

import Notebook from "@/definitions/Notebook";

import TableOfContents from "./tableOfContents";
import ColorfulTag from "@/components/ColorfulTag";

import Ipynb from "./Ipynb";

export default function NotebookView({ notebook }: { notebook: Notebook }) {
    const notebookRef = useRef<HTMLDivElement>(null);
    return (
        <Flex direction={{ base: "column", md: "row" }} maxW="100%" px={4}>
            <Box
                flex="0 0 20%"
                maxW={{ base: "100%", md: "20%" }}
                mb={5}
                pt={1}
            >
                <Container>
                    <Heading noOfLines={1} size="sm">
                        <HamburgerIcon mr={1} />
                        Contents
                    </Heading>
                    <nav>
                        <TableOfContents
                            source={notebookRef}
                            // maxDepth={3}
                            insertIDs={true}
                        />
                    </nav>
                </Container>
                <Container>
                    <Heading noOfLines={1} size="sm">
                        <InfoIcon mr={1} />
                        Notebook Information
                    </Heading>
                    {notebook.author && (
                        <Box mb={4} fontSize="sm">
                            Author: {notebook.author}
                        </Box>
                    )}
                    {notebook.tags.length > 0 && (
                        <Flex wrap="wrap" direction="row" gap={2}>
                            {notebook.tags.map((tag, i) => (
                                <ColorfulTag
                                    size="md"
                                    tag={tag}
                                    key={`tag-${i}`}
                                />
                            ))}
                        </Flex>
                    )}
                </Container>
            </Box>
            <Box flex="0 1 80%" maxW={{ base: "100%", md: "80%" }} pr={3}>
                <article>
                    <Ipynb ref={notebookRef} ipynb={notebook.data} />
                </article>
            </Box>
        </Flex>
    );
}
