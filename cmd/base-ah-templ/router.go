package main

import (
	"base-ah-templ/internal/handlers"

	"github.com/labstack/echo/v4"
)

func initRoutes(e *echo.Echo) {
	// Home page
	e.GET("/", handlers.Home)
}
