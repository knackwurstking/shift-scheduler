package main

import (
	"fmt"

	"github.com/labstack/echo/v4"
)

func initRouter(e *echo.Echo) error {
	e.Static("/", "public") // Contains js, css, icons, the manifest and more

	err := initTemplates()
	if err != nil {
		return fmt.Errorf("init templates: %w", err)
	}

	// TODO: "/" - Start page ../../templates/index.html using the global `tmpls`

	return nil
}
