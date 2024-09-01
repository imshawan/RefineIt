package routers

import (
	"github.com/gin-gonic/gin"
	"github.com/imshawan/RefineIt/models"
	"github.com/imshawan/RefineIt/routers/middlewares"
	"github.com/imshawan/RefineIt/services"
)

func RegisterProjectRoutes(router *gin.RouterGroup) {
	router.POST("/", middlewares.IsAuthenticated(), middlewares.ValidateRequestFields(&models.ProjectCreationRequest{}), services.CreateProject)
}