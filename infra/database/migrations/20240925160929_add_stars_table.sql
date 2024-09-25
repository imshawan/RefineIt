-- +goose Up
-- +goose StatementBegin
BEGIN;

CREATE TABLE
    IF NOT EXISTS stars (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL, -- Foreign key linking to the users table
    project_id TEXT NOT NULL, -- Foreign key linking to the projects table
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE (user_id, project_id) -- Ensure a user can only star a project once
);

CREATE INDEX idx_stars_user_id ON stars(user_id);
CREATE INDEX idx_stars_project_id ON stars(project_id);

-- Create composite index on (user_id, project_id) to optimize lookups involving both columns
CREATE INDEX idx_stars_user_project ON stars(user_id, project_id);

COMMIT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
BEGIN;

DROP INDEX IF EXISTS idx_stars_user_project;
DROP INDEX IF EXISTS idx_stars_project_id;
DROP INDEX IF EXISTS idx_stars_user_id;
DROP TABLE IF EXISTS stars;

COMMIT;
-- +goose StatementEnd
