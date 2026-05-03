.PHONY: dev build lint test deploy deploy-api deploy-web stop status logs

API_PORT ?= 4010
API_HOST ?= 127.0.0.1
WEB_PORT ?= 3000
API_BASE_URL := http://$(API_HOST):$(API_PORT)/api
LOG_DIR := logs
API_PID := $(LOG_DIR)/api.pid
WEB_PID := $(LOG_DIR)/web.pid
API_LOG := $(LOG_DIR)/api.log
WEB_LOG := $(LOG_DIR)/web.log

# ── Development ──

dev:
	npm run build --workspace @home-design-ops/shared
	@trap 'kill 0' INT TERM EXIT; \
	HOST=$(API_HOST) PORT=$(API_PORT) npm run dev:api & \
	until curl -sS $(API_BASE_URL)/projects/overview >/dev/null 2>&1; do \
		sleep 1; \
	done; \
	INTERNAL_API_BASE_URL=$(API_BASE_URL) NEXT_PUBLIC_API_BASE_URL=$(API_BASE_URL) npm run dev:web & \
	wait

# ── Build ──

build:
	npm run build

lint:
	npm run lint

test:
	npm run test

# ── Deploy ──

deploy: build
	@mkdir -p $(LOG_DIR)
	@echo "Starting API on $(API_BASE_URL) ..."
	@nohup node apps/api/dist/apps/api/src/main.js > $(API_LOG) 2>&1 & \
		echo $$! > $(API_PID)
	@sleep 2
	@echo "Starting Web on port $(WEB_PORT) ..."
	@nohup bash -c 'INTERNAL_API_BASE_URL=$(API_BASE_URL) NEXT_PUBLIC_API_BASE_URL=$(API_BASE_URL) npm run start --workspace @home-design-ops/web' > $(WEB_LOG) 2>&1 & \
		echo $$! > $(WEB_PID)
	@sleep 1
	@echo ""
	@echo "✓ API   → $(API_BASE_URL)   (log: $(API_LOG))"
	@echo "✓ Web   → http://$(API_HOST):$(WEB_PORT)       (log: $(WEB_LOG))"
	@echo ""
	@echo "Run 'make status' to check health, 'make stop' to stop services."

deploy-api:
	@mkdir -p $(LOG_DIR)
	@echo "Starting API on $(API_BASE_URL) ..."
	@nohup node apps/api/dist/apps/api/src/main.js > $(API_LOG) 2>&1 & \
		echo $$! > $(API_PID)
	@echo "✓ API → $(API_BASE_URL)   (log: $(API_LOG))"

deploy-web:
	@mkdir -p $(LOG_DIR)
	@echo "Starting Web on port $(WEB_PORT) ..."
	@nohup bash -c 'INTERNAL_API_BASE_URL=$(API_BASE_URL) NEXT_PUBLIC_API_BASE_URL=$(API_BASE_URL) npm run start --workspace @home-design-ops/web' > $(WEB_LOG) 2>&1 & \
		echo $$! > $(WEB_PID)
	@echo "✓ Web → http://$(API_HOST):$(WEB_PORT)       (log: $(WEB_LOG))"

# ── Stop ──

stop:
	@if [ -f $(API_PID) ] && kill -0 $$(cat $(API_PID)) 2>/dev/null; then \
		kill $$(cat $(API_PID)) 2>/dev/null && echo "✓ API stopped"; \
		rm -f $(API_PID); \
	else \
		echo "✗ API not running"; \
	fi
	@if [ -f $(WEB_PID) ] && kill -0 $$(cat $(WEB_PID)) 2>/dev/null; then \
		kill $$(cat $(WEB_PID)) 2>/dev/null && echo "✓ Web stopped"; \
		rm -f $(WEB_PID); \
	else \
		echo "✗ Web not running"; \
	fi

# ── Status & Logs ──

status:
	@echo "Service Status:"
	@printf "  %-8s " "API:"
	@if curl -sS $(API_BASE_URL)/projects/overview >/dev/null 2>&1; then \
		echo "✓ running ($(API_BASE_URL))"; \
	else \
		echo "✗ down"; \
	fi
	@printf "  %-8s " "Web:"
	@if curl -sS -o /dev/null -w "%{http_code}" http://$(API_HOST):$(WEB_PORT) 2>/dev/null | grep -q "200\\|307"; then \
		echo "✓ running (http://$(API_HOST):$(WEB_PORT))"; \
	else \
		echo "✗ down"; \
	fi

logs:
	@echo "=== API log ($(API_LOG)) ==="
	@if [ -f $(API_LOG) ]; then tail -n 20 $(API_LOG); else echo "(no log yet)"; fi
	@echo ""
	@echo "=== Web log ($(WEB_LOG)) ==="
	@if [ -f $(WEB_LOG) ]; then tail -n 20 $(WEB_LOG); else echo "(no log yet)"; fi

logs-api:
	@tail -f $(API_LOG)

logs-web:
	@tail -f $(WEB_LOG)
