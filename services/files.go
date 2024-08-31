package services

import "fmt"

import (
	"errors"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/imshawan/RefineIt/helpers"
	"github.com/spf13/viper"
)

func UploadFiles(ctx *gin.Context) {
	form, err := ctx.MultipartForm()
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, errors.New("failed to parse form"))
		return
	}

	files := form.File["files"]
	if len(files) == 0 {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, errors.New("no files uploaded"))
		return
	}

	var fileUrls []gin.H

	for _, file := range files {
		// Determine the file's MIME type and create the appropriate directory
		mimeType := file.Header["Content-Type"][0]
		mimeTypeDir := helpers.GetDirectoryByMimeType(mimeType)

		// Create directories if they don't exist
		uploadDir := viper.GetString("UPLOADS_DIR")
		categorisedUploadsDir := filepath.Join(uploadDir, mimeTypeDir)
		if _, err := os.Stat(categorisedUploadsDir); os.IsNotExist(err) {
			if err := os.MkdirAll(categorisedUploadsDir, os.ModePerm); err != nil {
				helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, errors.New("failed to create directory"))
				return
			}
		}

		timestamp := helpers.GetTimestampMilli()
		slugifiedName := helpers.Slugify(filepath.Base(file.Filename))
		newFilename := slugifiedName + "-" + fmt.Sprint(timestamp) + filepath.Ext(file.Filename)

		// Define the file path and save the file
		filePath := filepath.Join(categorisedUploadsDir, newFilename)
		if err := ctx.SaveUploadedFile(file, filePath); err != nil {
			helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, errors.New("failed to save file"))
			return
		}

		// Construct the file URL
		fileUrl := viper.GetString("HOST_URL") + "/assets/uploads/" + mimeTypeDir + "/" + newFilename
		fileUrls = append(fileUrls, gin.H{"url": fileUrl, "name": file.Filename})
	}

	helpers.FormatAPIResponse(ctx, http.StatusCreated, gin.H{"files": fileUrls})
}