package middlewares

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/imshawan/RefineIt/helpers"
)

func ValidateRequestFields(model interface{}) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var jsonData map[string]interface{}
		contentType := ctx.GetHeader("Content-Type")

		if contentType == "application/json" {
			// Step 2a: Parse JSON data
			bodyBytes, err := io.ReadAll(ctx.Request.Body)
			if err != nil {
				helpers.FormatAPIResponse(ctx, http.StatusBadRequest, errors.New("failed to read request body"))
				return
			}

			if len(bodyBytes) == 0 {
				helpers.FormatAPIResponse(ctx, http.StatusBadRequest, errors.New("empty request body"))
				return
			}

			// Unmarshal JSON into a map
			err = json.Unmarshal(bodyBytes, &jsonData)
			if err != nil {
				helpers.FormatAPIResponse(ctx, http.StatusBadRequest, err)
				return
			}
		} else if contentType == "application/x-www-form-urlencoded" {
			err := ctx.Request.ParseForm()
			if err != nil {
				helpers.FormatAPIResponse(ctx, http.StatusBadRequest, errors.New("failed to parse form data"))
				return
			}

			// Convert form data to JSON-like structure
			jsonData = make(map[string]interface{})
			for key, values := range ctx.Request.PostForm {
				// Since PostForm is map[string][]string, take the first value
				if len(values) > 0 {
					jsonData[key] = values[0]
				}
			}
		}

		// Step 4: Marshal the modified data back into JSON
		modifiedBodyBytes, err := json.Marshal(jsonData)
		if err != nil {
			helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, errors.New("failed to marshal modified data"))
			return
		}

		// Replace the request body with the modified JSON
		ctx.Request.Body = io.NopCloser(bytes.NewBuffer(modifiedBodyBytes))

		if err := ctx.ShouldBind(model); err != nil {
			var validationError error

			if errs, ok := err.(validator.ValidationErrors); ok {
				var validationErrors []string
				// Iterate through each error
				for _, e := range errs {
					field := e.Field()
					tag := e.Tag()
					// Use field and tag to generate a meaningful error message
					validationErrors = append(validationErrors, fmt.Sprintf("%s (%s)", field, tag))
				}
				errorMessage := fmt.Sprintf("validation failed: %s", strings.Join(validationErrors, ", "))
				validationError = errors.New(errorMessage)
			} else {
				// Handle other types of errors
				validationError = err
			}

			helpers.FormatAPIResponse(ctx, http.StatusBadRequest, validationError)
			ctx.Abort() // Stop further processing
			return
		} else {
			ctx.Request.Body = io.NopCloser(bytes.NewBuffer(modifiedBodyBytes))
		}

		// If validation passes, continue to the next handler
		ctx.Next()
	}
}
