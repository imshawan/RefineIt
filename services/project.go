package services

import (
	"errors"
	"net/http"
	"reflect"
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
	user, _ := ctx.Get("User")
	
	var options []func(*project.GetProjectsOptions)

	Page := 1
	Limit := 10

	ownerFields := []string{"fullname", "username", "profile_picture"}

	options = append(options, project.WithOwner(true), project.WithOwnerFields(ownerFields))
	userData, ok := user.(models.User)
	if ok {
		options = append(options, project.WithStarredByUser(userData.ID))
	}

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
	user, _ := ctx.Get("User")
	slug := ctx.Param("slug")

	var userID = ""

	if len(slug) == 0 {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, errors.New("slug is required"))
		return
	}

	userData, ok := user.(models.User)
	if ok {
		userID = userData.ID
	}

	projectData, err := project.GetProjectBySlugWithOwner(slug, userID)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	helpers.FormatAPIResponse(ctx, http.StatusOK, projectData)
}

func UpdateProjectInfo(ctx *gin.Context) {
	id := ctx.Param("id")
	user, _ := ctx.Get("User")

	loggedInUser, ok := user.(models.User)
	if !ok {
		helpers.FormatAPIResponse(ctx, http.StatusUnauthorized, errors.New("failed to assert user type"))
		return
	}

	if len(id) == 0 {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, errors.New("id is required"))
		return
	}

	exists, err := project.GetProjectByIdWithOwner(id, loggedInUser.ID)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, err)
		return
	}

	if loggedInUser.ID != exists.OwnerID {
		helpers.FormatAPIResponse(ctx, http.StatusUnauthorized, errors.New("you are not allowed to perform this operation"))
		return
	}

	var projectReq models.ProjectUpdateRequest
	if err := ctx.ShouldBind(&projectReq); err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, err)
		return
	}

	projectData := make(map[string]interface{})

	// Use reflection to iterate over the fields
	_value := reflect.ValueOf(projectReq)
	_type := _value.Type()

	for i := 0; i < _value.NumField(); i++ {
		fieldValue := _value.Field(i)
		fieldType := _type.Field(i)

		// Check if the field is a pointer and not nil
		if fieldValue.Kind() == reflect.Ptr && !fieldValue.IsNil() {
			projectData[fieldType.Name] = fieldValue.Elem().Interface() // Dereference the pointer
		} else if fieldValue.Kind() != reflect.Ptr && fieldValue.IsValid() && !helpers.IsZero(fieldValue) {
			projectData[fieldType.Name] = fieldValue.Interface()
		}
	}

	if len(projectData) == 0 {
		helpers.FormatAPIResponse(ctx, http.StatusOK, nil)
		return
	}

	_err := project.UpdateProject(id, projectData)
	if _err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, _err)
		return
	}

	updatedProject, err := project.GetProjectByIdWithOwner(id, loggedInUser.ID)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	helpers.FormatAPIResponse(ctx, http.StatusOK, gin.H{"message": "Project updated successfully", "project": updatedProject})
}

func StarProject(ctx *gin.Context) {
	id := ctx.Param("id")
	user, _ := ctx.Get("User")

	loggedInUser, ok := user.(models.User)
	if !ok {
		helpers.FormatAPIResponse(ctx, http.StatusUnauthorized, errors.New("failed to assert user type"))
		return
	}

	if len(id) == 0 {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, errors.New("id is required"))
		return
	}

	_, err := project.GetProjectByIdWithOwner(id, loggedInUser.ID)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, err)
		return
	}

	err = project.Star(id, loggedInUser.ID)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	helpers.FormatAPIResponse(ctx, http.StatusOK, gin.H{"message": "Project added to starred"})
}

func UnStarProject(ctx *gin.Context) {
	id := ctx.Param("id")
	user, _ := ctx.Get("User")

	loggedInUser, ok := user.(models.User)
	if !ok {
		helpers.FormatAPIResponse(ctx, http.StatusUnauthorized, errors.New("failed to assert user type"))
		return
	}

	if len(id) == 0 {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, errors.New("id is required"))
		return
	}

	_, err := project.GetProjectByIdWithOwner(id, loggedInUser.ID)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusBadRequest, err)
		return
	}

	err = project.UnStar(id, loggedInUser.ID)
	if err != nil {
		helpers.FormatAPIResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	helpers.FormatAPIResponse(ctx, http.StatusOK, gin.H{"message": "Project removed from starred collection"})
}
