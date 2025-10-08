# =========================
# 設定
# =========================
PROJECTS   := frontend
CUSTOMERS  := frontend
NPM        ?= npm
PORT       ?= 8150   # プロジェクト単体起動時のデフォルト公開ポート

# =========================
# プロジェクト単位（開発・共通）
# =========================
setup:
	docker compose run --rm --entrypoint sh frontend -c "$(NPM) ci"
	docker compose run --rm --entrypoint sh frontend -c "$(NPM) run build"

build:
	docker compose build frontend

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
# 例: make prod-cp01-build && make prod-cp01-up PORT=8001
# =========================
$(PROJECTS:%=prod-%-build):
	COMPOSE_FILE=docker-compose.yml docker compose build $*

$(PROJECTS:%=prod-%-up):
	# PORT は docker-compose.yml の "${PORT:-8001}:3000" を上書き
	COMPOSE_FILE=docker-compose.yml PORT=$(PORT) docker compose up $*

$(PROJECTS:%=prod-%-upd):
	# PORT は docker-compose.yml の "${PORT:-8001}:3000" を上書き
	COMPOSE_FILE=docker-compose.yml PORT=$(PORT) docker compose up -d $*

$(PROJECTS:%=prod-%-logs):
	COMPOSE_FILE=docker-compose.yml docker compose logs -f $*

$(PROJECTS:%=prod-%-down):
	COMPOSE_FILE=docker-compose.yml docker compose stop $*

$(PROJECTS:%=prod-%-login):
	COMPOSE_FILE=docker-compose.yml docker compose run --rm $* sh 

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
