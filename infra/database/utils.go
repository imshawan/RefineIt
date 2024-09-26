package database

import (
	"fmt"
	"strings"

	"github.com/lib/pq"
)

// GeneratePlaceholders generates a string of placeholders based on the provided format.
func GeneratePlaceholders(count int, placeholderFormat string) string {
	var placeholders []string
	for i := 1; i <= count; i++ {
		placeholders = append(placeholders, fmt.Sprintf(placeholderFormat, i))
	}
	return strings.Join(placeholders, ", ")
}

func IncrementFieldCount(table string, field string, identifier string, count int) error {
	query := fmt.Sprintf("UPDATE %s SET %s = %s + %d WHERE id = $1", table, field, field, count)

	_, err := Client.Exec(query, identifier)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			switch pqErr.Code {
			case "23503":
				return fmt.Errorf("%s not found", table)
			case "42703": // Column does not exist
				return fmt.Errorf("field '%s' does not exist in '%s'", field, table)
			default:
				return fmt.Errorf("database error: error while incrementing stars count")
			}
		}
		return fmt.Errorf("error incrementing stars count: %v", err)
	}
	return nil
}

func DecrementFieldCount(table string, field string, identifier string, count int) error {
	// Decrement query to ensure the field does not go below 0
	query := fmt.Sprintf("UPDATE %s SET %s = CASE WHEN %s >= %d THEN %s - %d ELSE %s END WHERE id = $1", table, field, field, count, field, count, field)

	_, err := Client.Exec(query, identifier)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			switch pqErr.Code {
			case "23503":
				return fmt.Errorf("%s not found", table)
			case "42703":
				return fmt.Errorf("field '%s' does not exist in '%s'", field, table)
			default:
				return fmt.Errorf("database error: error while decrementing field count")
			}
		}
		return fmt.Errorf("error decrementing field count: %v", err)
	}
	return nil
}