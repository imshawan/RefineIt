package user

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/imshawan/RefineIt/helpers"
	"github.com/imshawan/RefineIt/infra/database"
	"github.com/imshawan/RefineIt/models"
	"github.com/lib/pq"
)

var PublicFields = []string{"id", "username", "email", "fullname", "created_at", "updated_at", "is_active"}

// GetUserByField retrieves a user by a specified field and value
func GetUserByField(ctx *gin.Context, field string, value string, includePasswordHash ...bool) (models.User, error) {
	var user models.User

	includePassword := false
    if len(includePasswordHash) > 0 {
        includePassword = includePasswordHash[0]
    }

	// Sanitize and validate the field and value
	sanitizedField, sanitizedValue, err := sanitizeFieldAndValue(field, value)
	if err != nil {
		return user, fmt.Errorf("invalid input: %w", err)
	}

	fields := []string{"id", "username", "email", "password_hash", "fullname", "created_at", "updated_at", "is_active"}

	// Build the query
	query := fmt.Sprintf("SELECT %s FROM users WHERE %s = $1", strings.Join(fields, ", "), sanitizedField)

	// Execute the query with the parameterized value
	row := database.Client.QueryRowContext(ctx, query, sanitizedValue)

	// Use = to assign to err since err is already declared
	err = row.Scan(&user.ID, &user.Username, &user.Email, &user.PasswordHash, &user.Fullname, &user.CreatedAt, &user.UpdatedAt, &user.IsActive)
	if err != nil {
		if err == sql.ErrNoRows {
			return user, fmt.Errorf("no such user")
		}
		return user, err
	}

	if !includePassword {
		user.PasswordHash = ""
	}

	return user, nil
}

func CreateUser(user models.User) (models.User, error) {
    // Insert the user and return all relevant columns
    query := `
    INSERT INTO users (id, username, email, password_hash, fullname, created_at, updated_at, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, username, email, password_hash, fullname, created_at, updated_at, is_active
    `

    err := database.Client.QueryRow(query, user.ID, user.Username, user.Email, user.PasswordHash, user.Fullname, user.CreatedAt, user.UpdatedAt, user.IsActive).Scan(
        &user.ID, &user.Username, &user.Email, &user.PasswordHash, &user.Fullname, &user.CreatedAt, &user.UpdatedAt, &user.IsActive,
    )
    if err != nil {
		// Check for unique violation error code
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
			return user, fmt.Errorf(helpers.ExtractUniqueFieldError(pqErr.Detail))
		}
        return user, fmt.Errorf("error inserting user into the database: %w", err)
    }

    return user, nil
}


// sanitizeFieldAndValue ensures the field is valid and sanitizes the value
func sanitizeFieldAndValue(field, value string) (string, string, error) {
	// Trim leading and trailing whitespace
	field = strings.TrimSpace(field)
	value = strings.TrimSpace(value)

	// List of valid fields
	validFields := map[string]struct{}{
		"id":       {},
		"username": {},
		"email":    {},
		"fullname": {},
	}

	// Check if the field is valid
	if _, valid := validFields[field]; !valid {
		return "", "", fmt.Errorf("invalid field: %s", field)
	}

	// Sanitize the value based on field type if necessary
	// For simplicity, assuming all values are strings and basic trimming is sufficient
	return field, value, nil
}
