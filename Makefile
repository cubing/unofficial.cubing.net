.PHONY: build
build: generate static

.PHONY: generate
generate:
	bun run ./src/generate/main.ts

.PHONY: static
static:
	cp -R ./src/static/* ./dist/unofficial.cubing.net/

.PHONY: serve-build
serve-build: build
	caddy file-server --listen :8000 --browse --root ./dist/unofficial.cubing.net/

.PHONY: setup
setup:
	bun install

.PHONY: lint
lint:
	bun x biome check ./script/ ./src/

.PHONY: lint-ci
lint-ci:
	bun x biome ci ./script/ ./src/

.PHONY: format
format:
	bun x biome format --write ./script/ ./src/

.PHONY: clean
clean:
	rm -rf ./dist


SOURCE_PATH = "./dist/unofficial.cubing.net/"
SFTP_PATH   = "towns.dreamhost.com:~/unofficial.cubing.net/"
URL         = "https://unofficial.cubing.net/"

.PHONY: deploy
deploy: generate
	rsync -avz \
		--exclude .DS_Store \
		--exclude .git \
		${SOURCE_PATH} \
		${SFTP_PATH}
	echo "\nDone deploying. Go to ${URL}\n"
