package main

import (
	"fmt"
	"math"
	"syscall/js"
)

const (
	SwipeThreshold    = 150
	SwipeMinThreshold = 5
)

var (
	gridContainers [3]js.Value
	pointerDown    bool
	isSwiping      bool
	start          Coordinates
	stop           Coordinates
)

// initGridContainers initializes the grid containers by getting all .grid-container elements
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

// onPointerDown handles the pointer down event by storing the start position and initializing the grid containers
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

// onPointerMove handles the pointer move event by updating the stop position and moving the grid containers
func onPointerMove(this js.Value, args []js.Value) any {
	if !pointerDown {
		return nil
	}

	event := args[0]

	stop.X = event.Get("clientX").Float()
	stop.Y = event.Get("clientY").Float()

	// Move the grid containers based on the swipe distance
	diff := getSwipeDiff()
	translate := fmt.Sprintf("calc(-100vw + %fpx) 0", diff)
	gridContainers[0].Get("style").Set("translate", translate)
	gridContainers[1].Get("style").Set("translate", translate)
	gridContainers[2].Get("style").Set("translate", translate)

	abs := math.Abs(diff)

	// Apply no-user-select class to grid containers
	if !isSwiping && abs > SwipeMinThreshold {
		for i := range 3 {
			gridContainers[i].Get("classList").Call("add", "no-user-select")
		}
		isSwiping = true
	}

	// Finish the swipe
	if abs > SwipeThreshold {
		return onPointerUp(this, args)
	}

	return nil
}

// onPointerUp handles the pointer up event by finishing the swipe and resetting the grid containers
func onPointerUp(this js.Value, args []js.Value) any {
	if !pointerDown {
		return nil
	}

	// Remove no-user-select class from grid containers
	if isSwiping {
		for i := range 3 {
			gridContainers[i].Get("classList").Call("remove", "no-user-select")
		}
		isSwiping = false
	}

	// Finish swipe
	js.Global().Get("console").Call("log",
		fmt.Sprintf(
			"finishSwipe: start=(%.02f,%.02f) stop=(%.02f,%.02f)",
			start.X, start.Y, stop.X, stop.Y,
		))

	// First we need to get the swipe direction, negative for left swipe,
	if getSwipeDiff() < 0 { // left swipe
		moveGridContainers(-1)
	} else { // right swipe
		moveGridContainers(1)
	}

	// TODO: Move container, change classes, update the content for the moved container
	//  - The container which needs to move is the first container after a left swipe,
	//    or the last container after a right swipe
	//  - So move the container (replace it with a dummy container), update its content,
	//    and reset the grid containers (remove the dummy container)
	//
	// TODO: Also add some transition timings while the swipe is finishing to the already ongoing direction

	// Reset translate style for grid containers
	translate := ""
	gridContainers[0].Get("style").Set("translate", translate)
	gridContainers[1].Get("style").Set("translate", translate)
	gridContainers[2].Get("style").Set("translate", translate)

	pointerDown = false

	return nil
}

// getSwipeDiff returns the difference between the stop and start coordinates
func getSwipeDiff() float64 {
	diff := stop.X - start.X
	if start.X > stop.X {
		diff = 0 - (start.X - stop.X)
	}
	return diff
}

func moveGridContainers(direction int) {
	if direction > 0 {
		// TODO: right swipe
	} else {
		// TODO: left swipe
	}
}
