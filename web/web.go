package web

import (
	"embed"
	"io/fs"
)

var (
	//go:embed public
	public embed.FS

	//go:embed templates
	templates embed.FS
)

func PublicFS() fs.FS {
	publicFS, err := fs.Sub(public, "public")
	if err != nil {
		panic(err)
	}
	return publicFS
}

func TemplatesFS() fs.FS {
	publicFS, err := fs.Sub(templates, "templates")
	if err != nil {
		panic(err)
	}
	return publicFS
}
