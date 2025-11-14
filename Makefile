all: init build

BINARY_NAME := shift-scheduler

SERVER_ADDR := :9030
SERVER_PATH_PREFIX := /web-apps/shift-scheduler


clean:
	git clean -fxd

init:
	export SERVER_PATH_PREFIX=${SERVER_PATH_PREFIX}; \
		cd ui && make init
	go mod tidy -v

build:
	export SERVER_PATH_PREFIX=${SERVER_PATH_PREFIX}; \
		cd ui && make build-web
	go mod tidy -v
	go build -v -o ./bin/${BINARY_NAME} ./cmd/${BINARY_NAME}

build-docs:
	export SERVER_PATH_PREFIX=/shift-scheduler; \
		cd ui && make build-web
	rm -rf ./docs && \
	cp -r ./ui/dist ./docs

define SYSTEMD_SERVICE_FILE
[Unit]
Description=A simple Shift Schedule application
After=network.target

[Service]
Environment="SERVER_ADDR=${SERVER_ADDR}"
Environment="SERVER_PATH_PREFIX=${SERVER_PATH_PREFIX}"
ExecStart=${BINARY_NAME}

[Install]
WantedBy=default.target
endef

export SYSTEMD_SERVICE_FILE
linux-install:
	echo "$$SYSTEMD_SERVICE_FILE" > ${HOME}/.config/systemd/user/${BINARY_NAME}.service
	systemctl --user daemon-reload
	echo "--> Created a service file @ ${HOME}/.config/systemd/user/${BINARY_NAME}.service"
	sudo cp ./bin/${BINARY_NAME} /usr/local/bin/

linux-start:
	systemctl --user restart ${BINARY_NAME}

linux-stop:
	systemctl --user stop ${BINARY_NAME}

linux-log:
	journalctl --user -u ${BINARY_NAME} --follow --output cat

# TODO: Create a launchd service file (.plist) for macos

# TODO: Create macos commands: macos-install, macos-start-service, ...
