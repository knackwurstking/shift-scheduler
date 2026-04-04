package handlers

import (
	"net/http"

	"github.com/knackwurstking/shift-scheduler/templates/pages"
	"github.com/labstack/echo/v4"
)

func App(c echo.Context) error {
	// TODO: Get language from request, load the localization file and pass it to the template.

	t := pages.App()

	if err := t.Render(c.Request().Context(), c.Response()); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to render template: "+err.Error())
	}

	return nil
}
