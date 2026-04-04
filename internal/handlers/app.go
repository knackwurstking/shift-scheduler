package handlers

import (
	"net/http"
	"strings"

	"github.com/knackwurstking/shift-scheduler/internal/localization"
	"github.com/knackwurstking/shift-scheduler/templates/pages"
	"github.com/labstack/echo/v4"
)

func App(c echo.Context) error {
	// Get language from the request
	language := c.Request().Header.Get("Accept-Language")
	if strings.Contains(language, "de") {
		language = "de"
	} else {
		language = "en"
	}

	t := pages.App(pages.AppProps{
		Localization: localization.New(language),
	})

	if err := t.Render(c.Request().Context(), c.Response()); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to render template: "+err.Error())
	}

	return nil
}
