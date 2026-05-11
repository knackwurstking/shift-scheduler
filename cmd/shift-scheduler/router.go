package main

import (
	"github.com/labstack/echo/v4"
)

func router(e *echo.Echo) {
	e.Static("/", "public") // Contains js, css, icons, the manifest and more

	// TODO: Server the templates, currently only the index.html "/"
}
