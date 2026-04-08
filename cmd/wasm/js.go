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
	pointerDown bool
	isSwiping   bool
	start       Coordinates
	stop        Coordinates
)

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

	gridContainers.QueryAll()

	// This class should remove the transition timings
	gridContainers.RemoveClass("swipe-transition")

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
	abs := math.Abs(diff)
	gridContainers.SetTranslate(fmt.Sprintf("calc(-100vw + %fpx) 0", diff))

	// Apply no-user-select class to grid containers
	if !isSwiping && abs > SwipeMinThreshold {
		gridContainers.AddClass("no-user-select")
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
		gridContainers.RemoveClass("no-user-select")
		isSwiping = false
	}

	// Finish swipe
	js.Global().Get("console").Call("log",
		fmt.Sprintf(
			"finishSwipe: start=(%.02f,%.02f) stop=(%.02f,%.02f)",
			start.X, start.Y, stop.X, stop.Y,
		))

	// First we need to get the swipe direction, negative for left swipe,
	diff := getSwipeDiff()
	if math.Abs(diff) > SwipeThreshold {
		if diff < 0 {
			gridContainers.Move(DirectionLeft)
		}
		gridContainers.Move(DirectionRight)
	} else {
		// TODO: Reset the to the original translate value
	}

	// Reset translate style for grid containers
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
