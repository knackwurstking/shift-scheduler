package main

import (
	"context"
	"fmt"
	"html/template"
	"syscall/js"
	"time"

	"github.com/a-h/templ"
	"github.com/knackwurstking/shift-scheduler/internal/localization"
	"github.com/knackwurstking/shift-scheduler/templates/components/calendar"
)

var gridContainers GridContainers

type GridContainers struct {
	containers []js.Value

	currentVW int
}

func (gc *GridContainers) QueryAll() {
	// Get all .grid-container elements
	containers := js.Global().Get("document").Call("querySelectorAll", "."+calendar.ClassGridContainer)

	gc.containers = make([]js.Value, 0)
	for i := range containers.Length() {
		gc.containers = append(gc.containers, containers.Index(i))
	}
}

func (gc *GridContainers) List() []js.Value {
	return gc.containers
}

func (gc *GridContainers) AddClass(v string) {
	for _, c := range gc.containers {
		c.Get("classList").Call("add", v)
	}
}

func (gc *GridContainers) RemoveClass(v string) {
	for _, c := range gc.containers {
		c.Get("classList").Call("remove", v)
	}
}

func (gc *GridContainers) SetTranslate(v string) {
	for _, c := range gc.containers {
		c.Get("style").Set("translate", v)
	}
}

func (gc *GridContainers) Move(direction Direction) {
	gridContainers.AddClass("swipe-transition")

	if gc.currentVW == 0 {
		// Set to the initial vw from the "style.css"
		gc.currentVW = -100
	}

	// First we need to finish the swipe
	if direction > 0 {
		gc.currentVW += 100
		defer gc.insertGrid()
	} else {
		gc.currentVW -= 100
		defer gc.appendGrid()
	}

	gc.SetTranslate(fmt.Sprintf("%d 0", gc.currentVW))
}

func (gc *GridContainers) querySwipeContainer() js.Value {
	return js.Global().Get("document").Call("querySelector", "#"+calendar.IDCalendarSwipe)
}

func (gc *GridContainers) queryHTML() js.Value {
	return js.Global().Get("document").Call("querySelector", "html")
}

func (gc *GridContainers) appendGrid() {
	swipeContainer := gc.querySwipeContainer()
	if swipeContainer.IsUndefined() || swipeContainer.IsNull() {
		fmt.Println("warning: swipe container not found, skipping append")
		return
	}

	year, month := gc.getLastContainerYearMonth()
	year, month = addMonth(year, month, 1)

	htmlContent := gc.createGridContainer(year, month)
	if htmlContent == "" {
		fmt.Println("warning: failed to create grid container HTML")
		return
	}
	swipeContainer.Call("insertAdjacentHTML", "beforeend", string(htmlContent))
}

func (gc *GridContainers) insertGrid() {
	swipeContainer := gc.querySwipeContainer()
	if swipeContainer.IsUndefined() || swipeContainer.IsNull() {
		panic("swipe container not found")
	}

	year, month := gc.getFirstContainerYearMonth()
	year, month = addMonth(year, month, -1)

	htmlContent := gc.createGridContainer(year, month)
	swipeContainer.Call("insertAdjacentHTML", "afterbegin", string(htmlContent))
}

func (gc *GridContainers) createGridContainer(year int, month time.Month) template.HTML {
	l := localization.New(gc.queryHTML().Get("lang").String())

	grid := calendar.Grid(calendar.GridProps{
		StartWithMonday: calendar.WeekStartAtMonday(l.Language()),
		Localization:    l,
		Year:            year,
		Month:           month,
	})

	ctx := templ.WithChildren(context.Background(), grid)

	htmlContent, err := templ.ToGoHTML(ctx, calendar.GridContainer())
	if err != nil {
		panic(fmt.Errorf("failed to render grid container: %w", err))
	}

	return htmlContent
}

func (gc *GridContainers) getFirstContainerYearMonth() (int, time.Month) {
	if len(gc.containers) == 0 {
		now := time.Now()
		return now.Year(), now.Month()
	}

	return extractYearMonth(gc.containers[0])
}

func (gc *GridContainers) getLastContainerYearMonth() (int, time.Month) {
	if len(gc.containers) == 0 {
		now := time.Now()
		return now.Year(), now.Month()
	}

	return extractYearMonth(gc.containers[len(gc.containers)-1])
}

func extractYearMonth(container js.Value) (int, time.Month) {
	year := container.Get("dataset").Get("year").Get("value").Int()
	month := container.Get("dataset").Get("month").Get("value").Int()
	return year, time.Month(month)
}

func addMonth(year int, month time.Month, delta int) (int, time.Month) {
	totalMonths := int(month) + delta
	year += (totalMonths - 1) / 12
	newMonth := time.Month((totalMonths-1)%12 + 1)
	if totalMonths <= 0 {
		year--
		newMonth = time.Month((totalMonths%12 + 12) % 12)
		if newMonth == 0 {
			newMonth = 12
		}
	}
	return year, newMonth
}
