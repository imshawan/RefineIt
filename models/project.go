package models

import (
	"errors"
	"strings"
	"time"
)

type ProjectVisibility string

const (
	Public  ProjectVisibility = "public"
	Private ProjectVisibility = "private"
)

func (pv *ProjectVisibility) UnmarshalJSON(data []byte) error {
	s := strings.Trim(string(data), "\"")
	switch s {
	case "public", "private":
		*pv = ProjectVisibility(s)
		return nil
	default:
		return errors.New("invalid project_visibility value")
	}
}

type ProjectCreationRequest struct {
	Name          string            `json:"name" binding:"required,min=3,max=100"`
	Description   string            `json:"description" binding:"required,min=3,max=2500"`
	ReviewType    string            `json:"review_type" binding:"required"`
	RepositoryURL *string           `json:"repository_url,omitempty"`
	Filename      string            `json:"filename" binding:"required"`
	FileUrl       string            `json:"file_url" binding:"required"`
	Visibility    ProjectVisibility `json:"visibility" binding:"required"`
}

type Project struct {
	ID                string            `json:"id,omitempty"`
	Name              string            `json:"name" binding:"required,min=3,max=100"`
	Description       string            `json:"description" binding:"required,min=3,max=2500"`
	ReviewType        string            `json:"review_type" binding:"required"`
	RepositoryURL     *string           `json:"repository_url,omitempty"` // Optional URL to a github repository
	Filename          string            `json:"filename" binding:"required"`
	FileUrl           string            `json:"file_url"`
	Visibility        ProjectVisibility `json:"visibility" binding:"required"`                     // 'public' or 'private'
	OwnerID           int               `json:"owner_id" binding:"required"`                       // ID of the user who owns the project
	Tags              []string          `json:"tags"`                                              // List of tags related to the project
	ReviewsCount      *int              `json:"reviews_count"`                                     // Number of reviews the project has received
	StarsCount        *int              `json:"stars_count"`                                       // Number of stars or likes the project has received
	LastReviewedAt    *time.Time        `json:"last_reviewed_at"`                                  // Timestamp of the last review
	IsFeatured        *bool             `json:"is_featured"`                                       // Whether the project is featured or not
	ContributorsCount *int64            `json:"contributors_count"`                                // Number of contributors
	Collaborators     *[]int            `json:"collaborators"`                                     // List of user IDs who are collaborators
	Priority          string            `json:"priority" binding:"required,oneof=low medium high"` // 'low', 'medium', 'high'
	CreatedAt         time.Time         `json:"created_at"`
	UpdatedAt         time.Time         `json:"updated_at"`
}
