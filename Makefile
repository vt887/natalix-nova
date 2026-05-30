.PHONY: install dev build typecheck lint test e2e clean zip help

NODE_MODULES := node_modules
DIST := dist
ZIP_NAME := natalix-nova.zip

help:
	@echo "Available targets:"
	@echo "  install  - Install dependencies"
	@echo "  dev      - Start development server with HMR"
	@echo "  build    - Build production extension"
	@echo "  lint     - Run ESLint"
	@echo "  typecheck- Run tsc --noEmit"
	@echo "  test     - Run Vitest unit tests"
	@echo "  e2e      - Run Playwright e2e tests"
	@echo "  zip      - Build and package extension into $(ZIP_NAME)"
	@echo "  clean    - Remove dist/ and node_modules/"

install:
	npm install

dev: $(NODE_MODULES)
	npm run dev

build: $(NODE_MODULES)
	npm run build

lint: $(NODE_MODULES)
	npm run lint

typecheck: $(NODE_MODULES)
	npm run typecheck

test: $(NODE_MODULES)
	npm run test

e2e: build
	npm run e2e

zip: build
	cd $(DIST) && zip -r ../$(ZIP_NAME) .
	@echo "Packaged: $(ZIP_NAME)"

clean:
	rm -rf $(DIST) $(NODE_MODULES) $(ZIP_NAME)

$(NODE_MODULES):
	npm install
