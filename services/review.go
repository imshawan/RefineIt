package services

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/imshawan/RefineIt/helpers"
	"github.com/imshawan/RefineIt/internal/review"
	"github.com/imshawan/RefineIt/models"
)

func CreateReview(ctx *gin.Context) {
	user, _ := ctx.Get("User")
	userData, ok := user.(models.User)
	if !ok {
		// Handle the case where the type assertion fails
		helpers.FormatAPIResponse(ctx, http.StatusUnauthorized, errors.New("failed to assert user to models.User"))
		return
	}

	var reviewRequest models.ReviewRequest
	if err := ctx.ShouldBind(&reviewRequest); err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, err)
		return
	}

	newReview := models.Review{
		ReviewerID: userData.ID,
		ProjectID: reviewRequest.ProjectID,
	}

	reviewData, err := review.CreateReview(newReview)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	helpers.FormatAPIResponse(ctx, http.StatusCreated, gin.H{"message": "Review created successfully", "review": reviewData})

}

func GetReviewByProjectIdAndUser (ctx *gin.Context) {
	user, _ := ctx.Get("User")
	projectID := ctx.Param("project_id")

	userData, ok := user.(models.User)
	if !ok {
		helpers.FormatAPIResponse(ctx, http.StatusUnauthorized, errors.New("failed to assert user to models.User"))
		return
	}

	review, err := review.GetReviewByCallerAndProjectId(projectID, userData.ID)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	helpers.FormatAPIResponse(ctx, http.StatusOK, review)
}

func UpdateReviewData(ctx *gin.Context) {
	user, _ := ctx.Get("User")
	reviewID := ctx.Param("review_id")

	if reviewID == "" || len(reviewID) < 32 {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, errors.New("valid review id is required"))
		return
	}

	userData, ok := user.(models.User)
	if !ok {
		helpers.FormatAPIResponse(ctx, http.StatusUnauthorized, errors.New("failed to assert user to models.User"))
		return
	}

	var reviewRequest models.ReviewRequest
	if err := ctx.ShouldBind(&reviewRequest); err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, err)
		return
	}

	reviewData := models.Review{}
	if reviewRequest.Title != nil && *reviewRequest.Title != ""  {
		reviewData.Title = *reviewRequest.Title
	}

	if reviewRequest.Content != nil && *reviewRequest.Content != "" {
		reviewData.Content = *reviewRequest.Content
	}

	updatedReview, err := review.UpdateReviewContent(reviewID, reviewData, userData.ID)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	helpers.FormatAPIResponse(ctx, http.StatusOK, updatedReview)
}