# =========================
# PJ 指定（デフォルト develop）
# =========================
PJ ?= develop

# =========================
# env/PJ.env は本番専用
# =========================
ENV_FILE := env/$(PJ).env
ENV_OPT := $(if $(wildcard $(ENV_FILE)),--env-file $(ENV_FILE),)

# =========================
# セットアップ
# =========================
setup:
	docker compose run --rm --entrypoint sh frontend -c "npm ci"

prod-setup:
	COMPOSE_FILE=docker-compose.yml docker compose run --rm --entrypoint sh develop -c "npm ci"
	
# =========================
# ローカル（env を使わない）
# =========================
up:
	docker compose up $(PJ)

upd:
	docker compose up -d $(PJ)

logs:
	docker compose logs -f $(PJ)

down:
	docker compose stop $(PJ)

build:
	docker compose build $(PJ)

# Next.js キャッシュ削除（.next）
next-cache-clear:
	docker compose run --rm $(PJ) sh -c "rm -rf .next"

# node_modules の再インストール前に使う
node-cache:
	docker compose run --rm $(PJ) sh -c "npm cache clean --force"

# Docker ボリューム/イメージのキャッシュ削除
docker-cache:
	docker compose down --volumes --rmi all --remove-orphans
	docker system prune -f

# =========================
# 本番（env/PJ.env を使う）
# =========================
prod-up:
	COMPOSE_FILE=docker-compose.yml docker compose $(ENV_OPT) up $(PJ)

prod-upd:
	COMPOSE_FILE=docker-compose.yml docker compose $(ENV_OPT) up -d $(PJ)

prod-build:
	COMPOSE_FILE=docker-compose.yml docker compose $(ENV_OPT) build $(PJ)

prod-logs:
	COMPOSE_FILE=docker-compose.yml docker compose $(ENV_OPT) logs -f $(PJ)

prod-down:
	COMPOSE_FILE=docker-compose.yml docker compose $(ENV_OPT) stop $(PJ)

# Next.js のビルドキャッシュ削除（本番）
prod-next-cache-clear:
	COMPOSE_FILE=docker-compose.yml docker compose $(ENV_OPT) run --rm $(PJ) sh -c "rm -rf .next"

# Dockerキャッシュ全削除（本番）
prod-docker-cache:
	COMPOSE_FILE=docker-compose.yml docker compose $(ENV_OPT) down --volumes --rmi all --remove-orphans
	COMPOSE_FILE=docker-compose.yml docker system prune -f