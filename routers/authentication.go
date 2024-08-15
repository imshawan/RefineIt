package routers

import (
	"github.com/gin-gonic/gin"
	"github.com/imshawan/RefineIt/models"
	"github.com/imshawan/RefineIt/routers/middlewares"
	"github.com/imshawan/RefineIt/services"
)

func RegisterAuthRoutes(router *gin.RouterGroup) {
	router.POST("/sign-in", middlewares.ValidateRequestFields(&models.UserSigninRequest{}), services.SignIn)
}