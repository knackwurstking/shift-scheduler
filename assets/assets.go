package assets

import (
	"embed"
	"io/fs"
)

var (
	//go:embed public
	public embed.FS
)

func PublicFS() fs.FS {
	publicFS, err := fs.Sub(public, "public")
	if err != nil {
		panic(err)
	}
	return publicFS
}
