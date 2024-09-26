package middlewares

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/imshawan/RefineIt/helpers"
	"github.com/imshawan/RefineIt/pkg/authentication"
	"github.com/imshawan/RefineIt/internal/user"
	"github.com/imshawan/RefineIt/models"
)

func IsAuthenticated() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Get the Authorization header
		authHeader := ctx.GetHeader("Authorization")

		// Check if the header contains a Bearer token
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			helpers.FormatAPIResponse(ctx, http.StatusUnauthorized, errors.New("authorization header is missing or invalid"))
			ctx.Abort()
			return
		}

		// Extract the token
		token := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := authentication.ValidateJWTToken(token)
		if err != nil {
			helpers.FormatAPIResponse(ctx, http.StatusUnauthorized, err)
			ctx.Abort()
			return
		}

		var existingUser models.User
		if usr, err := user.GetUserByField(ctx, "id", claims.ID);  err != nil || (usr.ID == "") {
			helpers.FormatAPIResponse(ctx, http.StatusBadRequest, errors.New("could not find user associated with this token"))
			return
		} else {
			existingUser = usr
		}

		ctx.Set("User", existingUser)

		// Proceed to the next middleware or handler
		ctx.Next()
	}
}

func CheckIfAuthenticated() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHeader := ctx.GetHeader("Authorization")

		// Check if the header contains a Bearer token, if not proceed next
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			ctx.Set("User", nil)
			ctx.Next()
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := authentication.ValidateJWTToken(token)
		if err != nil {
			helpers.FormatAPIResponse(ctx, http.StatusUnauthorized, err)
			ctx.Abort()
			return
		}

		var existingUser models.User
		if usr, err := user.GetUserByField(ctx, "id", claims.ID);  err != nil || (usr.ID == "") {
			helpers.FormatAPIResponse(ctx, http.StatusBadRequest, errors.New("could not find user associated with this token"))
			return
		} else {
			existingUser = usr
		}

		ctx.Set("User", existingUser)
		ctx.Next()
	}
}