import ui from "ui";

// {{{ Content HTML

const contentHTML = `
`;

// }}}

export class EditShift extends ui.wc.Dialog {
    constructor() { // {{{ TODO: create action buttons and content
        super()
        this._createActionButtons()
        this._createContent()
    } // }}}
}
