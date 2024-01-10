import React from "react";
import { Box, VStack } from "@chakra-ui/react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Box py={5}>
            <VStack align="center" spacing={2}>
                {children}
            </VStack>
        </Box>
    );
}
