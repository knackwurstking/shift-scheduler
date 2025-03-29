package main

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/layout"
	"fyne.io/fyne/v2/theme"
	"fyne.io/fyne/v2/widget"
)

func content() fyne.CanvasObject {
	gotoSettingsButton := widget.NewToolbarAction(theme.SettingsIcon(), func() {
		// TODO: Open app settings page here
	})
	gotoSettingsButton.Disable()

	top := widget.NewToolbar(
		NewToolbarButton("YYYY / MM", func() {
			// TODO: Open date picker dialog here
		}),
		widget.NewToolbarSpacer(),
		gotoSettingsButton,
	)

	bottom := container.New(
		layout.NewGridLayout(3),

		// TODO: Create 3 buttons here(?)
		widget.NewLabel("<--"),
		widget.NewLabel("center"),
		widget.NewLabel("-->"),
	)

	return container.New(
		layout.NewBorderLayout(top, bottom, nil, nil),

		top,

		container.New(
			layout.NewGridLayout(7),

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

type ToolbarButton struct {
	*widget.Button
}

func NewToolbarButton(label string, tapped func()) *ToolbarButton {
	return &ToolbarButton{
		Button: widget.NewButton(label, tapped),
	}
}

func (tl *ToolbarButton) ToolbarObject() fyne.CanvasObject {
	return tl.Button
}
