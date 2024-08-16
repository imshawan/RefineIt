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

dev-app:
	cd web/app && \
	npm start

dev-website:
	cd web/website && \
	npm start

app:
	cd web/app && \
	npm install && npm run build

website:
	cd web/website && \
	npm install && npm run build