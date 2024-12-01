package project

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/imshawan/RefineIt/infra/database"
	"github.com/imshawan/RefineIt/internal/user"
	"github.com/imshawan/RefineIt/models"
	"github.com/lib/pq"
)

// Options structure for GetProjects function
type GetProjectsOptions struct {
	Page          int
	PageSize      int
	SortBy        string
	Search        string
	Fields        []string
	PopulateOwner bool
	OwnerFields   []string
	UserID        string
}

// Default values for parameters
const (
	DefaultPage          = 1
	DefaultPageSize      = 10
	DefaultSortBy        = "latest"
	DefaultSearch        = ""
	DefaultFieldCount    = 0
	DefaultPopulateOwner = false
)

// Function to get projects with pagination, sorting, and search
func GetProjects(opts ...func(*GetProjectsOptions)) ([]map[string]interface{}, int, error) {
	// Initialize options with default values
	options := &GetProjectsOptions{
		Page:          DefaultPage,
		PageSize:      DefaultPageSize,
		SortBy:        DefaultSortBy,
		Search:        DefaultSearch,
		Fields:        ProjectFields,
		PopulateOwner: DefaultPopulateOwner,
		OwnerFields:   user.PublicFields,
		UserID:        "",
	}

	// Apply functional options
	for _, opt := range opts {
		opt(options)
	}

	if options.PopulateOwner && !Includes(options.Fields, "owner_id") {
		options.Fields = append(options.Fields, "owner_id")
	}

	var fields []string
	for _, field := range options.Fields {
		fields = append(fields, "project."+field)
	}

	fieldList := strings.Join(fields, ", ")

	// Prepare query to get the documents
	query := fmt.Sprintf(`SELECT %s, jsonb_build_object() AS owner FROM projects as project `, fieldList)

	if options.UserID != "" {
		query = fmt.Sprintf(`SELECT %s, jsonb_build_object() AS owner,
		 CASE WHEN stars.user_id IS NOT NULL THEN true ELSE false END AS self_starred
		 FROM projects as project
		 LEFT JOIN stars ON project.id = stars.project_id AND stars.user_id = $2`, fieldList)
	}

	if options.PopulateOwner {
		var ownerFields []string
		for _, field := range options.OwnerFields {
			ownerFields = append(ownerFields, fmt.Sprintf("'%s', users.%s", field, field))
		}

		ownerFieldList := strings.Join(ownerFields, ", ")
		query = fmt.Sprintf(`SELECT %s, jsonb_build_object(%s) AS owner FROM projects as project LEFT JOIN users ON project.owner_id = users.id `, fieldList, ownerFieldList)

		if options.UserID != "" {
			query = fmt.Sprintf(
				`SELECT %s, jsonb_build_object(%s) AS owner,
				 CASE WHEN stars.user_id IS NOT NULL THEN true ELSE false END AS self_starred
				 FROM projects as project 
				 LEFT JOIN users ON project.owner_id = users.id
				 LEFT JOIN stars ON project.id = stars.project_id AND stars.user_id = $2`,
				 fieldList, ownerFieldList)
		}
	}

	query += " WHERE (project.name ILIKE $1 OR project.slug ILIKE $1 OR project.description ILIKE $1) "

	// Sorting options
	sortOptions := map[string]string{
		"latest":             "project.created_at DESC",
		"oldest":             "project.created_at ASC",
		"reviews_count":      "project.reviews_count DESC",
		"contributors_count": "project.contributors_count DESC",
		"stars_count":        "project.stars_count DESC",
		"review_type":        "project.review_type ASC",
		"priority":           "project.priority ASC",
	}

	// Apply sorting
	sortOrder, ok := sortOptions[options.SortBy]
	if !ok {
		sortOrder = "project.created_at DESC" // Default sort order
	}

	// Query to get the total number of documents
	countQuery := `SELECT COUNT(*) FROM projects
        WHERE (name ILIKE $1 OR slug ILIKE $1 OR description ILIKE $1)`

	query += " ORDER BY " + sortOrder

	offset := (options.Page - 1) * options.PageSize
	query += fmt.Sprintf(" LIMIT %d OFFSET %d ", options.PageSize, offset)

	var total int = 0
	err := database.Client.QueryRow(countQuery, "%"+options.Search+"%").Scan(&total)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "42703" {
			return nil, 0, fmt.Errorf("error occured while data retrival due to schema mismatch")
		}
		return nil, 0, err
	}

	// Execute the query
	var rows *sql.Rows
	if options.PopulateOwner && options.UserID != "" {
		rows, err = database.Client.Query(query, "%"+options.Search+"%", options.UserID)
	} else {
		rows, err = database.Client.Query(query, "%"+options.Search+"%")
	}
	if err != nil {
		fmt.Println(err)
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "42703" {
			return nil, 0, fmt.Errorf("error occured while data retrival due to schema mismatch")
		}
		return nil, 0, err
	}
	defer rows.Close()

	// Preparing to store results
	columns, err := rows.Columns()
	if err != nil {
		return nil, 0, err
	}

	var results []map[string]interface{}

	for rows.Next() {
		columnsData := make([]interface{}, len(columns))
		columnsDataPointers := make([]interface{}, len(columns))

		columnTypes, err := rows.ColumnTypes()
		if err != nil {
			return nil, 0, err
		}

		for i, colType := range columnTypes {
			switch colType.DatabaseTypeName() {
			case "TEXT[]", "_TEXT":
				columnsData[i] = new(pq.StringArray) // Handling TEXT[] as pq.StringArray
			case "JSONB", "JSON": // Handling JSON/JSONB
				columnsData[i] = new([]byte) // Using []byte to read JSON
			default:
				columnsData[i] = new(interface{}) // Handling any other types
			}
			columnsDataPointers[i] = columnsData[i]
		}

		err = rows.Scan(columnsDataPointers...)
		if err != nil {
			return nil, 0, err
		}

		rowMap := make(map[string]interface{})
		for i, colName := range columns {
			switch v := columnsData[i].(type) {
			case *pq.StringArray:
				rowMap[colName] = *v // Extract and store the pq.StringArray directly
			case *[]byte: // Handle JSON fields as []byte
				var jsonData interface{}
				if err := json.Unmarshal(*v, &jsonData); err != nil {
					rowMap[colName] = nil // or handle error as needed
				} else {
					rowMap[colName] = jsonData
				}
			case *interface{}:
				rowMap[colName] = *v // Extract and store the other types directly
			default:
				rowMap[colName] = v // Fallback for unexpected types
			}
		}
		results = append(results, rowMap)
	}

	return results, total, nil
}

