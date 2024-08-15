package services

import (
	"errors"

	// "fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/imshawan/RefineIt/helpers"
	"github.com/imshawan/RefineIt/internal/user"
	"github.com/imshawan/RefineIt/models"
)

func SignIn(ctx *gin.Context) {
	var userReq models.UserRequest
	var field string = "username"

	// Bind and validate the request body
	if err := ctx.ShouldBind(&userReq); err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, err)
		return
	}

	if ok := helpers.IsEmail(userReq.Username); ok {
		field = "email"
	}

	existingUser, err := user.GetUserByField(ctx, field, userReq.Username)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, err)
		return
	}

	match, compareErr := helpers.ComparePassword(userReq.Password, existingUser.PasswordHash)
	if compareErr != nil {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, compareErr)
	}

	if !match {
		helpers.FormatAPIResponse(ctx, http.StatusUnauthorized, errors.New("invalid credentials"))
		return
	}
	token, err := helpers.SignJWTToken(existingUser)
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
