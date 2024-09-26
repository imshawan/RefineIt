package routers

import (
	"github.com/gin-gonic/gin"
	"github.com/imshawan/RefineIt/models"
	"github.com/imshawan/RefineIt/routers/middlewares"
	"github.com/imshawan/RefineIt/services"
)

func RegisterProjectRoutes(router *gin.RouterGroup) {
	router.GET("/",middlewares.CheckIfAuthenticated(), services.GetProjectsWithFilters)
	router.GET("/:slug", middlewares.CheckIfAuthenticated(), services.GetProjectBySlug)
	router.POST("/new", middlewares.IsAuthenticated(), middlewares.ValidateRequestFields(&models.ProjectCreationRequest{}), services.CreateProject)
	router.PUT("/update/:id", middlewares.IsAuthenticated(), services.UpdateProjectInfo)
	router.POST("/star/:id", middlewares.IsAuthenticated(), services.StarProject)
	router.POST("/unstar/:id", middlewares.IsAuthenticated(), services.UnStarProject)
}
