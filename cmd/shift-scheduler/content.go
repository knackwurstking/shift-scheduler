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
	"github.com/knackwurstking/shift-scheduler/internal/calendar"
)

var GridSize = 42

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
	currentDate := time.Now()

	gotoSettingsButton := widget.NewToolbarAction(theme.SettingsIcon(), func() {
		// TODO: Open app settings page here
	})
	gotoSettingsButton.Disable()

	top := widget.NewToolbar(
		NewToolbarButton(
			fmt.Sprintf("%d / %s",
				currentDate.Year(), months[currentDate.Month()-1]),

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

	calendarGrid := container.New(layout.NewGridLayout(7))
	updateCalendarGrid(calendarGrid, currentDate)

	return container.New(
		layout.NewBorderLayout(top, bottom, nil, nil),
		top,
		calendarGrid,
		bottom,
	)
}

func updateCalendarGrid(c *fyne.Container, t time.Time) {
	if len(c.Objects) == 0 {
		for range GridSize {
			c.Add(
				container.New(
					layout.NewStackLayout(),
					widget.NewButton("", nil),
				),
			)
		}
	}

	d := calendar.GetDataForDays(t.Year(), t.Month(), time.Sunday)
	var b *widget.Button
	for i, o := range c.Objects {
		b = o.(*fyne.Container).Objects[0].(*widget.Button)

		b.SetText(
			fmt.Sprintf("%d", d[i].Day),
		)

		if d[i].Month != t.Month() {
			b.Disable()
		} else {
			b.Enable()
		}
	}
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
