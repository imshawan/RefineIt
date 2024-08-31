package models

import (
	"encoding/json"
	"errors"
	"time"
)

type Theme string

const (
	DarkTheme  Theme = "dark"
	LightTheme Theme = "light"
)

// Validate the Theme value
func (t Theme) IsValid() bool {
	return t == DarkTheme || t == LightTheme
}

// UnmarshalJSON customizes the JSON unmarshaling for Theme
func (t *Theme) UnmarshalJSON(data []byte) error {
	var theme string
	if err := json.Unmarshal(data, &theme); err != nil {
		return err
	}
	*t = Theme(theme)
	if !t.IsValid() {
		return errors.New("invalid theme value")
	}
	return nil
}

// MarshalJSON customizes the JSON marshaling for Theme
func (t Theme) MarshalJSON() ([]byte, error) {
	return json.Marshal(string(t))
}

type UserRequest struct {
	Username string `json:"username" binding:"required,min=3,max=20"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	Fullname string `json:"fullname" binding:"required,min=1,max=20"`
}

type UserSigninRequest struct {
	Username string `json:"username" binding:"required,min=3,max=20"`
	Password string `json:"password" binding:"required"`
}

// User represents a user in the system
type User struct {
	ID                 string                  `json:"id,omitempty"`
	Username           string                  `json:"username" binding:"required,min=3,max=20"`
	Email              string                  `json:"email" binding:"required"`
	PasswordHash       string                  `json:"-"`
	Fullname           string                  `json:"fullname" binding:"required,min=1,max=20"`
	IsActive           bool                    `json:"is_active"` // Is the user active
	LastLogin          *time.Time              `json:"last_login,omitempty"`
	ProfilePicture     *string                 `json:"profile_picture,omitempty"`
	Bio                *string                 `json:"bio,omitempty"`
	PhoneNumber        *string                 `json:"phone_number,omitempty"`
	Location           *string                 `json:"location,omitempty"`
	ReviewsCount       *int                    `json:"reviews_count"`
	ProjectsCount      *int                    `json:"projects_count"`
	FeedbacksGiven     *int                    `json:"feedbacks_given"`
	FeedbacksReceived  *int                    `json:"feedbacks_received"`
	UserSettings       *map[string]interface{} `json:"user_settings,omitempty"`                                 // Optional field for user-specific settings
	AccountType        *string                 `json:"account_type,omitempty" binding:"oneof=standard premium"` // Optional field for user account type (standard, premium)
	TwoFactorEnabled   *bool                   `json:"two_factor_enabled"`                                      // Indicates if 2FA is enabled
	SignUpSource       *string                 `json:"sign_up_source,omitempty"`                                // Optional field for tracking the sign-up source
	LastPasswordChange *time.Time              `json:"last_password_change,omitempty"`                          // Optional field for last password change
	Suspended          *bool                   `json:"suspended"`                                               // Indicates if the user account is suspended
	EmailVerified      *bool                   `json:"email_verified"`                                          // Indicates if the user's email has been verified
	Timezone           *string                 `json:"timezone,omitempty"`                                      // Optional field for user's timezone
	CreatedAt          time.Time               `json:"created_at"`                                              // Timestamp of when the user was created
	UpdatedAt          time.Time               `json:"updated_at"`                                              // Timestamp of when the user was last updated
}

type UserSettings struct {
	Theme                Theme `json:"theme,omitempty"`                 // User's preferred theme (dark, light)
	NotificationsEnabled bool  `json:"notifications_enabled,omitempty"` // Whether notifications are enabled
}
