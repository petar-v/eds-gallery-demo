import { configureDatabase, disconnectDatabase } from "./lib/storage";

export async function register() {
    console.log("Configuring the database...");
    await configureDatabase();
    console.log("Database configured!");

    const shutdown = (code: number) => {
        console.log(`Shutting down database with code ${code}...`);
        disconnectDatabase();
    };

    process.on("exit", shutdown);
    process.on("SIGHUP", () => process.exit(128 + 1));
    process.on("SIGINT", () => process.exit(128 + 2));
    process.on("SIGTERM", () => process.exit(128 + 15));
}
