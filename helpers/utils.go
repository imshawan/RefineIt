package helpers

import (
	"fmt"
	"net/mail"
	"regexp"
	"strings"

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

func ExtractUniqueFieldError(detail string) (string) {
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