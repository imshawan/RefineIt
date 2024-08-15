package database

import (
    "database/sql"
    "fmt"

    _ "github.com/lib/pq"
    "github.com/spf13/viper"
)

// Postgres holds the PostgreSQL database connection
var Client *sql.DB

// SetupDbConnection sets up the connection to the PostgreSQL database
func SetupDbConnection() error {

    // Retrieve the connection string from the configuration
    connString := viper.GetString("GOOSE_DBSTRING")

    // Open a connection to the PostgreSQL database
    db, err := sql.Open("postgres", connString)
    if err != nil {
        return fmt.Errorf("failed to open database connection: %w", err)
    }

    // Ping the database to ensure that the connection is established
    if err := db.Ping(); err != nil {
        return fmt.Errorf("failed to ping database: %w", err)
    }

    fmt.Println("Successfully connected to PostgreSQL!")

    // Assign the database connection to the global variable
    Client = db

    return nil
}
