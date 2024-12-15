package routers

import (
	"github.com/gin-gonic/gin"
	"github.com/imshawan/RefineIt/models"
	"github.com/imshawan/RefineIt/routers/middlewares"
	"github.com/imshawan/RefineIt/services"
)

func RegisterReviewRoutes(router *gin.RouterGroup) {
	router.POST("/new", middlewares.IsAuthenticated(), middlewares.ValidateRequestFields(&models.ReviewRequest{}), services.CreateReview)
	router.GET("/project/:project_id", middlewares.IsAuthenticated(), services.GetReviewByProjectIdAndUser)
	router.GET("/project/:project_id/all", middlewares.IsAuthenticated(), services.GetAllReviews)
	router.PUT("/update/:review_id", middlewares.IsAuthenticated(), middlewares.ValidateRequestFields(&models.ReviewRequest{}), services.UpdateReviewData)
}
