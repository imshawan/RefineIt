-- +goose Up
-- +goose StatementBegin
BEGIN;

SET TIME ZONE 'UTC';

CREATE OR REPLACE FUNCTION add_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMIT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP FUNCTION IF EXISTS add_updated_at;
-- +goose StatementEnd