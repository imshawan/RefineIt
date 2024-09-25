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
	Slug          string            `json:"slug" binding:"required,min=3,max=100"`
	Description   string            `json:"description" binding:"required,min=3,max=2500"`
	ReviewType    string            `json:"review_type" binding:"required"`
	RepositoryURL *string           `json:"repository_url,omitempty"`
	Filename      string            `json:"filename" binding:"required"`
	FileUrl       string            `json:"file_url" binding:"required"`
	Visibility    ProjectVisibility `json:"visibility" binding:"required"`
	Tags          []string          `json:"tags"`
	Priority      string            `json:"priority" binding:"required,oneof=low medium high"`
}

type ProjectUpdateRequest struct {
	Name          *string            `json:"name,omitempty" binding:"omitempty,min=3,max=100"`
	Slug          *string            `json:"slug,omitempty" binding:"omitempty,min=3,max=100"`
	About         string             `json:"about" binding:"max=4500"`
	Description   *string            `json:"description,omitempty" binding:"omitempty,min=3,max=2500"`
	ReviewType    *string            `json:"review_type,omitempty"`
	RepositoryURL *string            `json:"repository_url,omitempty"`
	Filename      *string            `json:"filename,omitempty"`
	FileUrl       *string            `json:"file_url,omitempty"`
	Visibility    *ProjectVisibility `json:"visibility,omitempty"`
	Tags          []string           `json:"tags,omitempty"`
	Priority      *string            `json:"priority,omitempty" binding:"omitempty,oneof=low medium high"`
}

type Project struct {
	ID                string                 `json:"id,omitempty"`
	Name              string                 `json:"name" binding:"required,min=3,max=100"`
	Slug              string                 `json:"slug" binding:"required,min=3,max=100"`
	Description       string                 `json:"description" binding:"required,min=3,max=250"`
	About             string                 `json:"about" binding:"max=4500"`
	ReviewType        string                 `json:"review_type" binding:"required"`
	RepositoryURL     *string                `json:"repository_url,omitempty"` // Optional URL to a github repository
	Filename          string                 `json:"filename" binding:"required"`
	FileUrl           string                 `json:"file_url"`
	Visibility        ProjectVisibility      `json:"visibility" binding:"required"`                     // 'public' or 'private'
	OwnerID           string                 `json:"owner_id"`                                          // ID of the user who owns the project
	Owner             map[string]interface{} `json:"owner"`                                             // ID of the user who owns the project
	Tags              []string               `json:"tags"`                                              // List of tags related to the project
	ReviewsCount      *int                   `json:"reviews_count"`                                     // Number of reviews the project has received
	StarsCount        *int                   `json:"stars_count"`                                       // Number of stars or likes the project has received
	LastReviewedAt    *time.Time             `json:"last_reviewed_at"`                                  // Timestamp of the last review
	IsFeatured        *bool                  `json:"is_featured"`                                       // Whether the project is featured or not
	ContributorsCount *int64                 `json:"contributors_count"`                                // Number of contributors
	Priority          string                 `json:"priority" binding:"required,oneof=low medium high"` // 'low', 'medium', 'high'
	CreatedAt         time.Time              `json:"created_at"`
	UpdatedAt         time.Time              `json:"updated_at"`
}
