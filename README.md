# RefineIt

## Getting Started

1. **Clone the repository:**

    ```bash
    git clone https://github.com/imshawan/RefineIt.git
    cd RefineIt
    ```

2. **Copy the example environment file and update the values:**

    ```bash
    cp .env.example .env
    ```

3. **Install dependencies:**

    ```bash
    go mod tidy
    ```

4. **Run the application:**

    ```bash
    go run main.go
    ```

## Environment Variables

Update the `.env` file with your specific configurations before starting the app


## Major Dependencies

- [Gin Web Framework](https://github.com/gin-gonic/gin) for creating the REST APIs
- [MongoDB Go Driver](https://github.com/mongodb/mongo-go-driver) for communicating with MongoDB NoSql Database
- [JWT Go](https://github.com/golang-jwt/jwt/) for authentication purposes
- [Viper](github.com/spf13/viper) for config management throughout the application

## Development

This project uses [Air](https://github.com/air-verse/air) for live reloading during development. To use it:

1. **Install Air:**

    ```bash
    go install github.com/air-verse/air@latest
    ```

2. **Run the project using Air:**

    ```bash
    air
    ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b improvement/AmazingImprovements`)
3. Commit your changes (`git commit -m 'Added some amazing improvements'`)
4. Push to the branch (`git push origin improvement/AmazingImprovements`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
