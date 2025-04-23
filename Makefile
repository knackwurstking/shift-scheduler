all: init build

# NOTE: The following section cntaining commands for my "rpi-server-project"

define SYSTEMD_SERVICE_FILE
[Unit]
Description=A simple Shift Schedule application
After=network.target

[Service]
EnvironmentFile=%h/.config/rpi-server-project/.env
ExecStart=shift-scheduler

[Install]
WantedBy=default.target
endef

clean:
	git clean -fxd

init:
	cd ui && make init 
	go mod tidy -v

build:
	cd ui && make build-web
	go mod tidy -v 
	go build -v -o ./bin/shift-scheduler ./cmd/shift-scheduler

UNAME := $(shell uname)
check-linux:
ifneq ($(UNAME), Linux)
	@echo 'This won’t work here since you’re not on Linux.'
	@exit 1
endif

export SYSTEMD_SERVICE_FILE
install: check-linux
	echo "$$SYSTEMD_SERVICE_FILE" > ${HOME}/.config/systemd/user/shift-scheduler.service 
	systemctl --user daemon-reload 
	echo "--> Created a service file @ ${HOME}/.config/systemd/user/shift-scheduler.service"
	sudo cp ./bin/shift-scheduler /usr/local/bin/

start: check-linux
	systemctl --user restart shift-scheduler

stop: check-linux
	systemctl --user stop shift-scheduler

log: check-linux
	journalctl --user -u shift-scheduler --follow --output cat
