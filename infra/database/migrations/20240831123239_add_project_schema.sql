-- +goose Up
-- +goose StatementBegin
BEGIN;

CREATE TABLE
    IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    review_type VARCHAR(255) NOT NULL,
    repository_url TEXT,
    filename TEXT NOT NULL,
    file_url TEXT NOT NULL,
    visibility VARCHAR(7) NOT NULL CHECK (visibility IN ('public', 'private')),
    owner_id INT NOT NULL, -- Foreign key to the user who owns the project
    tags TEXT[], -- Array of tags related to the project
    reviews_count INT DEFAULT 0, -- Number of reviews received
    stars_count INT DEFAULT 0, -- Number of stars or likes received
    last_reviewed_at TIMESTAMPTZ, -- Timestamp of the last review
    is_featured BOOLEAN DEFAULT FALSE, -- Whether the project is featured or not
    contributors_count INT DEFAULT 0, -- Number of contributors
    collaborators INT[], -- Array of user IDs who are collaborators
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')), -- Priority field with validation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for faster querying
CREATE INDEX idx_projects_name ON projects (name);
CREATE INDEX idx_projects_review_type ON projects (review_type);
CREATE INDEX idx_projects_owner_id ON projects (owner_id);
CREATE INDEX idx_projects_visibility ON projects (visibility);
CREATE INDEX idx_projects_last_reviewed_at ON projects (last_reviewed_at);
CREATE INDEX idx_projects_is_featured ON projects (is_featured);

CREATE TRIGGER add_updated_at BEFORE
UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE add_updated_at ();

COMMIT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
BEGIN;

DROP TRIGGER IF EXISTS add_updated_at ON projects;
DROP TABLE IF EXISTS projects;

COMMIT;
-- +goose StatementEnd
