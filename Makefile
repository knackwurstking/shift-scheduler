all: init build

BINARY_NAME := shift-scheduler
ADDR := :9030
PREFIX := /web-apps/$(BINARY_NAME)


clean:
	git clean -fxd

init:
	export SERVER_PATH_PREFIX=$(PREFIX); \
		cd ui && make init
	go mod tidy -v

build:
	export SERVER_PATH_PREFIX=$(PREFIX); \
		cd ui && make build-web
	go mod tidy -v
	go build -v -o ./bin/$(BINARY_NAME) ./cmd/$(BINARY_NAME)

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
Environment="SERVER_ADDR=$(ADDR)"
Environment="SERVER_PATH_PREFIX=${PREFIX}"
ExecStart=${BINARY_NAME}

[Install]
WantedBy=default.target
endef

export SYSTEMD_SERVICE_FILE
linux-install:
	echo "$$SYSTEMD_SERVICE_FILE" > $(HOME)/.config/systemd/user/$(BINARY_NAME).service
	systemctl --user daemon-reload
	echo "--> Created a service file @ $(HOME)/.config/systemd/user/$(BINARY_NAME).service"
	sudo cp ./bin/$(BINARY_NAME) /usr/local/bin/

linux-start-service:
	systemctl --user restart $(BINARY_NAME)

linux-stop-service:
	systemctl --user stop $(BINARY_NAME)

linux-watch-service:
	journalctl --user -u $(BINARY_NAME) --follow --output cat

define LAUNCHD_SERVICE_FILE
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
		<key>Label</key>
		<string>com.$(BINARY_NAME)</string>

		<key>ProgramArguments</key>
		<array>
			<string>/usr/local/bin/$(BINARY_NAME)</string>
		</array>

		<key>RunAtLoad</key>
		<true/>

		<key>KeepAlive</key>
		<true/>

		<key>StandardOutPath</key>
		<string>$(HOME)/Library/Application Support/$(BINARY_NAME).log</string>

		<key>StandardErrorPath</key>
		<string>$(HOME)/Library/Application Support/$(BINARY_NAME).log</string>

		<key>EnvironmentVariables</key>
		<dict>
			<key>SERVER_ADDR</key>
			<string>$(ADDR)</string>
			<key>SERVER_PATH_PREFIX</key>
			<string>$(PREFIX)</string>
		</dict>
</dict>
</plist>
endef

export LAUNCHD_SERVICE_FILE
macos-install:
	@echo "Installing $(BINARY_NAME) for macOS..."
	mkdir -p /usr/local/bin
	sudo cp ./bin/$(BINARY_NAME) /usr/local/bin/$(BINARY_NAME)
	sudo chmod +x /usr/local/bin/$(BINARY_NAME)
	@echo "$$LAUNCHD_SERVICE_FILE" > ~/Library/LaunchAgents/com.$(BINARY_NAME).plist
	@echo "$(BINARY_NAME) installed successfully"

macos-start-service:
	@echo "Starting $(BINARY_NAME) service..."
	launchctl load -w ~/Library/LaunchAgents/com.$(BINARY_NAME).plist
	launchctl start com.$(BINARY_NAME)

macos-stop-service:
	@echo "Stopping $(BINARY_NAME) service..."
	launchctl stop com.$(BINARY_NAME)
	launchctl unload -w ~/Library/LaunchAgents/com.$(BINARY_NAME).plist

macos-restart-service:
	@echo "Restarting $(BINARY_NAME) service..."
	make macos-stop-service
	make macos-start-service

macos-print-service:
	@echo "$(BINARY_NAME) service information:"
	@launchctl print gui/$$(id -u)/com.$(BINARY_NAME) || echo "Service not loaded or running"

macos-watch-service:
	@echo "$(BINARY_NAME) watch server logs @ \"/usr/local/var/log/$(BINARY_NAME).log\":"
	@if [ -f "/usr/local/var/log/$(BINARY_NAME).log" ]; then \
		echo "Watching logs... Press Ctrl+C to stop"; \
		tail -f "/usr/local/var/log/$(BINARY_NAME).log"; \
	else \
		echo "Log file not found. Make sure the service is running or has been started."; \
		echo "Log file path: /usr/local/var/log/$(BINARY_NAME).log"; \
	fi
