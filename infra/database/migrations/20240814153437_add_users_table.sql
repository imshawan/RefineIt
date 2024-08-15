-- +goose Up
-- +goose StatementBegin
BEGIN;

CREATE TYPE role_type AS ENUM ('user', 'admin');

CREATE TABLE
    IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
		username VARCHAR(20) UNIQUE NOT NULL,
		email VARCHAR(255) UNIQUE NOT NULL,
		password_hash VARCHAR(255) NOT NULL,
		fullname VARCHAR(20) NOT NULL,
		is_active BOOLEAN DEFAULT TRUE,
        role role_type DEFAULT 'user',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_updated_at BEFORE
UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE set_updated_at ();

COMMIT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
BEGIN;

DROP TRIGGER IF EXISTS set_user_updated_at ON users;
DROP FUNCTION IF EXISTS set_updated_at();
DROP TYPE IF EXISTS role_type CASCADE;
DROP TABLE IF EXISTS users;

COMMIT;
-- +goose StatementEnd
