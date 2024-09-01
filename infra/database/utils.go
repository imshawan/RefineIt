package database

import (
	"fmt"
	"strings"
)

// GeneratePlaceholders generates a string of placeholders based on the provided format.
func GeneratePlaceholders(count int, placeholderFormat string) string {
	var placeholders []string
	for i := 1; i <= count; i++ {
		placeholders = append(placeholders, fmt.Sprintf(placeholderFormat, i))
	}
	return strings.Join(placeholders, ", ")
}