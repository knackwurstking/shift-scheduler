import ui from "ui"

const innerHTML = `
`

export class EditRhythmDialog extends ui.wc.Dialog {

    static register = () => customElements.define("edit-rhythm-dialog", EditRhythmDialog)

    constructor() {
        super()
    }
}
