.PHONY: dev build lint test

dev:
	npm run build --workspace @home-design-ops/shared
	@trap 'kill 0' INT TERM EXIT; \
	npm run dev:api & \
	until curl -sS http://localhost:4000/api/projects/overview >/dev/null 2>&1; do \
		sleep 1; \
	done; \
	npm run dev:web & \
	wait

build:
	npm run build

lint:
	npm run lint

test:
	npm run test
