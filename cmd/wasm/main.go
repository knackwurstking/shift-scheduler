package main

import (
	"fmt"
	"syscall/js"
)

func main() {
	// Create a channel to keep the program running
	closeCh := make(chan struct{}) // NOTE: Currently there are no closing mechanism

	fmt.Println("Go WebAssembly initialized")
	initDOM()

	// Keep the program alive
	<-closeCh
}

func initDOM() {
	register()
}

func register() {
	js.Global().Set("onPointerDown", js.FuncOf(onPointerDown))
	js.Global().Set("onPointerMove", js.FuncOf(onPointerMove))
	js.Global().Set("onPointerUp", js.FuncOf(onPointerUp))
	js.Global().Set("onPointerCancel", js.FuncOf(onPointerUp))
	js.Global().Set("onPointerOut", js.FuncOf(onPointerUp))
	js.Global().Set("onPointerLeave", js.FuncOf(onPointerUp))
}
