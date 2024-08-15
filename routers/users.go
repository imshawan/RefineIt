package routers

import (
	"github.com/gin-gonic/gin"
	"github.com/imshawan/RefineIt/models"
	"github.com/imshawan/RefineIt/routers/middlewares"
	"github.com/imshawan/RefineIt/services"
)

func RegisterUserRoutes(router *gin.RouterGroup) {
	router.GET("/", middlewares.IsAuthenticated(), services.UserProfile)
	router.POST("/register", middlewares.ValidateRequestFields(&models.UserRequest{}), services.RegisterUser)
}
