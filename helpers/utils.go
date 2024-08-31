package helpers

import (
	"fmt"
	"net/mail"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"
)

func IsEmail(str string) bool {
	_, err := mail.ParseAddress(str)
	return err == nil
}

func GenerateUUID() (string, error) {
	uuidV6, err := uuid.NewV6()
	if err != nil {
		return "", err
	}

	return strings.ReplaceAll(uuidV6.String(), "-", ""), nil
}

func ExtractUniqueFieldError(detail string) string {
	// Regular expression to match field name and value
	re := regexp.MustCompile(`Key \(([^)]+)\)=\(([^)]+)\)`)

	// Find the matches
	matches := re.FindStringSubmatch(detail)
	if len(matches) == 3 {
		fieldName := matches[1]
		fieldValue := matches[2]

		return fmt.Sprintf("%s (%s) already exists.", fieldName, fieldValue)
	} else {
		return ""
	}
}

func GetDirectoryByMimeType(mimeType string) string {
	fmt.Println(mimeType)
	switch {
	case strings.HasPrefix(mimeType, "image/"):
		return "images"
	case strings.HasPrefix(mimeType, "video/"):
		return "videos"
	case strings.HasPrefix(mimeType, "audio/"):
		return "audio"
	case strings.HasPrefix(mimeType, "application/pdf"):
		return "documents"
    case strings.HasPrefix(mimeType, "application/vnd"):
		return "documents"
    case strings.HasPrefix(mimeType, "application/json"):
		return "data"
	case strings.HasPrefix(mimeType, "application/"):
		return "applications"
	case strings.HasPrefix(mimeType, "text/"):
		return "texts"
	default:
		return "others"
	}
}

// Slugify converts a string to a slug-friendly format
func Slugify(filename string) string {
	re := regexp.MustCompile(`[^\w\s-]`)
	slug := re.ReplaceAllString(filename, "")
	slug = strings.TrimSpace(slug)
	slug = strings.ToLower(slug)
	slug = strings.ReplaceAll(slug, " ", "-")
	return slug
}

// GetUnixTimestamp gives you the timestamp in milliseconds. 
// This is for handling Go versions before 1.17, where UnixMilli() is not available.
func GetUnixTimestamp() int64 {
	currentTime := time.Now()
	ms := int64(currentTime.Nanosecond()/1e6) // converts the nanoseconds to milliseconds

	return currentTime.Unix()*1000 + ms
}

func GetTimestampMilli() int64 {
	return time.Now().UnixMilli()
}

// GetISOTimestampUTC ensures the timestamp is in UTC.
func GetISOTimestampUTC() string {
	return time.Now().UTC().Format(time.RFC3339)
}

// GetISOTimestampLocal returns the local time zone of your system in ISO format
func GetISOTimestampLocal() string {
	return time.Now().Format(time.RFC3339)
}