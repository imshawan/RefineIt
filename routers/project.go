package routers

import (
	"github.com/gin-gonic/gin"
	"github.com/imshawan/RefineIt/models"
	"github.com/imshawan/RefineIt/routers/middlewares"
	"github.com/imshawan/RefineIt/services"
)

func RegisterProjectRoutes(router *gin.RouterGroup) {
	router.GET("/", services.GetProjectsWithFilters)
	router.GET("/:slug", services.GetProjectBySlug)
	router.POST("/new", middlewares.IsAuthenticated(), middlewares.ValidateRequestFields(&models.ProjectCreationRequest{}), services.CreateProject)
	router.PUT("/update/:id", middlewares.IsAuthenticated(), services.UpdateProjectInfo)
}
