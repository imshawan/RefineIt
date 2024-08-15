ifneq (,$(wildcard .env))
    include .env
    export $(shell cat .env | xargs)
endif

export GOOSE_DRIVER=postgres
export GOOSE_DBSTRING=postgresql://postgres:root@localhost:5432/postgres?sslmode=disable

# Targets
migrate-up:
	goose -dir $(GOOSE_MIGRATION_DIR) up

migrate-down:
	goose -dir $(GOOSE_MIGRATION_DIR) down
