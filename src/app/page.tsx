"use client"; // TODO: use server components

import { Link } from "@chakra-ui/next-js";

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col p-6">
            <h1>hello!</h1>
            <Link
                href="/upload-book"
                color="blue.400"
                _hover={{ color: "blue.500" }}
            >
                Upload a book
            </Link>
        </main>
    );
}
