package main

import (
	"fmt"
	"syscall/js"
)

var (
	gridContainers [3]js.Value
	pointerDown    bool
	start          Coordinates
	stop           Coordinates
)

type Coordinates struct {
	X float64
	Y float64
}

func main() {
	// Create a channel to keep the program running
	c := make(chan struct{})

	// Register a function to be called from JavaScript
	// TODO: Register swipe handlers
	js.Global().Set("onPointerDown", js.FuncOf(onPointerDown))
	js.Global().Set("onPointerMove", js.FuncOf(onPointerMove))
	js.Global().Set("onPointerUp", js.FuncOf(onPointerUp))
	js.Global().Set("onPointerCancel", js.FuncOf(onPointerUp))
	js.Global().Set("onPointerOut", js.FuncOf(onPointerUp))
	js.Global().Set("onPointerLeave", js.FuncOf(onPointerUp))

	fmt.Println("Go WebAssembly initialized")

	initDOM()

	// Keep the program alive
	<-c
}

func initDOM() {
}

/**
 * JS Callbacks
 */

func initGridContainers() {
	// Get all .grid-container elements
	containers := js.Global().Get("document").Call("querySelectorAll", ".grid-container")
	if containers.Length() != 3 {
		panic("Expected 3 grid containers")
	}
	for i := range containers.Length() {
		gridContainers[i] = containers.Index(i)
	}
}

func onPointerDown(this js.Value, args []js.Value) any {
	event := args[0]

	// TODO: Console log target, remove later...
	js.Global().Get("console").Call("log", "onPointerDown:", event)

	// Store the current start position
	start.X = event.Get("clientX").Float()
	start.Y = event.Get("clientY").Float()
	stop.X = start.X
	stop.Y = start.Y

	initGridContainers()
	pointerDown = true

	return nil
}

func onPointerMove(this js.Value, args []js.Value) any {
	if !pointerDown {
		return nil
	}

	event := args[0]

	stop.X = event.Get("clientX").Float()
	stop.Y = event.Get("clientY").Float()

	moveGridContainers()

	return nil
}

func onPointerUp(this js.Value, args []js.Value) any {
	if !pointerDown {
		return nil
	}

	pointerDown = false
	finishSwipe(start, stop)

	return nil
}

/**
 * Golang helper functions
 */

// moveGridContainers by modifying the `translate: -100vw 0;`
//
// TODO: Need to reset this after finishing the swipe, use `finishSwipe` for this
func moveGridContainers() {
	diff := stop.X - start.X
	translate := fmt.Sprintf("calc(100vw - %fpx) 0px", diff)
	gridContainers[0].Get("style").Set("translate", translate)
	gridContainers[1].Get("style").Set("translate", translate)
	gridContainers[2].Get("style").Set("translate", translate)
}

func resetGridContainers() {
	translate := ""
	gridContainers[0].Get("style").Set("translate", translate)
	gridContainers[1].Get("style").Set("translate", translate)
	gridContainers[2].Get("style").Set("translate", translate)
}

func finishSwipe(start, stop Coordinates) {
	js.Global().Get("console").Call("log", fmt.Sprintf("finishSwipe: start=%#v stop=%#v", start, stop))

	// TODO: Move containers based on swipe direction
	resetGridContainers()
}
