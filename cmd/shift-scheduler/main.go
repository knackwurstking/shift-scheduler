package main

import (
	"log/slog"
	"os"
	"time"

	"github.com/knackwurstking/shift-scheduler/assets"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/lmittmann/tint"
)

var (
	ADDRESS = os.Getenv("ADDRESS")
	VERBOSE = os.Getenv("VERBOSE") == "true"
)

func init() {
	if ADDRESS == "" {
		ADDRESS = ":3000"
	}

	// Initialize the logger with the appropriate level based on the Verbose flag.
	level := slog.LevelInfo
	if VERBOSE {
		level = slog.LevelDebug
	}
	slog.SetDefault(slog.New(
		tint.NewHandler(os.Stderr, &tint.Options{
			Level:      level,
			TimeFormat: time.DateTime,
		}),
	))
}

func main() {
	e := echo.New()

	// TODO: Cache middleware for caching everything, lets see if this can replace the service worker in the future.
	e.Use(middleware.AddTrailingSlash())
	e.Use(middleware.RequestLogger())
	e.Use(middleware.CORS())

	publicFS := assets.PublicFS()
	e.StaticFS("/", publicFS)

	initRoutes(e)

	if err := e.Start(":3000"); err != nil {
		panic("failed to start server: " + err.Error())
	}
}
