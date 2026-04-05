package main

import (
	"fmt"
	"syscall/js"
)

var (
	pointerDown bool
	start       Coordinates
	stop        Coordinates
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
	//js.Global().Set("onPointerMove", js.FuncOf(onPointerMove))
	//js.Global().Set("onPointerUp", js.FuncOf(onPointerUp))
	//js.Global().Set("onPointerCancel", js.FuncOf(onPointerCancel))

	fmt.Println("Go WebAssembly initialized")

	initDOM()

	// Keep the program alive
	<-c
}

func initDOM() {
	// ...
}

func onPointerDown(this js.Value, args []js.Value) any {
	event := args[0]
	target := event.Get("target")

	// TODO: Console log target
	js.Global().Get("console").Call("log", "onPointerDown:", target)

	pointerDown = true

	return nil
}

func onPointerMove(this js.Value, args []js.Value) any {
	if !pointerDown {
		return nil
	}

	event := args[0]
	target := event.Get("target")

	// TODO: Console log target
	js.Global().Get("console").Call("log", "onPointerDown:", target)

	// TODO: Handle swipe movement

	return nil
}

func onPointerUp(this js.Value, args []js.Value) any {
	pointerDown = false

	finishSwipe()

	return nil
}

func onPointerCancel(this js.Value, args []js.Value) any {
	pointerDown = false

	finishSwipe()

	return nil
}

// TODO: Need to pass start -> end positions to finishSwipe
func finishSwipe(start, stop Coordinates) {
	// TODO: Move containers based on swipe direction
}
