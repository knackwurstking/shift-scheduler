package main

import "syscall/js"

var gridContainers GridContainers

type GridContainers struct {
	containers [3]js.Value
}

func (gc *GridContainers) Init() {
	// Get all .grid-container elements
	containers := js.Global().Get("document").Call("querySelectorAll", ".grid-container")
	if containers.Length() != 3 {
		panic("Expected 3 grid containers")
	}

	for i := range containers.Length() {
		gc.containers[i] = containers.Index(i)
	}
}

func (gc *GridContainers) List() [3]js.Value {
	return gc.containers
}

func (gc *GridContainers) AddClass(v string) {
	gc.containers[0].Get("classList").Call("add", v)
	gc.containers[1].Get("classList").Call("add", v)
	gc.containers[2].Get("classList").Call("add", v)
}

func (gc *GridContainers) RemoveClass(v string) {
	gc.containers[0].Get("classList").Call("remove", v)
	gc.containers[1].Get("classList").Call("remove", v)
	gc.containers[2].Get("classList").Call("remove", v)
}

func (gc *GridContainers) SetTranslate(v string) {
	gc.containers[0].Get("style").Set("translate", v)
	gc.containers[1].Get("style").Set("translate", v)
	gc.containers[2].Get("style").Set("translate", v)
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
