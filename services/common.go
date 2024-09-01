package services

import (
	"errors"
	"net/http"
	"regexp"

	"github.com/gin-gonic/gin"
	"github.com/imshawan/RefineIt/helpers"
	"github.com/imshawan/RefineIt/pkg/langmapper"
)

func DetectlanguageByFilename(ctx *gin.Context) {
	filename := ctx.Query("name")
	regexPattern := `^[a-zA-Z0-9_\-]+\.[a-zA-Z0-9]+$`

	if filename == "" {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, errors.New("filename is required"))
		return
	}

	re := regexp.MustCompile(regexPattern)
	if isValid := re.MatchString(filename); !isValid {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, errors.New("invalid filename"))
		return
	}

	lang, found := langmapper.DetectLanguageFromExtension(filename)
	if !found {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, errors.New("cound not detect language"))
		return
	}

	helpers.FormatAPIResponse(ctx, http.StatusOK, lang)
}
