package main

import (
	"fmt"
	"strconv"
	"syscall/js"
	"time"

	"github.com/knackwurstking/shift-scheduler/internal/localization"
)

var gridContainers GridContainers

type GridContainers struct {
	containers []js.Value
}

func (gc *GridContainers) QueryAll() {
	// Get all .grid-container elements
	containers := js.Global().Get("document").Call("querySelectorAll", "."+classGridContainer)

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
	if direction > 0 {
		gc.insertGrid()
		// TODO: Update date picker button content
	} else {
		gc.appendGrid()
		// TODO: Update date picker button content
	}
}

func (gc *GridContainers) querySwipeContainer() js.Value {
	return js.Global().Get("document").Call("querySelector", "#"+idCalendarSwipe)
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
	swipeContainer.Call("insertAdjacentHTML", "beforeend", htmlContent)

	// Remove the old first container so the next month becomes visible
	if swipeContainer.Get("children").Length() > 3 {
		swipeContainer.Get("firstElementChild").Call("remove")
	}
}

func (gc *GridContainers) insertGrid() {
	swipeContainer := gc.querySwipeContainer()
	if swipeContainer.IsUndefined() || swipeContainer.IsNull() {
		panic("swipe container not found")
	}

	year, month := gc.getFirstContainerYearMonth()
	year, month = addMonth(year, month, -1)

	htmlContent := gc.createGridContainer(year, month)
	swipeContainer.Call("insertAdjacentHTML", "afterbegin", htmlContent)

	// Remove the old last container so the previous month becomes visible
	if swipeContainer.Get("children").Length() > 3 {
		lastChild := swipeContainer.Get("lastElementChild")
		if !lastChild.IsUndefined() && !lastChild.IsNull() {
			lastChild.Call("remove")
		}
	}
}

func (gc *GridContainers) createGridContainer(year int, month time.Month) string {
	l := localization.New(gc.queryHTML().Get("lang").String())
	return createGridHTML(year, month, l)
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
	table := container.Call("querySelector", "table")
	year, _ := strconv.Atoi(table.Get("dataset").Get("year").String())
	month, _ := strconv.Atoi(table.Get("dataset").Get("month").String())
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
