.PHONY: generate
generate:
	bun run ./admin/main.ts


.PHONY: setup
setup:
	bun install

.PHONY: lint
lint:
	bunx rome check ./

.PHONY: format
format:
	bunx rome format ./

SOURCE_PATH = "./site"
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
