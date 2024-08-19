package models

import (
	"time"
)

type UserRequest struct {
	Username     string             `json:"username" binding:"required,min=3,max=20"`
	Email        string             `json:"email" binding:"required"`
	Password 	 string             `json:"password" binding:"required"`
	Fullname     string             `json:"fullname" binding:"required,min=1,max=20"`
}

type UserSigninRequest struct {
	Username     string             `json:"username" binding:"required,min=3,max=20"`
	Password 	 string             `json:"password" binding:"required"`
}

// User represents a user in the system
type User struct {
	ID           string 			`json:"id,omitempty"`
	Username     string             `json:"username" binding:"required,min=3,max=20"`
	Email        string             `json:"email" binding:"required"`
	PasswordHash string             `json:"-",omitempty`
	Fullname     string             `json:"fullname" binding:"required,min=1,max=20"`
	CreatedAt    time.Time          `json:"created_at"` // Timestamp of when the user was created
	UpdatedAt    time.Time          `json:"updated_at"` // Timestamp of when the user was last updated
	IsActive     bool               `json:"is_active"`   // Is the user active
}
