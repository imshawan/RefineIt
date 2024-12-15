package review

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/imshawan/RefineIt/helpers"
	"github.com/imshawan/RefineIt/infra/database"
	"github.com/imshawan/RefineIt/internal/project"
	"github.com/imshawan/RefineIt/internal/user"
	"github.com/imshawan/RefineIt/models"
	"github.com/lib/pq"
)

type GetReviewsOptions struct {
	Page                 int
	PageSize             int
	SortBy               string
	Search               string
	Fields               []string
	PopulateProjectOwner bool
	ProjectOwnerFields   []string
	UserID               string
	ProjectID            string
}

// Default values for parameters
const (
	DefaultPage                 = 1
	DefaultPageSize             = 10
	DefaultSortBy               = "latest"
	DefaultSearch               = ""
	DefaultFieldCount           = 0
	DefaultPopulateProjectOwner = false
)

func GetReviewByCallerAndProjectId(projectId string, callerId string) (models.Review, error) {
	review := models.Review{}

	var fields []string
	var userFields []string
	var projectFields []string
	for _, field := range ReviewFields {
		fields = append(fields, "review."+field)
	}

	for _, field := range user.PublicFields {
		userFields = append(userFields, fmt.Sprintf("'%s', users.%s", field, field))
	}

	for _, field := range project.ProjectFields {
		projectFields = append(projectFields, fmt.Sprintf("'%s', project.%s", field, field))
	}

	userFieldList := strings.Join(userFields, ", ")

	query := fmt.Sprintf(`
    SELECT %s, 
           jsonb_build_object(%s) AS project_owner,
           jsonb_build_object(%s) AS reviewer,
           jsonb_build_object(%s) AS project
    FROM reviews AS review
    LEFT JOIN users AS project_owner ON review.project_owner_id = project_owner.id
    LEFT JOIN users AS reviewer ON review.reviewer_id = reviewer.id
    LEFT JOIN projects AS project ON review.project_id = project.id
    WHERE review.project_id = $1 AND review.reviewer_id = $2`,
		strings.Join(fields, ", "),                                  // Fields from the reviews table
		strings.ReplaceAll(userFieldList, "users", "project_owner"), // Fields for the project owner (from users)
		strings.ReplaceAll(userFieldList, "users", "reviewer"),      // Fields for the reviewer (from users)
		strings.Join(projectFields, ", "),                           // Fields for the project (from projects)
	)

	var projectOwner json.RawMessage
	var reviewer json.RawMessage
	var projectData json.RawMessage
	var diffsData json.RawMessage

	err := database.Client.QueryRow(query, projectId, callerId).Scan(
		&review.ID, &review.Title, &review.Content, &diffsData, &review.Rating, &review.ProjectID, &review.ProjectOwnerID, &review.ReviewerID,
		&review.Status, pq.Array(&review.Tags), &review.UpvotesCount, &review.DownvotesCount,
		&review.IsHighlighted, &review.CommentsCount, &review.LastCommentedAt, &review.CreatedAt, &review.UpdatedAt, &projectOwner,
		&reviewer, &projectData,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return review, fmt.Errorf("no review found with the given project id")
		}
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "42703" {
			return review, fmt.Errorf("error occured while data retrival due to schema mismatch")
		}
		return review, err
	}

	var ownerMap map[string]interface{}
	var reviewerMap map[string]interface{}
	var projectMap map[string]interface{}
	var diffsMap map[string]interface{}
	err = json.Unmarshal(projectOwner, &ownerMap)
	if err != nil {
		return review, err
	}
	err = json.Unmarshal(reviewer, &reviewerMap)
	if err != nil {
		return review, err
	}
	err = json.Unmarshal(projectData, &projectMap)
	if err != nil {
		return review, err
	}
	err = json.Unmarshal(diffsData, &diffsMap)
	if err != nil {
		return review, err
	}

	review.Project = projectMap
	review.Reviewer = reviewerMap
	review.ProjectOwner = ownerMap
	review.Diffs = diffsMap

	return review, nil
}

