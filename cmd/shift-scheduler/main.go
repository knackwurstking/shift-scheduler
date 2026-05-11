package main

import (
	"log/slog"
	"os"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/lmittmann/tint"
)

var (
	Address = os.Getenv("ADDRESS")
	Verbose = os.Getenv("VERBOSE") == "true"
)

func init() {
	if Address == "" {
		Address = ":3000"
	}

	// Initialize the logger with the appropriate level based on the Verbose flag.
	level := slog.LevelInfo
	if Verbose {
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

	router(e)

	if err := e.Start(Address); err != nil {
		slog.Error("failed to start the server", "address", Address, "error", err)
		os.Exit(1)
	}
}
