package main

import (
	"os"
	"shift-scheduler/ui"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var (
	ServerAddr = os.Getenv("PGVISPWA_SERVER_ADDR")
	ServerPath = os.Getenv("PGVISPWA_SERVER_PATH")
)

func init() {
	if ServerAddr == "" {
		panic("Environment variable missing: PGVISPWA_SERVER_ADDR")
	}
}

func main() {
	e := echo.New()

	setHandlers(e)

	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "[${time_rfc3339}] ${status} ${method} ${path} (${remote_ip}) ${latency_human}\n",
		Output: os.Stderr,
	}))

	if err := e.Start(ServerAddr); err != nil {
		e.Logger.Fatal(err)
	}
}

func setHandlers(e *echo.Echo) {
	e.GET(ServerPath+"/*", echo.StaticDirectoryHandler(ui.Dist(), false))
}
