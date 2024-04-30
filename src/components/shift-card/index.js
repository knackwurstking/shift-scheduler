const t = document.createElement("template")
// TODO: Shift card to use for the settings rhythm edit dialog and the edit-mode
t.innerHTML = `
`

export class ShiftCard extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.shadowRoot.appendChild(t.content.cloneNode(true))
    }
}
