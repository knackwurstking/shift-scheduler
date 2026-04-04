package handlers

import (
	"net/http"

	"github.com/knackwurstking/shift-scheduler/templates/pages/home"
	"github.com/labstack/echo/v4"
)

func Home(c echo.Context) error {
	t := home.Page()

	if err := t.Render(c.Request().Context(), c.Response()); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to render template: "+err.Error())
	}

	return nil
}
