package langmapper

import (
	"strings"
)


// DetectLanguageFromExtension returns the programming language based on the file extension
func DetectLanguageFromExtension(filePath string) (LanguageInfo, bool) {
	ext := strings.ToLower(getFileExtension(filePath))
	langInfo, found := Languages[ext]
	
	return langInfo, found
}

func getFileExtension(filePath string) string {
	ext := ""
	if idx := strings.LastIndex(filePath, "."); idx != -1 {
		ext = filePath[idx:]
	}
	return ext
}