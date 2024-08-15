package helpers

import (
	"net/mail"
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