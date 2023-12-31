import "@/styles/globals.scss";

import React from "react";
import { VStack } from "@chakra-ui/react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <VStack p={5} spacing={2}>
            {children}
        </VStack>
    );
}
