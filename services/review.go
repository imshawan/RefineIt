package services

import (
	"errors"
	"net/http"
	"strconv"

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

	reviewData := models.ReviewRequest{}
	if reviewRequest.Title != nil && *reviewRequest.Title != ""  {
		reviewData.Title = reviewRequest.Title
	}

	if reviewRequest.Content != nil && *reviewRequest.Content != "" {
		reviewData.Content = reviewRequest.Content
	}

	reviewData.Additions = reviewRequest.Additions
	reviewData.Deletions = reviewRequest.Deletions

	err := review.UpdateReviewContent(reviewID, reviewData, userData.ID)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	helpers.FormatAPIResponse(ctx, http.StatusOK, gin.H{"message": "Review updated successfully"})
}

func GetAllReviews(ctx *gin.Context) {
	// user, _ := ctx.Get("User")
	projectID := ctx.Param("project_id")
	page := ctx.DefaultQuery("page", "1")
	limit := ctx.DefaultQuery("limit", "10")
	userID := ctx.DefaultQuery("user_id", "")
	searchQuery := ctx.DefaultQuery("search", "")

	limitInt, err := strconv.Atoi(limit)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, err)
	}
	pageInt, err := strconv.Atoi(page)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, err)
	}

	var options []func(*review.GetReviewsOptions)
	projectOwnerFields := []string{"fullname", "username", "profile_picture"}
	options = append(
		options, 
		review.WithProjectOwnerFields(projectOwnerFields), 
		review.WithPageSize(limitInt),
		review.WithPage(pageInt),
		review.WithProjectID(projectID),
	)

	if userID != "" {
		options = append(options, review.WithReviewerUserID(userID))
	}
	if searchQuery != "" {
		options = append(options, review.WithSearch(searchQuery))
	}
	fields, ok := ctx.GetQueryArray("fields")
	if ok {
		var requiredFields []string
		for _, item := range fields {
			if helpers.ArrayIncludes(review.ReviewFields, item) {
				requiredFields = append(requiredFields, item)
			}
		}

		if helpers.ArrayIncludes(requiredFields, "project_owner") {
			options = append(options, review.WithProjectOwner(true))
		}

		if len(requiredFields) > 0 {
			options = append(options, review.WithFields(requiredFields))
		}
	} else {
		options = append(options, review.WithProjectOwner(true))
	}

	reviews, total, err := review.GetReviewsByProject(options...)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	paginated, err := helpers.PaginateApiResponse(reviews, total, limitInt, pageInt, ctx.FullPath())
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	helpers.FormatAPIResponse(ctx, http.StatusOK, paginated)
}