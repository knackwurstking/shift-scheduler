package main

import (
	"fmt"
	"syscall/js"
)

func main() {
	// Create a channel to keep the program running
	c := make(chan struct{})

	fmt.Println("Go WebAssembly initialized")
	initDOM()

	// Keep the program alive
	<-c
}

func initDOM() {
	register()
}

func register() {
	// Register swipe handlers
	js.Global().Set("onPointerDown", js.FuncOf(onPointerDown))
	js.Global().Set("onPointerMove", js.FuncOf(onPointerMove))
	js.Global().Set("onPointerUp", js.FuncOf(onPointerUp))
	js.Global().Set("onPointerCancel", js.FuncOf(onPointerUp))
	js.Global().Set("onPointerOut", js.FuncOf(onPointerUp))
	js.Global().Set("onPointerLeave", js.FuncOf(onPointerUp))
}
