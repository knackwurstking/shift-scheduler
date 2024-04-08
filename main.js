import "./node_modules/ui/css/main.css"
import "./style.css"

import setupThemeHandler from "./lib/theme-handler"

document.querySelector('#app').innerHTML = `
`

window.addEventListener("DOMContentLoaded", main)

async function main() {
    const themeHandler = setupThemeHandler()

    themeHandler.start()
}
