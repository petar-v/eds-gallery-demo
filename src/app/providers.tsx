"use client";

import React from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";

import DefaultTheme from "@/themes/default";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CacheProvider>
            <ChakraProvider theme={DefaultTheme}>{children}</ChakraProvider>
        </CacheProvider>
    );
}
