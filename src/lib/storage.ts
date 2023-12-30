import { Pool, PoolConnection } from "better-sqlite-pool";
import { migrate } from "@blackglory/better-sqlite3-migrations";
import { map } from "extra-promise";
import { findMigrationFilenames, readMigrationFile } from "migration-files";
// could also use typeorm.io for the actual product if not going with a off-the-shelf cms

import Notebook, { NotebookMetadata } from "@/definitions/Notebook";

const DATABASE_FILE = "./notebooks.db";
const MIGRATIONS_DIR = "./migrations";

const TABLE = "notebooks";

const pool = new Pool(DATABASE_FILE);

// Need to call this once on server setup
export const configureDatabase = async () => {
    const filenames = await findMigrationFilenames(MIGRATIONS_DIR);
    const migrations = await map(filenames, readMigrationFile);
    console.log("Migrations:");
    migrations.forEach((m) => console.log(m.version, m.name));
    // run migrations
    const db = await pool.acquire();
    migrate(db, migrations);
    db.release();
};

export const disconnectDatabase = async () => {
    pool.close();
};

export const clearDatabase = async () => {
    const db: PoolConnection = await pool.acquire();
    db.exec(`DELETE FROM ${TABLE}`);
    db.release();
};

const serializeTags = (tags: string[]) => tags.map((t) => t.trim()).join(",");
const deserializeTags = (tags: string) => tags.split(",").map((t) => t.trim());

export const getNotebookPreviews = async (): Promise<NotebookMetadata[]> => {
    const db = await pool.acquire();
    let allBooks = db
        .prepare(`SELECT id, title, author, tags, image FROM ${TABLE}`)
        .all();
    db.release();

    return allBooks.map((res: any) => ({
        ...(res as NotebookMetadata),
        tags: deserializeTags(res.tags),
    }));
};

// TODO: add some type safety around IDs
export const addNotebook = async (notebook: Notebook): Promise<number> => {
    const db = await pool.acquire();
    const insert = db.prepare(
        `INSERT INTO ${TABLE} (title, author, tags, image, data) VALUES (@title, @author, @tags, @image, @data)`,
    );

    const insertNotebook = db.transaction((notebook: Notebook) => {
        return insert.run({
            ...notebook,
            author: notebook.author ? notebook.author : null,
            image: notebook.image ? notebook.image : null,
            tags: serializeTags(notebook.tags || []),
        });
    });
    const res = insertNotebook(notebook);
    db.release();

    return res.lastInsertRowid as number;
};

export const removeNotebookByID = async (id: number): Promise<number> => {
    const db = await pool.acquire();
    const del = db.prepare(`DELETE FROM ${TABLE} where id = @id`);
    const info = del.run({ id });
    db.release();
    return info.changes;
};

export const removeNotebook = async (nb: NotebookMetadata): Promise<number> => {
    if (nb.id) return removeNotebookByID(nb.id);
    throw new Error(`Notebook ID not provided for ${nb.title}`);
};

const notebooks: { [hash in string]: Notebook } = {};

export const searchNotebooks = async (query: string): Promise<Notebook[]> => {
    const byTitle = Object.values(notebooks).filter((notebook) =>
        notebook.title.includes(query),
    );

    // TODO: search by tags
    // dedupe
    return [...byTitle];
};
