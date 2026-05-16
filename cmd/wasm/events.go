package main

import (
	"syscall/js"
)

func openDatePicker(this js.Value, args []js.Value) any {
	btn := js.Global().Get("document").Call("querySelector", "#date-picker-button")
	if btn.IsNull() || btn.IsUndefined() {
		return nil
	}
	input := btn.Call("querySelector", "input[type=date]")
	if input.IsNull() || input.IsUndefined() {
		return nil
	}
	input.Call("showPicker")
	return nil
}

func initDatePickerListener() {
	input := js.Global().Get("document").Call("querySelector", "#date-picker-button input[type=date]")
	if input.IsNull() || input.IsUndefined() {
		return
	}
	input.Call("addEventListener", "change", js.FuncOf(func(this js.Value, args []js.Value) any {
		if len(args) == 0 {
			return nil
		}
		val := args[0].Get("target").Get("value").String()
		btn := js.Global().Get("document").Call("querySelector", "#date-picker-button")
		if !btn.IsNull() && !btn.IsUndefined() {
			btn.Set("textContent", val)
		}
		return nil
	}))
}

func toggleTheme(this js.Value, args []js.Value) any {
	html := js.Global().Get("document").Get("documentElement")
	attr := html.Call("getAttribute", "data-theme")

	isDark := false
	if attr.IsNull() || attr.String() == "" {
		isDark = js.Global().Get("window").Call("matchMedia", "(prefers-color-scheme: dark)").Get("matches").Bool()
	} else {
		isDark = attr.String() == "dark"
	}

	if isDark {
		html.Call("setAttribute", "data-theme", "light")
		js.Global().Get("localStorage").Call("setItem", "theme", "light")
	} else {
		html.Call("setAttribute", "data-theme", "dark")
		js.Global().Get("localStorage").Call("setItem", "theme", "dark")
	}
	return nil
}
