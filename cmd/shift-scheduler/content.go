package main

import (
	"fmt"
	"image/color"
	"time"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/layout"
	"fyne.io/fyne/v2/theme"
	"fyne.io/fyne/v2/widget"
)

var months = []string{
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
}

func content() fyne.CanvasObject {
	gotoSettingsButton := widget.NewToolbarAction(theme.SettingsIcon(), func() {
		// TODO: Open app settings page here
	})
	gotoSettingsButton.Disable()

	today := time.Now()
	top := widget.NewToolbar(
		NewToolbarButton(
			fmt.Sprintf("%d / %s", today.Year(), months[today.Month()-1]),
			func() {
				// TODO: Open date picker dialog here
			},
		),
		widget.NewToolbarSpacer(),
		gotoSettingsButton,
	)

	bottom := container.New(
		layout.NewGridLayout(3),

		widget.NewButtonWithIcon("", theme.NavigateBackIcon(), func() {
			// TODO: ...
		}),

		widget.NewButton("Today", func() {
			// TODO: ...
		}),

		widget.NewButtonWithIcon("", theme.NavigateNextIcon(), func() {
			// TODO: ...
		}),
	)

	return container.New(
		layout.NewBorderLayout(top, bottom, nil, nil),

		top,

		container.New(
			layout.NewGridLayout(7),

			func() []fyne.CanvasObject {
				items := []fyne.CanvasObject{}

				for n := range 42 {
					items = append(
						items,
						container.New(
							layout.NewCenterLayout(),
							widget.NewLabel(fmt.Sprintf("%d", n+1)),
						),
					)
				}

				return items
			}()...,
		),

		bottom,
	)
}

type Theme struct {
	Theme fyne.Theme
}

func NewTheme() fyne.Theme {
	return &Theme{
		Theme: theme.DefaultTheme(),
	}
}

func (t *Theme) Font(s fyne.TextStyle) fyne.Resource {
	if s.Monospace {
		return resourceRecursiveMonospaceRegularTtf
	}

	if s.Bold {
		if s.Italic {
			// TODO: Italic fonts missing
			return theme.DefaultTheme().Font(s)
		}

		return resourceRecursiveCasualBoldTtf
	}

	if s.Italic {
		// TODO: Italic fonts missing
		return theme.DefaultTheme().Font(s)
	}

	theme.DefaultTheme()

	return resourceRecursiveCasualRegularTtf
}

func (t *Theme) Color(n fyne.ThemeColorName, v fyne.ThemeVariant) color.Color {
	return t.Theme.Color(n, v)
}

func (t *Theme) Icon(n fyne.ThemeIconName) fyne.Resource {
	return t.Theme.Icon(n)
}

func (t *Theme) Size(n fyne.ThemeSizeName) float32 {
	return t.Theme.Size(n)
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
