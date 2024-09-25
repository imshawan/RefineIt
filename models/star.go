package models

import "time"

type Star struct {
	ID        string    `json:"id,omitempty"`
	UserID    int       `json:"user_id"`
	ProjectID int       `json:"project_id"`
	CreatedAt time.Time `json:"starred_at"`
}