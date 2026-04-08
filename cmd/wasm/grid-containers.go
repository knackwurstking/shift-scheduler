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
}

func (gc *GridContainers) QueryAll() {
	// Get all .grid-container elements
	containers := js.Global().Get("document").Call("querySelectorAll", "."+calendar.ClassGridContainer)
	if containers.Length() != 3 {
		panic("Expected 3 grid containers")
	}

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

	// First we need to finish the swipe
	var translate string
	if direction > 0 {
		translate = "calc(0vw)"
		defer gc.insertGrid()
	} else {
		translate = "calc(-200vw)"
		defer gc.appendGrid()
	}
	gc.SetTranslate(translate)
}

func (gc *GridContainers) querySwipeContainer() js.Value {
	return js.Global().Get("document").Call("querySelector", "#"+calendar.IDCalendarSwipe)
}

func (gc *GridContainers) queryHTML() js.Value {
	return js.Global().Get("document").Call("querySelector", "html").Get("lang")
}

func (gc *GridContainers) appendGrid() {
	swipeContainer := gc.querySwipeContainer()
	if swipeContainer.IsUndefined() || swipeContainer.IsNull() {
		panic("swipe container not found")
	}

	// Append the new grid container to the swipe container
	htmlContent := gc.createGridContainer()
	swipeContainer.Call("insertAdjacentHTML", "beforeend", htmlContent)
}

func (gc *GridContainers) insertGrid() {
	swipeContainer := gc.querySwipeContainer()
	if swipeContainer.IsUndefined() || swipeContainer.IsNull() {
		panic("swipe container not found")
	}

	// Insert the new grid container at the beginning of the swipe container using insertAdjacentHTML
	htmlContent := gc.createGridContainer()
	swipeContainer.Call("insertAdjacentHTML", "afterbegin", htmlContent)
}

func (gc *GridContainers) createGridContainer() template.HTML {
	l := localization.New(gc.queryHTML().Get("lang").String()) // FIXME: syscall/js: call of Value.Get on string
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
