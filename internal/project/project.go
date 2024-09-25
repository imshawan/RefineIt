package project

import (
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/imshawan/RefineIt/helpers"
	"github.com/imshawan/RefineIt/infra/database"
	"github.com/imshawan/RefineIt/internal/user"
	"github.com/imshawan/RefineIt/models"
	"github.com/lib/pq"
)

var ProjectFields = []string{
	"id", "name", "slug", "description", "about", "review_type", "repository_url", "filename", "file_url", "visibility", "owner_id",
	"tags", "reviews_count", "stars_count", "last_reviewed_at", "is_featured", "contributors_count",
	"priority", "created_at", "updated_at",
}

func CreateProject(project models.Project) (models.Project, error) {

	if project.OwnerID == "" {
		return project, errors.New("owner_id is required")
	}

	if project.About == "" {
		project.About = "This project is about " + project.Name
	}

	if project.Tags == nil || len(project.Tags) == 0 {
		project.Tags = []string{}
	}

	if project.Priority == "" {
		project.Priority = "medium"
	} else {
		project.Priority = strings.ToLower(project.Priority)
	}

	if project.ReviewsCount == nil {
		defaultReviewsCount := 0
		project.ReviewsCount = &defaultReviewsCount
	}

	if project.StarsCount == nil {
		defaultStarsCount := 0
		project.StarsCount = &defaultStarsCount
	}

	if project.IsFeatured == nil {
		defaultIsFeatured := false
		project.IsFeatured = &defaultIsFeatured
	}

	if project.ContributorsCount == nil {
		defaultContributorsCount := int64(0)
		project.ContributorsCount = &defaultContributorsCount
	}

	if project.IsFeatured == nil {
		defaultIsFeatured := false
		project.IsFeatured = &defaultIsFeatured
	}

	now := time.Now()
	id, err := helpers.GenerateUUID()
	if err != nil {
		return project, err
	}

	project.ID = id
	project.CreatedAt = now
	project.UpdatedAt = now

	var ownerFields []string
	for _, field := range user.PublicFields {
		ownerFields = append(ownerFields, fmt.Sprintf("'%s', users.%s", field, field))
	}

	projectFields := strings.Join(ProjectFields, ", ")

	// Construct the SQL query with the returning clause

	count := len(ProjectFields)
	query := fmt.Sprintf("INSERT INTO projects (%s) VALUES (%s) RETURNING %s", projectFields, database.GeneratePlaceholders(count, "$%d"), projectFields)

	errs := database.Client.QueryRow(query, project.ID, project.Name, project.Slug, project.Description, project.About, project.ReviewType, project.RepositoryURL, project.Filename, project.FileUrl,
		project.Visibility, project.OwnerID, pq.Array(project.Tags), project.ReviewsCount, project.StarsCount,
		project.LastReviewedAt, project.IsFeatured, project.ContributorsCount,
		project.Priority, project.CreatedAt, project.UpdatedAt).Scan(&project.ID, &project.Name, &project.Slug, &project.Description, &project.About, &project.ReviewType, &project.RepositoryURL, &project.Filename, &project.FileUrl,
		&project.Visibility, &project.OwnerID, pq.Array(&project.Tags), &project.ReviewsCount, &project.StarsCount,
		&project.LastReviewedAt, &project.IsFeatured, &project.ContributorsCount,
		&project.Priority, &project.CreatedAt, &project.UpdatedAt)

	if errs != nil {
		// Check for unique violation error code
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
			return project, fmt.Errorf(helpers.ExtractUniqueFieldError(pqErr.Detail))
		}
		fmt.Println(errs)
		// Handle other errors
		return project, fmt.Errorf("error inserting project into the database")
	}

	var owner json.RawMessage
	ownerQuery := fmt.Sprintf("SELECT jsonb_build_object(%s) AS owner FROM users WHERE users.id = $1", strings.Join(ownerFields, ", "))
	err = database.Client.QueryRow(ownerQuery, project.OwnerID).Scan(&owner)
	if err != nil {
		return project, err
	}

	// Unmarshal the JSON data (owner) into map[string]interface{}
	var ownerMap map[string]interface{}
	err = json.Unmarshal(owner, &ownerMap)
	if err != nil {
		fmt.Printf("error unmarshalling owner JSON: %v", err)
	} else {
		project.Owner = ownerMap
	}

	return project, nil
}

func UpdateProject(projectID string, projectData map[string]interface{}) error {
	query := "UPDATE projects SET "
	args := []interface{}{}
	setParts := []string{}

	// Build the query dynamically from projectData map
	counter := 1
	for key, value := range projectData {
		setParts = append(setParts, fmt.Sprintf("%s = $%d", key, counter))
		args = append(args, value)
		counter++
	}

	if len(setParts) == 0 {
		return fmt.Errorf("no fields to update")
	}

	// Join the set parts (to avoid trailing comma) and add the WHERE clause
	query += strings.Join(setParts, ", ") + fmt.Sprintf(" WHERE id = $%d", counter)
	args = append(args, projectID)

	_, err := database.Client.Exec(query, args...)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			switch pqErr.Code {
			case "23505": // Unique violation
				return errors.New("duplicate value: unique constraint violation")
			case "23503": // Foreign key violation
				return errors.New("invalid foreign key reference")
			case "42703": // Undefined column
				return fmt.Errorf("field does not exist: %s", pqErr.Column)
			default:
				return fmt.Errorf("database error: %s", pqErr.Message)
			}
		}
		return fmt.Errorf("failed to execute query: %v", err)
	}

	return nil
}