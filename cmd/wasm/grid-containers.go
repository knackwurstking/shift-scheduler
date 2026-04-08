package main

import (
	"context"
	"fmt"
	"html/template"
	"syscall/js"

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
		// FIXME: This right swipe mechanism is broken
		gc.currentVW += 100
		defer gc.insertGrid()
	} else {
		gc.currentVW -= 100
		defer gc.appendGrid()
	}

	gc.SetTranslate(fmt.Sprintf("%s 0", gc.currentVW))
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

	// Append the new grid container to the swipe container
	htmlContent := gc.createGridContainer()
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

	// Insert the new grid container at the beginning of the swipe container using insertAdjacentHTML
	htmlContent := gc.createGridContainer()
	swipeContainer.Call("insertAdjacentHTML", "afterbegin", string(htmlContent))
}

func (gc *GridContainers) createGridContainer() template.HTML {
	l := localization.New(gc.queryHTML().Get("lang").String())
	grid := calendar.Grid(calendar.GridProps{
		StartWithMonday: calendar.WeekStartAtMonday(l.Language()),
		Localization:    l,
	})

	ctx := templ.WithChildren(context.Background(), grid)

	// Convert the grid container to HTML and append it to the swipe container
	htmlContent, err := templ.ToGoHTML(ctx, calendar.GridContainer())
	if err != nil {
		panic(fmt.Errorf("failed to render grid container: %w", err))
	}

	return htmlContent
}
