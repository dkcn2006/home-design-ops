.PHONY: dev build lint test

API_PORT ?= 4010
API_HOST ?= 127.0.0.1
API_BASE_URL := http://$(API_HOST):$(API_PORT)/api

dev:
	npm run build --workspace @home-design-ops/shared
	@trap 'kill 0' INT TERM EXIT; \
	HOST=$(API_HOST) PORT=$(API_PORT) npm run dev:api & \
	until curl -sS $(API_BASE_URL)/projects/overview >/dev/null 2>&1; do \
		sleep 1; \
	done; \
	INTERNAL_API_BASE_URL=$(API_BASE_URL) NEXT_PUBLIC_API_BASE_URL=$(API_BASE_URL) npm run dev:web & \
	wait

build:
	npm run build

lint:
	npm run lint

test:
	npm run test
