import "./node_modules/ui/css/main.css"
import "./style.css"

import themeHandler from "./lib/theme-handler"

document.querySelector('#app').innerHTML = `
`

window.addEventListener("DOMContentLoaded", main)

async function main() {
    themeHandler.start()
}
