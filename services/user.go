package services

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/imshawan/RefineIt/helpers"
	"github.com/imshawan/RefineIt/internal/user"
	"github.com/imshawan/RefineIt/models"
)

func UserProfile(ctx *gin.Context) {
	user, _ := ctx.Get("User")

	helpers.FormatAPIResponse(ctx, http.StatusOK, user)
}

func RegisterUser(ctx *gin.Context) {
	var userReq models.UserRequest

	// Bind and validate the request body
	if err := ctx.ShouldBind(&userReq); err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, err)
		return
	}

	if usr, err := user.GetUserByField(ctx, "email", userReq.Username);  err == nil || (usr.ID != "") {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, errors.New("user with this email already exists"))
		return
	}
	if usr, err := user.GetUserByField(ctx, "username", userReq.Username);  err == nil || (usr.ID != "") {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, errors.New("user with this username already exists"))
		return
	}

	id, err := helpers.GenerateUUID()
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	// Hash the password
	hashedPassword, err := helpers.HashPassword(userReq.Password)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusConflict, err)
		return
	}

	newUser := models.User{
		ID:			  id,
		Username:     userReq.Username,
		Email:        userReq.Email,
		PasswordHash: hashedPassword, // Store the hashed password
		Fullname:     userReq.Fullname,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
		IsActive:     true,
	}

	userData, err := user.CreateUser(newUser)
	if err != nil {
		fmt.Print(err)
		helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, errors.New("failed to register user"))
		return
	}

	helpers.FormatAPIResponse(ctx, http.StatusCreated, gin.H{"message": "User registered successfully", "user": userData})
}
