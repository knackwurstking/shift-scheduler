package main

import (
	"fmt"
	"syscall/js"
)

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

// TODO: Swipe handlers
//  - onPointerMove
//  - onPointerDown
//  - onPointerUp
//  - onPointerCancel

func onPointerDown(this js.Value, args []js.Value) any {
	event := args[0]
	target := event.Get("target")

	// TODO: Console log target
	js.Global().Get("console").Call("log", "onPointerDown:", target)

	// TODO: Set pointer down state, this will enable the swipe handler (onPointerMove)

	return nil
}
