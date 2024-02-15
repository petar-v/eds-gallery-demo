import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";

import React from "react";
import NavBar from "./components/header";
import Footer from "./components/footer";
import { Box, CSSReset, Flex } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "EDS Book",
    description:
        "Environmental Data Science book or EDS book is a living, open and community-driven online resource to showcase and support the publication of data, research and open-source tools for collaborative, reproducible and transparent Environmental Data Science.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
    <html lang="en">
        <body className={inter.className}>
            <Providers>
                <CSSReset />
                <Flex direction="column" h="100vh">
                    <Box flex="none">
                        <NavBar />
                    </Box>
                    <Box flex="1 0 auto">{children}</Box>
                    <Box flex="none">
                        <Footer />
                    </Box>
                </Flex>
            </Providers>
        </body>
    </html>
);

export default RootLayout;
