import { utils } from "ui"
import storage from "../storage/"
import constants from "../constants"

/** Handle system, dark and light */
export default (() => {
    const themeHandler = new utils.theme.ThemeHandler()

    themeHandler.addTheme("zinc", "/themes/zinc.css")
    themeHandler.loadTheme(constants.theme.name)

    const theme = storage.get("theme", null)
    if (theme?.mode) {
        themeHandler.setMode(theme.mode)
    }

    return themeHandler
})()
