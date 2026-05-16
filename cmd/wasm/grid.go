package main

import (
	"html/template"
	"strings"
	"time"

	"github.com/knackwurstking/shift-scheduler/internal/localization"
)

const gridTemplateHTML = `<div class="grid-container" data-year="{{.Year}}" data-month="{{.Month}}">
	<table class="grid" data-year="{{.Year}}" data-month="{{.Month}}">
		<thead>
			<tr>
				{{range .WeekDays}}
				<th class="week-day">{{.}}</th>
				{{end}}
			</tr>
		</thead>
		<tbody>
			{{range .Rows}}
			<tr class="row">
				{{range .}}
				<td class="grid-cell{{if .IsToday}} grid-cell-is-today{{end}}{{if .IsCurrentMonth}} grid-cell-is-current-month{{end}}">
					{{if .IsCurrentMonth}}<span class="date">{{.Date}}</span>{{end}}
				</td>
				{{end}}
			</tr>
			{{end}}
		</tbody>
	</table>
</div>`

var gridTmpl *template.Template

func initGridTemplate() {
	gridTmpl = template.Must(template.New("grid-container").Parse(gridTemplateHTML))
}

const (
	classGridContainer = "grid-container"
	idCalendarSwipe    = "calendar-swipe"
	idDatePickerButton = "date-picker-button"
	datePickerFormat   = "January, 2006"
)

type gridTD struct {
	Year     int
	Month    time.Month
	WeekDays []string
	Rows     [][]gridCellTD
}

type gridCellTD struct {
	Date           int
	IsToday        bool
	IsCurrentMonth bool
}

func createGridHTML(year int, month time.Month, l *localization.Localization) string {
	startWithMonday := weekStartAtMonday(l.Language())

	now := time.Now()
	isCurrentMonth := now.Year() == year && now.Month() == month
	offset, date := getStartDay(year, month, startWithMonday)

	var rows [][]gridCellTD
	for row := range 6 {
		var cells []gridCellTD
		for col := range 7 {
			day := row*7 + col - offset + 1

			if date.Month() != month {
				cells = append(cells, gridCellTD{Date: day, IsCurrentMonth: false})
				continue
			}

			cells = append(cells, gridCellTD{
				Date:           day,
				IsToday:        isCurrentMonth && day == now.Day(),
				IsCurrentMonth: day > 0,
			})

			if day > 0 {
				date = date.Add(time.Hour * 24)
			}
		}
		rows = append(rows, cells)
	}

	data := gridTD{
		Year:     year,
		Month:    month,
		WeekDays: getWeekDays(l, startWithMonday),
		Rows:     rows,
	}

	var buf strings.Builder
	if err := gridTmpl.Execute(&buf, data); err != nil {
		panic(err)
	}
	return buf.String()
}

func getWeekDays(l *localization.Localization, startWithMonday bool) []string {
	if startWithMonday {
		return []string{l.Monday, l.Tuesday, l.Wednesday, l.Thursday, l.Friday, l.Saturday, l.Sunday}
	}
	return []string{l.Sunday, l.Monday, l.Tuesday, l.Wednesday, l.Thursday, l.Friday, l.Saturday}
}

func getStartDay(year int, month time.Month, startWithMonday bool) (offset int, date time.Time) {
	date = time.Date(year, month, 1, 0, 0, 0, 0, time.UTC)
	weekDay := int(date.Weekday())

	if startWithMonday {
		if weekDay == 0 {
			return 6, date
		}
		return weekDay - 1, date
	}
	return weekDay, date
}

func weekStartAtMonday(lang string) bool {
	switch lang {
	case "de":
		return true
	default:
		return false
	}
}
