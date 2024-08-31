package configs

import (
	"log"
	"os"
	"path/filepath"

	"github.com/spf13/viper"
)

type Configuration struct {
	Server   ServerConfiguration
}

// SetupConfig configuration
func SetupConfig() error {
	var configuration *Configuration

	viper.SetConfigFile(".env")
	if err := viper.ReadInConfig(); err != nil {
		log.Printf("Error to reading config file, %s", err)
		return err
	}

	err := viper.Unmarshal(&configuration)
	if err != nil {
		log.Printf("error to decode, %v", err)
		return err
	}

	currentDir, err := os.Getwd()
	if err != nil {
		panic("Failed to get current working directory")
	}
	assetsDir := filepath.Join(currentDir, "public")

	viper.SetDefault("ASSETS_DIR", assetsDir)
	viper.SetDefault("UPLOADS_DIR", filepath.Join(assetsDir, "uploads"))

	return nil
}