package project

import (
	"fmt"
	"strings"

	"github.com/imshawan/RefineIt/infra/database"
)

// Options structure for GetProjects function
type GetProjectsOptions struct {
	Page     int
	PageSize int
	SortBy   string
	Search   string
	Fields   []string
}

// Default values for parameters
const (
	DefaultPage       = 1
	DefaultPageSize   = 10
	DefaultSortBy     = "latest"
	DefaultSearch     = ""
	DefaultFieldCount = 0
)

// Function to get projects with pagination, sorting, and search
func GetProjects(opts ...func(*GetProjectsOptions)) ([]map[string]interface{}, int, error) {
	// Initialize options with default values
	options := &GetProjectsOptions{
		Page:     DefaultPage,
		PageSize: DefaultPageSize,
		SortBy:   DefaultSortBy,
		Search:   DefaultSearch,
		Fields:   ProjectFields,
	}

	// Apply functional options
	for _, opt := range opts {
		opt(options)
	}

	fieldList := strings.Join(options.Fields, ", ")
	if len(options.Fields) < 1 {
		fieldList = strings.Join(ProjectFields, ", ")
	}

	// Query to get the total number of documents
	query := fmt.Sprintf(`
        SELECT %s
        FROM projects
        WHERE (name ILIKE $1 OR description ILIKE $1)
    `, fieldList)

	// Sorting options
	sortOptions := map[string]string{
		"latest":             "created_at DESC",
		"oldest":             "created_at ASC",
		"reviews_count":      "reviews_count DESC",
		"contributors_count": "contributors_count DESC",
		"stars_count":        "stars_count DESC",
		"review_type":        "review_type ASC",
		"priority":           "priority ASC",
	}

	// Apply sorting
	sortOrder, ok := sortOptions[options.SortBy]
	if !ok {
		sortOrder = "created_at DESC" // Default sort order
	}

	// Query to get the total number of documents
    countQuery := `SELECT COUNT(*) FROM projects
        WHERE (name ILIKE $1 OR description ILIKE $1)`

	query += " ORDER BY " + sortOrder

	offset := (options.Page - 1) * options.PageSize
	query += fmt.Sprintf(" LIMIT %d OFFSET %d", options.PageSize, offset)

	var total int = 0
    err := database.Client.QueryRow(countQuery, "%"+options.Search+"%").Scan(&total); if err != nil {
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
		for i := range columnsData {
			columnsDataPointers[i] = &columnsData[i]
		}

		err := rows.Scan(columnsDataPointers...)
		if err != nil {
			return nil, 0, err
		}

		rowMap := make(map[string]interface{})
		for i, colName := range columns {
			rowMap[colName] = columnsData[i]
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
