"use client";

import React from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";

import DefaultTheme from "@/themes/default";

const Providers = ({ children }: { children: React.ReactNode }) => (
    <CacheProvider>
        <ChakraProvider theme={DefaultTheme}>{children}</ChakraProvider>
    </CacheProvider>
);

export default Providers;
