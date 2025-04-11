clean:
	@git clean -fxd

init:
	@cd ui && npm install && \
		npx paraglide-js compile \
			--project ./project.inlang \
			--outdir ./src/paraglide \
			--strategy preferredLanguage baseLocale

generate-pwa-assets:
	@cd ui && npx pwa-assets-generator

test:
	@cd ui && npx tsc && npx vitest run

dev:
	@cd ui && MODE= npx vite --host -c vite.config.js

vite-build:
	@cd ui && npx vite build --minify -c vite.config.js --emptyOutDir

vite-build-capacitor:
	@make test && \
		MODE=capacitor make vite-build

vite-build-all:
	@make test && \
		MODE= make vite-build && \
		MODE=capacitor make vite-build

android-sync:
	@cd ui && npx cap sync android

android-open:
	@cd ui && npx cap open android

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

go-init:
	@make init || exit $?
	@go mod tidy -v

go-build:
	@MODE= make vite-build || exit $?
	@go mod tidy -v || exit $?
	@go build -v -o ./bin/shift-scheduler ./cmd/shift-scheduler

export SYSTEMD_SERVICE_FILE
go-linux-install:
	@echo "$$SYSTEMD_SERVICE_FILE" > ${HOME}/.config/systemd/user/shift-scheduler.service || exit $?
	@systemctl --user daemon-reload || exit $?
	@echo "--> Created a service file @ ${HOME}/.config/systemd/user/pg-vis-pwa.service"
	@sudo cp ./bin/pg-vis-pwa /usr/local/bin/

go-linux-start:
	@systemctl --user restart shift-scheduler

go-linux-stop:
	@systemctl --user stop shift-scheduler

go-linux-log:
	@journalctl --user -u shift-scheduler --follow --output cat
