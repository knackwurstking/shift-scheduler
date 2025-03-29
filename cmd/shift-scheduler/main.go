package main

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
)

func main() {
	a := app.New()
	w := a.NewWindow("Shift Scheduler")

	w.Resize(fyne.NewSize(400, 600))
	w.SetContent(content())

	w.ShowAndRun()
}
