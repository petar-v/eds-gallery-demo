"use client";

import React from "react";

import { ChakraProvider } from "@chakra-ui/react";
import DefaultTheme from "@/themes/default";

export function Providers({ children }: { children: React.ReactNode }) {
    return <ChakraProvider theme={DefaultTheme}>{children}</ChakraProvider>;
}
