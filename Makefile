all: init build

BINARY_NAME := shift-scheduler

SERVER_ADDR := :9030
SERVER_PATH_PREFIX := /web-apps/shift-scheduler

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
		cd ui && make build-web && \
		rm -rf ./docs && \
		cp -r ./ui/dist ./docs

UNAME := $(shell uname)
check-linux:
ifneq ($(UNAME), Linux)
	@echo 'This won’t work here since you’re not on Linux.'
	@exit 1
endif

export SYSTEMD_SERVICE_FILE
install: check-linux
	echo "$$SYSTEMD_SERVICE_FILE" > ${HOME}/.config/systemd/user/${BINARY_NAME}.service 
	systemctl --user daemon-reload 
	echo "--> Created a service file @ ${HOME}/.config/systemd/user/${BINARY_NAME}.service"
	sudo cp ./bin/${BINARY_NAME} /usr/local/bin/

start: check-linux
	systemctl --user restart ${BINARY_NAME}

stop: check-linux
	systemctl --user stop ${BINARY_NAME}

log: check-linux
	journalctl --user -u ${BINARY_NAME} --follow --output cat
