--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
CREATE TABLE
    IF NOT EXISTS notebooks (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT,
        tags TEXT,
        image BLOB,
        data JSON NOT NULL,
        CONSTRAINT unique_title_author_tags UNIQUE (title, author, tags)
    );

CREATE INDEX IF NOT EXISTS idx_title ON notebooks (title);
CREATE INDEX IF NOT EXISTS idx_author ON notebooks (author);
CREATE INDEX IF NOT EXISTS idx_tags ON notebooks (tags);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP TABLE notebooks;