-- Up
CREATE TABLE game_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    igdb_id INTEGER NOT NULL,
    rating NUMERIC(3, 1),
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_game FOREIGN KEY (igdb_id) REFERENCES games(igdb_id),
    CONSTRAINT unique_user_game UNIQUE (user_id, igdb_id)
);

-- Down
-- DROP TABLE game_logs;
