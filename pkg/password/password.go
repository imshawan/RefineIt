package password

import (
	"crypto/rand"
	// "crypto/sha512"
	"encoding/hex"
	"errors"
	// "fmt"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

// HashOptions represents options for hashing and comparison
type HashOptions struct {
	Rounds  int    // number of bcrypt rounds
	Password string // password to hash or compare
	Hash    string // hash to compare with
}

var randomHashCache string

// HashPassword generates a hashed password
func HashPassword(password string) (string, error) {
	password = strings.TrimSpace(password)
	rounds := bcrypt.DefaultCost
	if password == "" {
		return "", errors.New("password is required and cannot be null")
	}

	return hashPassword(HashOptions{
		Rounds:  rounds,
		Password: password,
	})
}

// ComparePassword compares a password with a hash
func ComparePassword(password string, hash string) (bool, error) {
	if password == "" {
		return false, errors.New("password is required and cannot be null")
	}
	if hash == "" {
		var err error
		hash, err = generateRandomHash()
		if err != nil {
			return false, err
		}
	}

	return compareHashWithPassword(HashOptions{
		Password: password,
		Hash:     hash,
	})
}

// generateRandomHash generates a random hash for use
func generateRandomHash() (string, error) {
	if randomHashCache != "" {
		return randomHashCache, nil
	}

	randomBytes := make([]byte, 16)
	if _, err := rand.Read(randomBytes); err != nil {
		return "", err
	}
	randomString := hex.EncodeToString(randomBytes)

	randomHash, err := HashPassword(randomString)
	if err != nil {
		return "", err
	}

	randomHashCache = randomHash
	return randomHashCache, nil
}

// hashPassword hashes a password using bcrypt
func hashPassword(options HashOptions) (string, error) {
	if options.Rounds == 0 {
		options.Rounds = bcrypt.DefaultCost
	}

	salt, err := bcrypt.GenerateFromPassword([]byte(options.Password), options.Rounds)
	if err != nil {
		return "", err
	}

	return string(salt), nil
}

// compareHashWithPassword compares a password with a bcrypt hash
func compareHashWithPassword(options HashOptions) (bool, error) {
	err := bcrypt.CompareHashAndPassword([]byte(options.Hash), []byte(options.Password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return false, nil
		}
		
		return false, err
	}
	return true, nil
}