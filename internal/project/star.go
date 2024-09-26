package project

import (
	"database/sql"
	"fmt"

	"github.com/imshawan/RefineIt/helpers"
	"github.com/imshawan/RefineIt/infra/database"
	"github.com/lib/pq"
)

func Star(projectID string, userID string) error {
	if ok, err := hasStarred(projectID, userID); err != nil {
		return err
	} else if ok {
		return nil
	}
	id, _err := helpers.GenerateUUID()
	if _err != nil {
		return _err
	}

	insertQuery := `INSERT INTO stars (id, user_id, project_id) VALUES ($1, $2, $3)`
	_, err := database.Client.Exec(insertQuery, id, userID, projectID)

	if err != nil {
		// Handling the specific PostgreSQL error codes
		if pqErr, ok := err.(*pq.Error); ok {
			switch pqErr.Code {
			case "23505": // Unique violation
				return fmt.Errorf("user has already starred this project")
			case "23503": // Foreign key violation
				return fmt.Errorf("user or project not found")
			default:
				return fmt.Errorf("database error: %v", pqErr.Message)
			}
		}
		// Handling other generic errors
		return fmt.Errorf("error starring project: %v", err)
	}

	return nil
}

func UnStar(projectID string, userID string) error {
	if ok, err := hasStarred(projectID, userID); err != nil {
		return err
	} else if !ok {
		return nil
	}

	deleteQuery := `DELETE FROM stars WHERE user_id = $1 AND project_id = $2`
	_, err := database.Client.Exec(deleteQuery, userID, projectID)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			switch pqErr.Code {
			case "23503":
				return fmt.Errorf("user or project not found")
			default:
				return fmt.Errorf("database error: %v", pqErr.Message)
			}
		}
		return fmt.Errorf("error unstarring project: %v", err)
	}

	return nil
}

func hasStarred(projectID string, userID string) (bool, error) {
	var exists int
	query := `SELECT 1 FROM stars WHERE user_id = $1 AND project_id = $2 LIMIT 1`

	err := database.Client.QueryRow(query, userID, projectID).Scan(&exists)

	if err != nil {
		if err == sql.ErrNoRows {
			return false, nil // User has not starred the project
		}
		return false, fmt.Errorf("error checking if user starred project: %v", err)
	}

	return true, nil // User has starred the project
}
