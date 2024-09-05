package project

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/imshawan/RefineIt/infra/database"
	"github.com/imshawan/RefineIt/internal/user"
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

	if options.PopulateOwner {
		var ownerFields []string
		for _, field := range options.OwnerFields {
			ownerFields = append(ownerFields, fmt.Sprintf("'%s', users.%s", field, field))
		}

		ownerFieldList := strings.Join(ownerFields, ", ")
		query = fmt.Sprintf(`SELECT %s, jsonb_build_object(%s) AS owner FROM projects as project LEFT JOIN users ON project.owner_id = users.id `, fieldList, ownerFieldList)
	}

	query += " WHERE (project.name ILIKE $1 OR project.description ILIKE $1) "

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
        WHERE (name ILIKE $1 OR description ILIKE $1)`

	query += " ORDER BY " + sortOrder

	offset := (options.Page - 1) * options.PageSize
	query += fmt.Sprintf(" LIMIT %d OFFSET %d ", options.PageSize, offset)

	var total int = 0
	err := database.Client.QueryRow(countQuery, "%"+options.Search+"%").Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Execute the query
	rows, err := database.Client.Query(query, "%"+options.Search+"%")
	if err != nil {
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
				columnsData[i] = new(pq.StringArray) // Handle TEXT[] as pq.StringArray
			case "JSONB", "JSON": // Handle JSON/JSONB
				columnsData[i] = new([]byte) // Use []byte to read JSON
			default:
				columnsData[i] = new(interface{}) // Handle other types
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

// Includes checks if a string is present in an array
func Includes(arr []string, str string) bool {
	for _, v := range arr {
		if v == str {
			return true
		}
	}
	return false
}
