package services

import (
	"errors"
	"net/http"
	"strconv"

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

func GetProjectsWithFilters(ctx *gin.Context) {
	var options []func(*project.GetProjectsOptions)

	Page := 1
	Limit := 10

	ownerFields := []string{"fullname", "username", "profile_picture"}

	options = append(options, project.WithOwner(true), project.WithOwnerFields(ownerFields))

	page, exists := ctx.GetQuery("page")
	if exists {
		pageInt, err := strconv.Atoi(page)
		if err == nil { // Only append the option if the conversion is successful
			Page = pageInt
			options = append(options, project.WithPage(pageInt))
		}
	} else {
		options = append(options, project.WithPage(1))
	}

	limit, exists := ctx.GetQuery("limit")
	if exists {
		limitInt, err := strconv.Atoi(limit)
		if err == nil {
			Limit = limitInt
			options = append(options, project.WithPageSize(limitInt))
		}
	} else {
		options = append(options, project.WithPageSize(10))
	}

	sortBy, exists := ctx.GetQuery("sortBy")
	if exists {
		options = append(options, project.WithSortBy(sortBy))
	}

	search, exists := ctx.GetQuery("q")
	if exists {
		options = append(options, project.WithSearch(search))
	}

	projects, total, err := project.GetProjects(options...)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	paginated, err := helpers.PaginateApiResponse(projects, total, Limit, Page, ctx.FullPath())
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	helpers.FormatAPIResponse(ctx, http.StatusOK, paginated)
}

func GetProjectBySlug(ctx *gin.Context) {
	slug := ctx.Param("slug")

	if len(slug) == 0 {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, errors.New("slug is required"))
		return
	}

	projectData, err := project.GetProjectBySlugWithOwner(slug)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	helpers.FormatAPIResponse(ctx, http.StatusOK, projectData)
}