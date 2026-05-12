package main

import (
	"strings"
	"time"

	"github.com/knackwurstking/shift-scheduler/internal/localization"
	"github.com/labstack/echo/v4"
)

type IndexTD struct {
	Localization      *localization.Localization
	DatePickerYear    int
	DatePickerMonth   time.Month
	DatePickerContent string
	Grids             []GridTD
}

type GridTD struct {
	Year     int
	Month    time.Month
	WeekDays []string
	Rows     [][]GridCellTD
}

type GridCellTD struct {
	IsToday        bool
	IsCurrentMonth bool
	Date           int
}

func handleIndex(c echo.Context) error {
	lang := c.Request().Header.Get("Accept-Language")
	if strings.Contains(lang, "de") {
		lang = "de"
	} else {
		lang = "en"
	}

	loc := localization.New(lang)
	now := time.Now()
	prev := now.AddDate(0, -1, 0)
	next := now.AddDate(0, 1, 0)

	startWithMonday := weekStartAtMonday(loc.Language())

	data := IndexTD{
		Localization:      loc,
		DatePickerYear:    now.Year(),
		DatePickerMonth:   now.Month(),
		DatePickerContent: now.Format("January, 2006"),
		Grids: []GridTD{
			buildGrid(prev.Year(), prev.Month(), loc, startWithMonday),
			buildGrid(now.Year(), now.Month(), loc, startWithMonday),
			buildGrid(next.Year(), next.Month(), loc, startWithMonday),
		},
	}

	return tmpls.ExecuteTemplate(c.Response(), "index.html", data)
}

func weekStartAtMonday(lang string) bool {
	switch lang {
	case "de":
		return true
	default:
		return false
	}
}

func buildGrid(year int, month time.Month, loc *localization.Localization, startWithMonday bool) GridTD {
	weekDays := getWeekDays(loc, startWithMonday)

	now := time.Now()
	isCurrentMonth := now.Year() == year && now.Month() == month

	offset, date := getStartDay(year, month, startWithMonday)

	var rows [][]GridCellTD
	for row := range 6 {
		var cells []GridCellTD
		for col := range 7 {
			day := row*7 + col - offset + 1

			if date.Month() != month {
				cells = append(cells, GridCellTD{Date: day, IsCurrentMonth: false})
				continue
			}

			cells = append(cells, GridCellTD{
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

	return GridTD{
		Year:     year,
		Month:    month,
		WeekDays: weekDays,
		Rows:     rows,
	}
}

func getWeekDays(loc *localization.Localization, startWithMonday bool) []string {
	if startWithMonday {
		return []string{loc.Monday, loc.Tuesday, loc.Wednesday, loc.Thursday, loc.Friday, loc.Saturday, loc.Sunday}
	}
	return []string{loc.Sunday, loc.Monday, loc.Tuesday, loc.Wednesday, loc.Thursday, loc.Friday, loc.Saturday}
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
