-- Up
CREATE TABLE accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL,
    provider        TEXT NOT NULL,
    provider_id     TEXT,
    password_hash   TEXT,

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_provider_account UNIQUE (provider, provider_id)
);

-- Down
-- DROP TABLE accounts;
