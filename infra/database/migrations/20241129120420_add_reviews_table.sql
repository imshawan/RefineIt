-- +goose Up
-- +goose StatementBegin
BEGIN;

CREATE TABLE
    IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 0 AND rating <= 5),
    project_id TEXT NOT NULL,
    project_owner_id TEXT NOT NULL,
    reviewer_id TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'published', 'archived', 'flagged', 'rejected')),
    tags TEXT[],
    upvotes_count INT DEFAULT 0,
    downvotes_count INT DEFAULT 0,
    is_highlighted BOOLEAN DEFAULT FALSE,
    comments_count INT DEFAULT 0,
    last_commented_at TIMESTAMPTZ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT review_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT review_project_owner FOREIGN KEY (project_owner_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT review_reviewer FOREIGN KEY (reviewer_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_reviews_title ON reviews (title);
CREATE INDEX idx_reviews_rating ON reviews (rating);
CREATE INDEX idx_reviews_status ON reviews (status);
CREATE INDEX idx_reviews_project_id ON reviews (project_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews (reviewer_id);
CREATE INDEX idx_reviews_last_commented_at ON reviews (last_commented_at);
CREATE INDEX idx_reviews_is_highlighted ON reviews (is_highlighted);

CREATE TRIGGER add_updated_at BEFORE
UPDATE ON reviews FOR EACH ROW EXECUTE PROCEDURE add_updated_at ();

COMMIT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
BEGIN;

DROP TRIGGER IF EXISTS add_updated_at ON reviews;

DROP INDEX IF EXISTS idx_reviews_title;
DROP INDEX IF EXISTS idx_reviews_rating;
DROP INDEX IF EXISTS idx_reviews_status;
DROP INDEX IF EXISTS idx_reviews_project_id;
DROP INDEX IF EXISTS idx_reviews_reviewer_id;
DROP INDEX IF EXISTS idx_reviews_last_commented_at;
DROP INDEX IF EXISTS idx_reviews_is_highlighted;

DROP TABLE IF EXISTS reviews;

COMMIT;
-- +goose StatementEnd
