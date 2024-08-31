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
        last_login TIMESTAMPTZ,
        profile_picture TEXT DEFAULT '',
        bio TEXT DEFAULT '',
        phone_number VARCHAR(20),
        location TEXT DEFAULT '',
        reviews_count INT DEFAULT 0,
        projects_count INT DEFAULT 0,
        feedbacks_given INT DEFAULT 0,
        feedbacks_received INT DEFAULT 0,
        user_settings JSONB DEFAULT '{}'::jsonb, -- Storing user-specific settings as JSONB
        account_type VARCHAR(20), -- Optional field for user account type (e.g., standard, premium)
        two_factor_enabled BOOLEAN DEFAULT FALSE, -- Indicates if 2FA is enabled
        sign_up_source VARCHAR(50), -- Optional field for tracking the sign-up source
        last_password_change TIMESTAMPTZ,
        suspended BOOLEAN DEFAULT FALSE, -- Indicates if the user account is suspended
        email_verified BOOLEAN DEFAULT FALSE, -- Indicates if the user's email has been verified
        timezone VARCHAR(50) DEFAULT 'Asia/Kolkata', -- Optional field for user's timezone
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

CREATE INDEX idx_users_name ON users (fullname);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_users_role ON users (role);

CREATE TRIGGER add_updated_at BEFORE
UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE add_updated_at ();

COMMIT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
BEGIN;

DROP TRIGGER IF EXISTS add_updated_at ON users;
DROP TYPE IF EXISTS role_type CASCADE;
DROP TABLE IF EXISTS users;

COMMIT;
-- +goose StatementEnd
