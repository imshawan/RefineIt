package services

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/imshawan/RefineIt/helpers"
	"github.com/imshawan/RefineIt/internal/project"
	"github.com/imshawan/RefineIt/models"
)

func CreateProject(ctx *gin.Context) {
	user, _ := ctx.Get("User")
	userData, ok := user.(models.User)
	if !ok {
		// Handle the case where the type assertion fails
		helpers.FormatAPIResponse(ctx, http.StatusUnauthorized, errors.New("failed to assert user to models.User"))
		return
	}

	var projectReq models.ProjectCreationRequest
	if err := ctx.ShouldBind(&projectReq); err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, err)
		return
	}

	newProject := models.Project{
		Name:          projectReq.Name,
		Slug:          projectReq.Slug,
		Description:   projectReq.Description,
		OwnerID:       userData.ID,
		ReviewType:    projectReq.ReviewType,
		RepositoryURL: projectReq.RepositoryURL,
		Filename:      projectReq.Filename,
		FileUrl:       projectReq.FileUrl,
		Visibility:    projectReq.Visibility,
		Tags:          projectReq.Tags,
	}

	projectData, err := project.CreateProject(newProject)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	helpers.FormatAPIResponse(ctx, http.StatusCreated, gin.H{"message": "Project created successfully", "project": projectData})

}
