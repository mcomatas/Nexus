-- Up
CREATE TABLE games (
    igdb_id         INTEGER PRIMARY KEY,
    title           TEXT NOT NULL,
    slug            TEXT,
    cover_url       TEXT,
    description     TEXT,
    release_year    INTEGER
);

-- Down
-- DROP TABLE games;
