package main

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/layout"
	"fyne.io/fyne/v2/widget"
)

func content() fyne.CanvasObject {
	bottom := container.New(
		layout.NewAdaptiveGridLayout(3),

		// TODO: Create 3 buttons here(?)
		widget.NewLabel("<--"),
		widget.NewLabel("center"),
		widget.NewLabel("-->"),
	)

	return container.New(
		layout.NewBorderLayout(nil, bottom, nil, nil),

		container.New(
			layout.NewAdaptiveGridLayout(7),

			widget.NewLabel("1"),
			widget.NewLabel("2"),
			widget.NewLabel("3"),
			widget.NewLabel("4"),
			widget.NewLabel("5"),
			widget.NewLabel("6"),
			widget.NewLabel("7"),

			widget.NewLabel("1"),
			widget.NewLabel("2"),
			widget.NewLabel("3"),
			widget.NewLabel("4"),
			widget.NewLabel("5"),
			widget.NewLabel("6"),
			widget.NewLabel("7"),

			widget.NewLabel("1"),
			widget.NewLabel("2"),
			widget.NewLabel("3"),
			widget.NewLabel("4"),
			widget.NewLabel("5"),
			widget.NewLabel("6"),
			widget.NewLabel("7"),

			widget.NewLabel("1"),
			widget.NewLabel("2"),
			widget.NewLabel("3"),
			widget.NewLabel("4"),
			widget.NewLabel("5"),
			widget.NewLabel("6"),
			widget.NewLabel("7"),

			widget.NewLabel("1"),
			widget.NewLabel("2"),
			widget.NewLabel("3"),
			widget.NewLabel("4"),
			widget.NewLabel("5"),
			widget.NewLabel("6"),
			widget.NewLabel("7"),

			widget.NewLabel("1"),
			widget.NewLabel("2"),
			widget.NewLabel("3"),
			widget.NewLabel("4"),
			widget.NewLabel("5"),
			widget.NewLabel("6"),
			widget.NewLabel("7"),
		),

		bottom,
	)
}
