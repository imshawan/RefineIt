package routers

import (
	"github.com/gin-gonic/gin"
	"github.com/imshawan/RefineIt/routers/middlewares"
	"github.com/imshawan/RefineIt/services"
)

func RegisterCommonRoutes(router *gin.RouterGroup) {
	router.POST("/file-upload", middlewares.IsAuthenticated(), services.UploadFiles)
}
