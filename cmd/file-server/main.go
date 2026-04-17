package main

import (
	"log"
	"net/http"
	"os"

	"github.com/knackwurstking/shift-scheduler/assets"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	publicFS := assets.PublicFS()
	e.GET("/*", echo.WrapHandler(http.FileServer(http.FS(publicFS))))

	log.Printf("Server started on :%s", port)
	e.Start(":" + port)
}
