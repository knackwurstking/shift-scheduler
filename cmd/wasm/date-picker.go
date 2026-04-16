package main

import (
	"syscall/js"
	"time"

	"github.com/knackwurstking/shift-scheduler/templates/components/appbar"
)

var datePicker DatePicker

type DatePicker struct{}

func (dp *DatePicker) Query() js.Value {
	return js.Global().Get("document").Call("querySelector", "#"+appbar.IDDatePickerButton)
}

func (dp *DatePicker) Get() (year int, month time.Month) {
	e := dp.Query()

	y := e.Get("dataset").Get("year").Int()
	m := e.Get("dataset").Get("month").Int()
	d := time.Date(y, time.Month(m), 1, 0,0,0,0, time.Local) // Just in case :)

	return d.Year(), d.Month()
}

func (dp *DatePicker) Set(year int, month time.Month) {
	e := dp.Query()
	d := time.Date(year, month, 1, 0, 0, 0, 0, time.Local)

	e.Get("dataset").Set("year", fmt.Sprintf("%d", d.Year()))
	e.Get("dataset").Set("month", fmt.Sprintf("%d", d.Month()))

	e.Set("textContent", d.Format(appbar.DatePickerFormat))
}
