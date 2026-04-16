package main

import (
	"syscall/js"
	"time"

	"github.com/knackwurstking/shift-scheduler/templates/components/appbar"
)

var datePicker DatePicker

type DatePicker struct {}

func (dp *DatePicker) Query() js.Value {
	return js.Global().Get("document").Call("querySelector", "#"+appbar.IDDatePickerButton)
}

func (dp *DatePicker) Set(year int, month time.Month) {
	e := dp.Query()
	d := time.Date(year, month, 1, 0,0,0,0, time.Local)
	e.Set("textContent", d.Format(appbar.DatePickerFormat))
}
