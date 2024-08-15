package middlewares

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/imshawan/RefineIt/helpers"
)

func ValidateRequestFields(model interface{}) gin.HandlerFunc {
	return func(ctx *gin.Context) {
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
		}

		// If validation passes, continue to the next handler
		ctx.Next()
	}
}
