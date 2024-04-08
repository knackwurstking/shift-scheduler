import "./node_modules/ui/css/main.css"
import "./style.css"

import StackLayout from "./lib/stack-layout"
import Storage from "./lib/storage"

const storage = new Storage()

document.querySelector('#app').innerHTML = `
    <main class="container ui-container is-debug">
        <div class="stack-layout is-max"></div>
    </main>
`

async function main() {
    const themeHandler = createThemeHandler()
    const stackLayout = new StackLayout(
        document.querySelector("main.container > .stack-layout")
    )

    // TODO: add the top-app-bar and the first page (calendar)
}

window.addEventListener("DOMContentLoaded", main)

async function createThemeHandler() {
    const themeHandler = new utils.theme.ThemeHandler()

    themeHandler.addTheme("zinc", "/themes/zinc.css")
    themeHandler.loadTheme(constants.theme.name)

    const theme = storage.get("theme", null)
    if (theme?.mode) {
        themeHandler.setMode(theme.mode)
    }

    return themeHandler
}
