package review

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/imshawan/RefineIt/infra/database"
	"github.com/imshawan/RefineIt/internal/project"
	"github.com/imshawan/RefineIt/internal/user"
	"github.com/imshawan/RefineIt/models"
	"github.com/lib/pq"
)

func GetReviewByCallerAndProjectId(projectId string, callerId string) (models.Review, error) {
	review := models.Review{}

	var fields []string
	var userFields []string
	var projectFields []string
	for _, field := range ReviewFields {
		fields = append(fields, "review."+field)
	}

	for _, field := range user.PublicFields {
		userFields = append(userFields, fmt.Sprintf("'%s', users.%s", field, field))
	}

	for _, field := range project.ProjectFields {
		projectFields = append(projectFields, fmt.Sprintf("'%s', project.%s", field, field))
	}

	userFieldList := strings.Join(userFields, ", ")

	query := fmt.Sprintf(`
    SELECT %s, 
           jsonb_build_object(%s) AS project_owner,
           jsonb_build_object(%s) AS reviewer,
           jsonb_build_object(%s) AS project
    FROM reviews AS review
    LEFT JOIN users AS project_owner ON review.project_owner_id = project_owner.id
    LEFT JOIN users AS reviewer ON review.reviewer_id = reviewer.id
    LEFT JOIN projects AS project ON review.project_id = project.id
    WHERE review.project_id = $1 AND review.reviewer_id = $2`,
		strings.Join(fields, ", "),                                  // Fields from the reviews table
		strings.ReplaceAll(userFieldList, "users", "project_owner"), // Fields for the project owner (from users)
		strings.ReplaceAll(userFieldList, "users", "reviewer"),      // Fields for the reviewer (from users)
		strings.Join(projectFields, ", "),                           // Fields for the project (from projects)
	)

	var projectOwner json.RawMessage
	var reviewer json.RawMessage
	var projectData json.RawMessage

	err := database.Client.QueryRow(query, projectId, callerId).Scan(
		&review.ID, &review.Title, &review.Content, &review.Rating, &review.ProjectID, &review.ProjectOwnerID, &review.ReviewerID,
		&review.Status, pq.Array(&review.Tags), &review.UpvotesCount, &review.DownvotesCount,
		&review.IsHighlighted, &review.CommentsCount, &review.LastCommentedAt, &review.CreatedAt, &review.UpdatedAt, &projectOwner,
		&reviewer, &projectData,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return review, fmt.Errorf("no review found with the given project id")
		}
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "42703" {
			return review, fmt.Errorf("error occured while data retrival due to schema mismatch")
		}
		return review, err
	}

	var ownerMap map[string]interface{}
	var reviewerMap map[string]interface{}
	var projectMap map[string]interface{}
	err = json.Unmarshal(projectOwner, &ownerMap)
	if err != nil {
		return review, err
	}
	err = json.Unmarshal(reviewer, &reviewerMap)
	if err != nil {
		return review, err
	}
	err = json.Unmarshal(projectData, &projectMap)
	if err != nil {
		return review, err
	}

	review.Project = projectMap
	review.Reviewer = reviewerMap
	review.ProjectOwner = ownerMap

	return review, nil
}
