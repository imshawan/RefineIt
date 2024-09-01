package helpers

import (
	"errors"
	"fmt"
	"math"
	"net/url"
	"strconv"
	"strings"
)

// Pagination holds the structure for paginated results
type Pagination struct {
    Data        []map[string]interface{} `json:"data"`
    CurrentPage int                      `json:"current_page"`
    PerPage     int                      `json:"per_page"`
    TotalPages  int                      `json:"total_pages"`
    TotalItems  int                      `json:"total_items"`
    Navigation  NavigationLinks          `json:"navigation"`
    // Start       int                      `json:"start"`
    // End         int                      `json:"end"`
}


// NavigationLinks holds URLs for pagination navigation
type NavigationLinks struct {
	Current  string `json:"current"`
	Next     string `json:"next"`
	Previous string `json:"previous"`
}

// PaginateApiResponse function to handle pagination logic
func PaginateApiResponse(items []map[string]interface{}, total int, limit int, page int, baseUrl string) (*Pagination, error) {
	if items == nil {
		items = []map[string]interface{}{}
	}
	if limit <= 0 {
		return nil, errors.New("limit should be a positive number")
	}
	if page <= 0 {
		return nil, errors.New("page must be a non-zero positive number")
	}
	if baseUrl == "" {
		return nil, errors.New("baseUrl is a required parameter")
	}

	// Calculate pagination indexes
	// startIndex := (page - 1) * limit
	// endIndex := int(math.Min(float64(startIndex+limit), float64(len(items))))

	// Calculate the total number of pages
	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	// Generate URLs for the current, next, and previous pages
	currentPageUrl, err := UrlQueryBuilder(baseUrl, map[string]string{"page": strconv.Itoa(page)})
	if err != nil {
		return nil, err
	}
	nextPageUrl := ""
	if page < totalPages {
		nextPageUrl, _ = UrlQueryBuilder(baseUrl, map[string]string{"page": strconv.Itoa(page + 1)})
	}
	prevPageUrl := ""
	if page > 1 {
		prevPageUrl, _ = UrlQueryBuilder(baseUrl, map[string]string{"page": strconv.Itoa(page - 1)})
	}

	// Set up navigation links
	navigation := NavigationLinks{
		Current:  currentPageUrl,
		Next:     nextPageUrl,
		Previous: prevPageUrl,
	}

	// Create the pagination structure
	pagination := &Pagination{
		Data:        items,
		CurrentPage: page,
		PerPage:     limit,
		TotalPages:  totalPages,
		TotalItems:  total,
		Navigation:  navigation,
	}

	return pagination, nil
}

// UrlQueryBuilder constructs a URL with the given baseURL and query parameters
func UrlQueryBuilder(baseURL string, params map[string]string) (string, error) {
	if baseURL == "" {
		return "", errors.New("baseURL is a required parameter")
	}

	baseURL = strings.TrimSpace(baseURL)

	urlParts := strings.SplitN(baseURL, "?", 2)
	base := urlParts[0]
	queryString := ""
	if len(urlParts) > 1 {
		queryString = urlParts[1]
	}

	queryParams, err := url.ParseQuery(queryString)
	if err != nil {
		return "", err
	}

	for key, value := range params {
		queryParams.Set(key, value)
	}

	finalQueryString := queryParams.Encode()

	var updatedURL string
	if finalQueryString != "" {
		updatedURL = fmt.Sprintf("%s?%s", base, finalQueryString)
	} else {
		updatedURL = base
	}

	return updatedURL, nil
}
