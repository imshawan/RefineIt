package services

import (
	"errors"

	// "fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/imshawan/RefineIt/helpers"
	"github.com/imshawan/RefineIt/pkg/authentication"
	"github.com/imshawan/RefineIt/pkg/password"
	"github.com/imshawan/RefineIt/internal/user"
	"github.com/imshawan/RefineIt/models"
)

func SignIn(ctx *gin.Context) {
	var userReq models.UserSigninRequest
	var field string = "username"

	// Bind and validate the request body
	if err := ctx.ShouldBindJSON(&userReq); err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, err)
		return
	}

	if ok := helpers.IsEmail(userReq.Username); ok {
		field = "email"
	}

	existingUser, err := user.GetUserByField(ctx, field, userReq.Username, true)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, err)
		return
	}

	match, compareErr := password.ComparePassword(userReq.Password, existingUser.PasswordHash)
	if compareErr != nil {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, compareErr)
	}

	if !match {
		helpers.FormatAPIResponse(ctx, http.StatusForbidden, errors.New("invalid credentials"))
		return
	}
	token, err := authentication.SignJWTToken(existingUser)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, err)
		return
	}

	response := map[string]interface{}{
		"token": token,
		"user":  existingUser,
	}

	helpers.FormatAPIResponse(ctx, http.StatusOK, response)
}
