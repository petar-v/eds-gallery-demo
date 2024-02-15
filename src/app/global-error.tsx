"use client";
import React from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <h2>Something went wrong!</h2>
                <p>{error.message || error.digest}</p>
                <button onClick={() => reset()}>Try again</button>
            </body>
        </html>
    );
}