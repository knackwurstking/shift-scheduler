import "./node_modules/ui/css/main.css"
import "./style.css"

import AppBar from "./lib/app-bar"
import StackLayout from "./lib/stack-layout"
import Storage from "./lib/storage"

const storage = new Storage()

document.querySelector('#app').innerHTML = `
    <main class="container ui-container is-debug">
        <div class="stack-layout is-max"></div>
    </main>

    <header class="ui-app-bar ui-app-bar-top">
        <div class="ui-app-bar-main">
            <div></div>

            <div>
                <h4 class="app-bar-title"></h4>
            </div>

            <div></div>
        </div>
    </header>
`

async function main() {
    const themeHandler = createThemeHandler()

    const stackLayout = new StackLayout(
        document.querySelector("main.container > .stack-layout")
    )

    const appBar = new AppBar(
        document.querySelector(".ui-app-bar")
    )

    // TODO: ...
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
