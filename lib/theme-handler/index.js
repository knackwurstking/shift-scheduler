import { utils } from "ui"

/** Handle system, dark and light */
export default () => {
    const themeHandler = new utils.theme.ThemeHandler()

    themeHandler.addTheme("zinc", "/themes/zinc.css")
    themeHandler.loadTheme("zinc")

    return themeHandler
}
