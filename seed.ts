import * as fs from "fs";
import * as path from "path";

import { parseNotebook } from "./src/lib/notebooks";
import {
    addNotebook,
    clearDatabase,
    configureDatabase,
    disconnectDatabase,
} from "./src/lib/storage";

const sampleDataDir = "./sample-data";

const readNotebookFiles = (directory: string): string[] => {
    const notebookFiles: string[] = [];

    // Read the contents of the directory
    const files = fs.readdirSync(directory);

    // Iterate over each file in the directory
    files.forEach((file) => {
        const filePath = path.join(directory, file);

        // Check if it's a Jupyter notebook file (assuming .ipynb extension)
        if (path.extname(filePath) === ".ipynb") {
            // Read the contents of the file as text
            const fileContents = fs.readFileSync(filePath, "utf-8");
            notebookFiles.push(fileContents);
        }
    });

    return notebookFiles;
};

configureDatabase()
    .then(async () => {
        console.log("Ran migrations.");

        await clearDatabase();
        console.log("Cleaned up old records.");

        const insertPromises = readNotebookFiles(sampleDataDir).map(
            async (notebookJson: string) => {
                const notebook = await parseNotebook(notebookJson);
                return addNotebook(notebook).then((id) => {
                    console.log(`Inserted book ${id}: ${notebook.title}`);
                });
            },
        );

        await Promise.all(insertPromises);

        console.log("Closing database...");
        disconnectDatabase();
        console.log("Done!");
    })
    .catch((err) => {
        console.error("Failed to configure the database", err);
    });
