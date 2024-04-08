import { utils } from "ui"

/** Handle system, dark and light */
export default () => {
    const themeHandler = new utils.theme.ThemeHandler()

    // TODO: localStorage handling is still missing

    themeHandler.addTheme("zinc", "/themes/zinc.css")
    themeHandler.loadTheme("zinc")

    return themeHandler
}
