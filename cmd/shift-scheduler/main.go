package main

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
)

func main() {
	a := app.New()
	a.Settings().SetTheme(NewTheme())

	w := a.NewWindow("Shift Scheduler")

	w.Resize(fyne.NewSize(400, 600))
	w.SetContent(content())

	w.ShowAndRun()
}
