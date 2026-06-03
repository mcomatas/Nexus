-- Up
CREATE TABLE games (
    igdb_id         INTEGER PRIMARY KEY,
    title           TEXT NOT NULL,
    slug            TEXT,
    cover_url       TEXT,
    artwork_url     TEXT,
    description     TEXT,
    release_year    INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Down
-- DROP TABLE games;