func GetReviewsByProject(opts ...func(*GetReviewsOptions)) ([]map[string]interface{}, int, error) {
	options := &GetReviewsOptions{
		Page:                 DefaultPage,
		PageSize:             DefaultPageSize,
		SortBy:               DefaultSortBy,
		Search:               DefaultSearch,
		Fields:               ReviewFields,
		PopulateProjectOwner: DefaultPopulateProjectOwner,
		ProjectOwnerFields:   user.PublicFields,
		UserID:               "",
	}

	for _, opt := range opts {
		opt(options)
	}

	if options.PopulateProjectOwner && !helpers.ArrayIncludes(options.Fields, "project_owner_id") {
		options.Fields = append(options.Fields, "project_owner_id")
	}

	var fields []string
	for _, field := range options.Fields {
		fields = append(fields, "review."+field)
	}

	fieldList := strings.Join(fields, ", ")

	query := fmt.Sprintf(`SELECT %s, jsonb_build_object() AS project_owner FROM reviews as review `, fieldList)

	if options.UserID != "" {
		query = fmt.Sprintf(`SELECT %s, jsonb_build_object() AS project_owner
		 FROM reviews as review `, fieldList)
	}

	if options.PopulateProjectOwner {
		var projectAuthorFields []string
		for _, field := range options.ProjectOwnerFields {
			projectAuthorFields = append(projectAuthorFields, fmt.Sprintf("'%s', users.%s", field, field))
		}

		ownerFieldList := strings.Join(projectAuthorFields, ", ")
		query = fmt.Sprintf(`SELECT %s, jsonb_build_object(%s) AS project_owner FROM reviews as review LEFT JOIN users ON review.project_owner_id = users.id `, fieldList, ownerFieldList)
	}

	query += " WHERE (review.title ILIKE $1) "
	if options.UserID != "" {
		query += " AND reviewer_id = $2"
	}

	sortOptions := map[string]string{
		"latest":          "review.created_at DESC",
		"oldest":          "review.created_at ASC",
		"rating":          "review.rating DESC",
		"upvotes_count":   "review.upvotes_count DESC",
		"downvotes_count": "review.downvotes_count DESC",
		"comments_count":  "review.comments_count DESC",
	}

	// Apply sorting
	sortOrder, ok := sortOptions[options.SortBy]
	if !ok {
		sortOrder = "review.created_at DESC" // Default sort order
	}

	// Query to get the total number of documents
	countQuery := `SELECT COUNT(*) FROM reviews
        WHERE (title ILIKE $1)`

	query += " ORDER BY " + sortOrder

	offset := (options.Page - 1) * options.PageSize
	query += fmt.Sprintf(" LIMIT %d OFFSET %d ", options.PageSize, offset)

	var total int = 0
	var countQueryError error
	if options.UserID != "" {
		countQuery += " AND reviewer_id = $2"
		countQueryError = database.Client.QueryRow(countQuery, "%"+options.Search+"%", options.UserID).Scan(&total)
		if countQueryError != nil {
			return nil, 0, countQueryError
		}
	} else {
		countQueryError = database.Client.QueryRow(countQuery, "%"+options.Search+"%").Scan(&total)
		if countQueryError != nil {
			return nil, 0, countQueryError
		}
	}
	if countQueryError != nil {
		if pqErr, ok := countQueryError.(*pq.Error); ok && pqErr.Code == "42703" {
			return nil, 0, fmt.Errorf("error occured while data retrival due to schema mismatch")
		}
		return nil, 0, countQueryError
	}

	// Execute the query
	var rows *sql.Rows
	var err error
	if options.UserID != "" {
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
func WithPage(page int) func(*GetReviewsOptions) {
	return func(opts *GetReviewsOptions) {
		opts.Page = page
	}
}

// WithPageSize sets the page size
func WithPageSize(pageSize int) func(*GetReviewsOptions) {
	return func(opts *GetReviewsOptions) {
		opts.PageSize = pageSize
	}
}

// WithSortBy sets the sort order
func WithSortBy(sortBy string) func(*GetReviewsOptions) {
	return func(opts *GetReviewsOptions) {
		opts.SortBy = sortBy
	}
}

// WithSearch sets the search term
func WithSearch(search string) func(*GetReviewsOptions) {
	return func(opts *GetReviewsOptions) {
		opts.Search = search
	}
}

// WithFields sets the fields to retrieve
func WithFields(fields []string) func(*GetReviewsOptions) {
	return func(opts *GetReviewsOptions) {
		opts.Fields = fields
	}
}

// WithProjectOwner sets if project owner info has to be populated
func WithProjectOwner(value bool) func(*GetReviewsOptions) {
	return func(opts *GetReviewsOptions) {
		opts.PopulateProjectOwner = value
	}
}

// WithProjectOwnerFields defines the project owner schema fields to retrieve for a review
func WithProjectOwnerFields(fields []string) func(*GetReviewsOptions) {
	return func(opts *GetReviewsOptions) {
		opts.ProjectOwnerFields = fields
	}
}

// WithReviewerUserID sets the user ID to get reviews only by that user
func WithReviewerUserID(userID string) func(*GetReviewsOptions) {
	return func(opts *GetReviewsOptions) {
		opts.UserID = userID
	}
}

// WithProjectID sets the project id for which the reviews has to be retrived
func WithProjectID(projectID string) func(*GetReviewsOptions) {
	return func(opts *GetReviewsOptions) {
		opts.ProjectID = projectID
	}
}