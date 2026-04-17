package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

//go:embed assets/public/*
var assets embed.FS

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	subFS, err := fs.Sub(assets, "assets/public")
	if err != nil {
		log.Fatal(err)
	}

	e.GET("/*", echo.WrapHandler(http.FileServer(http.FS(subFS))))

	log.Printf("Server started on :%s", port)
	e.Start(":" + port)
}
