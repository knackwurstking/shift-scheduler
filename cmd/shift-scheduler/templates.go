package main

import (
	"html/template"
)

var (
	tmpls *template.Template
)

func initTemplates() error {
	var err error
	tmpls, err = template.New("").
		ParseGlob("templates/*.html")

	return err
}
