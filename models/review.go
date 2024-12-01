package models

import "time"

type ReviewRequest struct {
	Title     *string `json:"title"` // Title of the review
	Content   *string `json:"content"`
	ProjectID string  `json:"project_id" binding:"required"`
	Additions int     `json:"additions"`
	Deletions int     `json:"deletions"`
}

type ReviewUpdateRequest struct {
	Title   *string `json:"title"`
	Content *string `json:"content"`
}

type Review struct {
	ID              string                 `json:"id,omitempty"`
	Title           string                 `json:"title" binding:"required,min=3,max=100"` // Title of the review
	Content         string                 `json:"content" binding:"required,min=10"`      // Main content of the review
	Diffs           map[string]interface{} `json:"diffs"`                                  // Information about the reviewed project
	Rating          int                    `json:"rating" binding:"required,min=1,max=5"`  // Rating out of 5
	ProjectID       string                 `json:"project_id" binding:"required"`          // Associated project's ID
	Project         map[string]interface{} `json:"project"`                                // Information about the reviewed project
	ProjectOwnerID  string                 `json:"project_owner_id"`
	ProjectOwner    map[string]interface{} `json:"project_owner"`
	ReviewerID      string                 `json:"reviewer_id" binding:"required"`                                            // ID of the user who created the review
	Reviewer        map[string]interface{} `json:"reviewer"`                                                                  // Reviewer information
	Status          string                 `json:"status" binding:"required,oneof=draft published archived flagged rejected"` // Review status: 'draft', 'published', etc.
	Tags            []string               `json:"tags"`                                                                      // Tags associated with the review
	UpvotesCount    int                    `json:"upvotes_count"`                                                             // Default: 0
	DownvotesCount  int                    `json:"downvotes_count"`                                                           // Default: 0
	IsHighlighted   bool                   `json:"is_highlighted"`                                                            // Default: false
	CommentsCount   int                    `json:"comments_count"`                                                            // Default: 0
	LastCommentedAt *time.Time             `json:"last_commented_at"`                                                         // Optional timestamp of the last comment
	CreatedAt       time.Time              `json:"created_at"`                                                                // Review creation timestamp
	UpdatedAt       time.Time              `json:"updated_at"`                                                                // Review update timestamp
}
