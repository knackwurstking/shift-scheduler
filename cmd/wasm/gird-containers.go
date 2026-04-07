package main

import (
	"context"
	"fmt"
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
	containers := js.Global().Get("document").Call("querySelectorAll", ".grid-container")
	if containers.Length() != 3 {
		panic("Expected 3 grid containers")
	}

	for i := range containers.Length() {
		gc.containers[i] = containers.Index(i)
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
	} else {
		translate = "calc(-200vw)"
	}
	gc.SetTranslate(translate)

	// TODO: Add new grid container to the beginning after a right swipe,
	// to the end after a left swipe

	// TODO: Remove old container after the transition has finished
}

func (gc *GridContainers) querySwipeContainer() js.Value {
	return js.Global().Get("document").Call("querySelector", calendar.IDCalendarSwipe)
}

func (gc *GridContainers) queryHTML() js.Value {
	return js.Global().Get("document").Call("querySelector", "html").Get("lang")
}

func (gc *GridContainers) appendGrid() {
	swipeContainer := gc.querySwipeContainer()

	// Append the new grid container to the swipe container
	swipeContainer.Call("appendChild", gc.createGridContainer())
}

func (gc *GridContainers) insertGrid() {
	swipeContainer := gc.querySwipeContainer()

	// Insert the new grid container to the swipe container, using `insertAdjacentHTML(position, input)`
}

func (gc *GridContainers) createGridContainer() js.Value {
	l := localization.New(gc.queryHTML().Get("lang").String())
	grid := calendar.Grid(calendar.GridProps{
		StartWithMonday: calendar.WeekStartAtMonday(l.Language()),
		Localization:    l,
	})

	// Convert the grid container to HTML and append it to the swipe container
	htmlContent, err := templ.ToGoHTML(context.Background(), grid)
	if err != nil {
		panic(fmt.Errorf("failed to render grid container: " + err.Error()))
	}

	// Create a new div element and set its innerHTML
	div := js.Global().Get("document").Call("createElement", "div")
	div.Call("setAttribute", "class", "grid-container")
	div.Get("innerHTML").Set("innerHTML", string(htmlContent))

	return div
}
