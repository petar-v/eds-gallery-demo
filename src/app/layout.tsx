import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

import "@/styles/globals.scss";

import React from "react";
import NavBar from "./components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "EDS Book",
    description:
        "Environmental Data Science book or EDS book is a living, open and community-driven online resource to showcase and support the publication of data, research and open-source tools for collaborative, reproducible and transparent Environmental Data Science.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <nav>
                        <NavBar />
                    </nav>
                    {children}
                    {/* <footer>Created by Petar Vasilev</footer> */}
                </Providers>
            </body>
        </html>
    );
}