// WithPage sets the page number
func WithPage(page int) func(*GetProjectsOptions) {
	return func(opts *GetProjectsOptions) {
		opts.Page = page
	}
}

// WithPageSize sets the page size
func WithPageSize(pageSize int) func(*GetProjectsOptions) {
	return func(opts *GetProjectsOptions) {
		opts.PageSize = pageSize
	}
}

// WithSortBy sets the sort order
func WithSortBy(sortBy string) func(*GetProjectsOptions) {
	return func(opts *GetProjectsOptions) {
		opts.SortBy = sortBy
	}
}

// WithSearch sets the search term
func WithSearch(search string) func(*GetProjectsOptions) {
	return func(opts *GetProjectsOptions) {
		opts.Search = search
	}
}

// WithFields sets the fields to retrieve
func WithFields(fields []string) func(*GetProjectsOptions) {
	return func(opts *GetProjectsOptions) {
		opts.Fields = fields
	}
}

// WithOwner sets if owner info has to be populated
func WithOwner(value bool) func(*GetProjectsOptions) {
	return func(opts *GetProjectsOptions) {
		opts.PopulateOwner = value
	}
}

// WithOwnerFields defines the owner schema fields to retrieve for a project
func WithOwnerFields(fields []string) func(*GetProjectsOptions) {
	return func(opts *GetProjectsOptions) {
		opts.OwnerFields = fields
	}
}

// WithStarredByUser sets the user ID to get if projects are starred by the user
func WithStarredByUser(userID string) func(*GetProjectsOptions) {
	return func(opts *GetProjectsOptions) {
		opts.UserID = userID
	}
}

// Includes checks if a string is present in an array
func Includes(arr []string, str string) bool {
	for _, v := range arr {
		if v == str {
			return true
		}
	}
	return false
}

func GetProjectBySlugWithOwner(slug string, caller string) (models.Project, error) {
	var projectData models.Project
	if slug == "" {
		return projectData, fmt.Errorf("slug is required")
	}

	return GetProjectBy("slug", slug, caller)
}

func GetProjectByIdWithOwner(id string, caller string) (models.Project, error) {
	var projectData models.Project
	if id == "" {
		return projectData, fmt.Errorf("id is required")
	}

	return GetProjectBy("id", id, caller)
}

// We need the caller information here so that we could determine if the person has starred the project or not
func GetProjectBy(field string, value string, caller string) (models.Project, error) {
	var projectData models.Project
	var fields []string
	for _, field := range ProjectFields {
		fields = append(fields, "project."+field)
	}

	var ownerFields []string
	for _, field := range user.PublicFields {
		ownerFields = append(ownerFields, fmt.Sprintf("'%s', users.%s", field, field))
	}

	ownerFieldList := strings.Join(ownerFields, ", ")

	query := fmt.Sprintf(`
		SELECT %s, 
		jsonb_build_object(%s) AS owner,
		CASE WHEN stars.user_id IS NOT NULL THEN true ELSE false END AS self_starred 
		FROM projects as project 
		LEFT JOIN stars ON project.id = stars.project_id AND stars.user_id = $2
		LEFT JOIN users ON project.owner_id = users.id WHERE project.%s = $1`, strings.Join(fields, ", "), ownerFieldList, field)

	var ownerRaw json.RawMessage
	var language json.RawMessage
	var selfStarred bool
	err := database.Client.QueryRow(query, value, caller).Scan(&projectData.ID, &projectData.Name, &projectData.Slug, &projectData.Description, &projectData.About, &projectData.ReviewType, &projectData.RepositoryURL, &projectData.Filename, &projectData.FileUrl,
		&projectData.Visibility, &projectData.OwnerID, pq.Array(&projectData.Tags), &projectData.ReviewsCount, &projectData.StarsCount,
		&projectData.LastReviewedAt, &projectData.IsFeatured, &projectData.ContributorsCount,
		&projectData.Priority, &projectData.CreatedAt, &projectData.UpdatedAt, &language, &ownerRaw, &selfStarred)
	if err != nil {
		if err == sql.ErrNoRows {
			// Handle the case where no rows were found
			return projectData, fmt.Errorf("no project found with the given %s", field)
		}
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "42703" {
			return projectData, fmt.Errorf("error occured while data retrival due to schema mismatch")
		}
		return projectData, err
	}

	var ownerMap map[string]interface{}
	err = json.Unmarshal(ownerRaw, &ownerMap)
	if err != nil {
		return projectData, err // Handle JSON unmarshal error
	}

	var langJSON map[string]interface{}
	err = json.Unmarshal(language, &langJSON)
	if err != nil {
		return projectData, err
	}

	projectData.Owner = ownerMap
	projectData.SelfStarred = &selfStarred
	projectData.Language = langJSON

	return projectData, nil
}
