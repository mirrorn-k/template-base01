# =========================
# 設定
# =========================
PROJECTS   := frontend kimotokk.com three-good.co.jp
CUSTOMERS  := frontend kimotokk.com three-good.co.jp
NPM        ?= npm

# =========================
# プロジェクト単位（開発・共通）
# =========================
setup:
	docker compose run --rm --entrypoint sh frontend -c "$(NPM) ci"
	docker compose run --rm --entrypoint sh frontend -c "$(NPM) run build"

build:
	docker compose build frontend

npm-build: 
	docker compose run --rm frontend sh -c "npm run build"

build-no-cache:
	docker compose build frontend --no-cache

up:
	docker compose up frontend
upd:
	docker compose up -d frontend
logs:
	docker compose logs -f frontend
down:
	docker compose stop frontend
login:
	docker compose run --rm frontend sh
cache-clear:
	docker compose down --volumes --rmi all --remove-orphans

# =========================
# 本番：プロジェクト単位（本番と同じ compose で起動確認）
# =========================
$(PROJECTS:%=prod-%-build):
	@name=$(patsubst prod-%-build,%,$@); \
	echo "▶️ Building $$name"; \
	COMPOSE_FILE=docker-compose.yml docker compose build $$name

$(PROJECTS:%=prod-%-up):
	@name=$(patsubst prod-%-up,%,$@); \
	echo "▶️ Starting $$name"; \
	COMPOSE_FILE=docker-compose.yml docker compose up $$name

$(PROJECTS:%=prod-%-upd):
	@name=$(patsubst prod-%-upd,%,$@); \
	echo "▶️ Starting $$name (detached)"; \
	COMPOSE_FILE=docker-compose.yml docker compose up -d $$name

$(PROJECTS:%=prod-%-logs):
	@name=$(patsubst prod-%-logs,%,$@); \
	echo "▶️ Showing logs for $$name"; \
	COMPOSE_FILE=docker-compose.yml docker compose logs -f $$name

$(PROJECTS:%=prod-%-down):
	@name=$(patsubst prod-%-down,%,$@); \
	echo "🛑 Stopping $$name"; \
	COMPOSE_FILE=docker-compose.yml docker compose stop $$name

$(PROJECTS:%=prod-%-login):
	@name=$(patsubst prod-%-login,%,$@); \
	echo "💻 Logging into $$name"; \
	COMPOSE_FILE=docker-compose.yml docker compose run --rm $$name sh


# =========================
# 本番：お客様 × プロジェクト（スタック分離 & env ファイル）
# 例: make prod-cp01-userA-up  -> env/cp01.userA.env を読込
# =========================
define GEN_PROD
prod-$(1)-$(2)-build:
	COMPOSE_FILE=docker-compose.yml docker compose -p $(2)-$(1) --env-file env/$(1).$(2).env build $(1)
prod-$(1)-$(2)-up:
	COMPOSE_FILE=docker-compose.yml docker compose -p $(2)-$(1) --env-file env/$(1).$(2).env up -d $(1)
prod-$(1)-$(2)-logs:
	COMPOSE_FILE=docker-compose.yml docker compose -p $(2)-$(1) --env-file env/$(1).$(2).env logs -f $(1)
prod-$(1)-$(2)-down:
	COMPOSE_FILE=docker-compose.yml docker compose -p $(2)-$(1) --env-file env/$(1).$(2).env stop $(1)
endef
$(foreach P,$(PROJECTS),$(foreach C,$(CUSTOMERS),$(eval $(call GEN_PROD,$(P),$(C)))))

# =========================
# おまけ
# =========================
ps:
	docker compose ps

.PHONY: $(PROJECTS:%=%-setup) \
        $(PROJECTS:%=dev-%-build) $(PROJECTS:%=dev-%-up) $(PROJECTS:%=dev-%-upd) $(PROJECTS:%=dev-%-logs) $(PROJECTS:%=dev-%-down) \
        $(PROJECTS:%=prod-%-build) $(PROJECTS:%=prod-%-up) $(PROJECTS:%=prod-%-logs) $(PROJECTS:%=prod-%-down) \
        ps
