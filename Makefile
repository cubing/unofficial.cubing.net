SFTP_PATH = "towns.dreamhost.com:~/unofficial.cubing.net/"
URL       = "https://unofficial.cubing.net/"

.PHONY: deploy
deploy:
	rsync -avz \
		--exclude .DS_Store \
		--exclude .git \
		./ \
		${SFTP_PATH}
	echo "\nDone deploying. Go to ${URL}\n"
