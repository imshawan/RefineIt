package review

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/imshawan/RefineIt/helpers"
	"github.com/imshawan/RefineIt/infra/database"
	"github.com/imshawan/RefineIt/internal/project"
	"github.com/imshawan/RefineIt/models"
	"github.com/lib/pq"
)

var ReviewFields = []string{
	"id", "title", "content", "rating", "project_id", "project_owner_id", "reviewer_id", "status", "tags", "upvotes_count", "downvotes_count",
	"is_highlighted", "comments_count", "last_commented_at", "created_at", "updated_at",
}

func CreateReview(review models.Review) (models.Review, error) {
	if review.ProjectID == "" {
		return review, errors.New("project id is required")
	}
	if review.ReviewerID == "" {
		return review, errors.New("reviewer id is required")
	}

	project, err := project.GetProjectByIdWithOwner(review.ProjectID, review.ReviewerID)
	if err != nil {
		return review, err
	}

	if review.Title == "" {
		review.Title = "Review for " + project.Name
	}
	if review.Content == "" {
		review.Content = "-"
	}
	if review.Tags == nil || len(review.Tags) == 0 {
		review.Tags = project.Tags
	}

	now := time.Now()
	id, err := helpers.GenerateUUID()
	if err != nil {
		return review, err
	}

	review.ID = id
	review.ProjectOwnerID = project.OwnerID
	review.CommentsCount = 0
	review.DownvotesCount = 0
	review.UpvotesCount = 0
	review.IsHighlighted = false
	review.Rating = 0
	review.Status = "draft"
	review.CreatedAt = now
	review.UpdatedAt = now

	reviewFields := strings.Join(ReviewFields, ", ")

	// Construct the SQL query with the returning clause
	count := len(ReviewFields)
	query := fmt.Sprintf("INSERT INTO reviews (%s) VALUES (%s) RETURNING %s", reviewFields, database.GeneratePlaceholders(count, "$%d"), reviewFields)
	// fmt.Println(query)

	errs := database.Client.QueryRow(query, review.ID, review.Title, review.Content, review.Rating, review.ProjectID,
		review.ProjectOwnerID, review.ReviewerID, review.Status, pq.Array(review.Tags), review.UpvotesCount, review.DownvotesCount,
		review.IsHighlighted, review.CommentsCount, review.LastCommentedAt, review.CreatedAt, review.UpdatedAt).Scan(
		&review.ID, &review.Title, &review.Content, &review.Rating, &review.ProjectID, &review.ProjectOwnerID, &review.ReviewerID,
		&review.Status, pq.Array(&review.Tags), &review.UpvotesCount, &review.DownvotesCount,
		&review.IsHighlighted, &review.CommentsCount, &review.LastCommentedAt, &review.CreatedAt, &review.UpdatedAt)

	if errs != nil {
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
			return review, fmt.Errorf(helpers.ExtractUniqueFieldError(pqErr.Detail))
		}
		fmt.Println(errs)
		return review, fmt.Errorf("error inserting a review into the database")
	}

	return review, nil
}

func UpdateReviewContent(reviewID string, review models.Review, reviewerID string) (models.Review, error) {
	if reviewID == "" {
		return review, errors.New("review id is required")
	}
	if reviewerID == "" {
		return review, errors.New("reviewer ID is required")
	}

	// Lets check if the review exists of not, if exists, whether the person is allowed to edit
	var authorID string
	err := database.Client.QueryRow("SELECT reviewer_id FROM reviews WHERE id = $1", reviewID).Scan(&authorID)
	if err != nil {
		if err == sql.ErrNoRows {
			return review, errors.New("review not found")
		}
		return review, err
	}
	if authorID != reviewerID {
		return review, errors.New("unauthorized: you are not the author of this review")
	}

	// Check which fields to update
	updateFields := []string{}
	args := []interface{}{}
	argIndex := 1

	if review.Content != "" {
		updateFields = append(updateFields, fmt.Sprintf("content = $%d", argIndex))
		args = append(args, review.Content)
		argIndex++
	}

	if review.Title != "" {
		updateFields = append(updateFields, fmt.Sprintf("title = $%d", argIndex))
		args = append(args, review.Title)
		argIndex++
	}

	if len(updateFields) == 0 {
		return review, nil
	}

	// Added the condition for the review ID
	args = append(args, reviewID)

	query := fmt.Sprintf("UPDATE reviews SET %s WHERE id = $%d", strings.Join(updateFields, ", "), argIndex)
	_, err = database.Client.Exec(query, args...)
	if err != nil {
		return review, err
	}

	return review, nil
}
