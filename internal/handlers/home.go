package handlers

import (
	"base-ah-templ/templates/pages/home"
	"net/http"

	"github.com/labstack/echo/v4"
)

func Home(c echo.Context) error {
	t := home.Page()

	if err := t.Render(c.Request().Context(), c.Response()); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to render template: "+err.Error())
	}

	return nil
}
