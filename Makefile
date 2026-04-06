# Makefile for CalConFit

# Variables
NPM = npm
NODE_MODULES = node_modules

define check_prereqs
	@command -v node >/dev/null 2>&1 || { echo "❌ Node.js is not installed. Please install it first."; exit 1; }
	@command -v npm >/dev/null 2>&1 || { echo "❌ npm is not installed. Please install it first."; exit 1; }
endef

define check_node_modules
	@if [ ! -d "$(NODE_MODULES)" ]; then \
		echo "⚠️  node_modules not found. Run 'make install' first."; \
		exit 1; \
	fi
endef

.PHONY: help install clean reinstall dev build start lint format format-check check-types test-all db-push db-studio db-generate

help:
	@echo "Available commands:"
	@echo ""
	@echo "  Setup"
	@echo "    make install        - install dependencies"
	@echo "    make clean          - remove node_modules, .next, .turbo, and caches"
	@echo "    make reinstall      - clean + fresh install"
	@echo ""
	@echo "  Development"
	@echo "    make dev            - clear .next/.turbo caches, then start dev server"
	@echo "    make build          - build project for production"
	@echo "    make start          - start production server"
	@echo ""
	@echo "  Code Quality"
	@echo "    make lint           - run ESLint"
	@echo "    make format         - format code with Prettier"
	@echo "    make format-check   - check formatting with Prettier"
	@echo "    make check-types    - run TypeScript type check"
	@echo "    make test-all       - run all checks + build"
	@echo ""
	@echo "  Database"
	@echo "    make db-push        - push Prisma schema to database"
	@echo "    make db-studio      - open Prisma Studio"
	@echo "    make db-generate    - regenerate Prisma client"

install:
	$(call check_prereqs)
	$(NPM) install

clean:
	echo "🧹 Cleaning..."
	rm -rf $(NODE_MODULES) .next .turbo node_modules/.cache
	echo "✅ Clean complete"

reinstall: clean install

dev:
	$(call check_prereqs)
	$(call check_node_modules)
	echo "Clearing Next.js / Turbopack caches..."
	rm -rf .next .turbo node_modules/.cache
	$(NPM) run dev

build:
	$(call check_prereqs)
	$(call check_node_modules)
	$(NPM) run build

start:
	$(call check_prereqs)
	$(call check_node_modules)
	$(NPM) run start

lint:
	$(call check_prereqs)
	$(call check_node_modules)
	$(NPM) run lint

format:
	$(call check_prereqs)
	$(call check_node_modules)
	$(NPM) run format

format-check:
	$(call check_prereqs)
	$(call check_node_modules)
	$(NPM) run check-format

check-types:
	$(call check_prereqs)
	$(call check_node_modules)
	$(NPM) run check-types

test-all:
	$(call check_prereqs)
	$(call check_node_modules)
	$(NPM) run test-all

db-push:
	$(call check_prereqs)
	$(call check_node_modules)
	$(NPM) run db:push

db-studio:
	$(call check_prereqs)
	$(call check_node_modules)
	$(NPM) run db:studio

db-generate:
	$(call check_prereqs)
	$(call check_node_modules)
	npx prisma generate
