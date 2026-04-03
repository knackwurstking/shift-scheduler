package main

import (
	"fmt"
	"syscall/js"
)

func main() {
	// Create a channel to keep the program running
	c := make(chan struct{})

	// Register a function to be called from JavaScript
	js.Global().Set("greet", js.FuncOf(jsGreet))

	fmt.Println("Go WebAssembly initialized")

	initDOM()

	// Keep the program alive
	<-c
}

func initDOM() {
	// Query the button from the DOM (there is only one button in the HTML)
	button := js.Global().Get("document").Call("querySelector", "button")

	// Remove the disabled attribute from the button to enable it
	button.Call("removeAttribute", "disabled")

	// Add a click event listener to the button for greeting
	button.Call("addEventListener", "click", js.FuncOf(func(this js.Value, args []js.Value) any {
		event := args[0]

		// Debug print args and this
		js.Global().Get("console").Call("log", "Button clicked:", event)

		// Call the greet function and log the message to the console
		message := greet("Developer")
		js.Global().Get("console").Call("log", message)

		// Get the element "#output" from the DOM and set its text content to the greeting message
		js.Global().Get("document").Call("querySelector", "#output").Set("textContent", message)

		return nil
	}))
}

// greet is a function that can be called from JavaScript
func jsGreet(this js.Value, args []js.Value) any {
	name := ""
	if len(args) > 0 {
		name = args[0].String()
	}

	message := greet(name)
	js.Global().Get("console").Call("log", message)

	return message
}

// greet is a function that can be called from JavaScript
func greet(userName string) string {
	if userName == "" {
		userName = "World"
	}

	return fmt.Sprintf("Hello, %s! This message is from Go WebAssembly", userName)
}
