import {
    UIButton,
    UIDialog,
    UIFlexGrid,
    UIFlexGridItem
} from "ui";

/**
 * @typedef {import("ui/src/ui-dialog").UIDialogEvents} UIDialogEvents
 * @typedef {import("../types").UIStoreEvents} UIStoreEvents
 */

/** @extends {UIDialog<UIDialogEvents>} */
export class DatePickerDialog extends UIDialog {

    static register = () => { // {{{
        UIDialog.register();
        UIFlexGrid.register();
        UIFlexGridItem.register();
        UIButton.register();

        if (!customElements.get("date-picker-dialog")) {
            customElements.define("date-picker-dialog", DatePickerDialog);
        }
    }; // }}}

    /**
     * @param {import("ui").UIStore} store
     * @param {import("ui").UILang} lang
     */
    constructor(store, lang) { // {{{
        super();

        /**
         * @type {import("ui").UIStore<UIStoreEvents>}
         */
        this.uiStore = store;

        /**
         * @type {import("ui").UILang}
         */
        this.uiLang = lang;

        /**
         * @type {import("ui").UIStackLayout}
         */
        this.stackLayout = document.querySelector("ui-stack-layout")

        /**
         * @type {UIButton}
         */
        this.cancel;

        /**
         * @type {UIButton}
         */
        this.submit;

        this.createContent();
        this.createActions();
    } // }}}

    connectedCallback() { // {{{
        super.connectedCallback();

        this.stackLayout.ui.lock();
        this.cleanup.add(() => this.stackLayout.ui.unlock());

        setTimeout(() => {
            this.cleanup.add(
                this.uiStore.ui.on("lang", this.onLang.bind(this), true)
            );
        });
    } // }}}

    /** @private */
    createContent() { // {{{
        const content = new UIFlexGrid();
        content.setAttribute("gap", "0.5rem");
        this.createInput(content);
        this.appendChild(content);
    } // }}}

    /**
     * @private
     * @param {UIFlexGrid} content
     */
    createInput(content) { // {{{
        const date = new Date(this.uiStore.ui.get("date-picker"));
        const item = new UIFlexGridItem();

        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');

        item.innerHTML = `
            <ui-input
                type="month"
                value="${y}-${m}"
            ></ui-input>
        `;

        content.appendChild(item);
    } // }}}

    /** @private */
    createActions() { // {{{
        // Cancel
        let item = new UIFlexGridItem();
        item.slot = "actions"
        item.setAttribute("flex", "0")
        item.innerHTML = `
            <ui-button variant="full" color="secondary"></ui-button>
        `;
        this.cancel = item.querySelector("ui-button");
        this.cancel.onclick = this.onCancel.bind(this);
        this.appendChild(item)

        // Submit
        item = new UIFlexGridItem();
        item.slot = "actions"
        item.setAttribute("flex", "0")
        item.innerHTML = `
            <ui-button variant="full" color="primary"></ui-button>
        `;
        this.submit = item.querySelector("ui-button");
        this.submit.onclick = this.onSubmit.bind(this);
        this.appendChild(item)
    } // }}}

    /**
     * @private
     */
    onCancel() { // {{{
        this.ui.close();
    } // }}}

    /**
     * @private
     */
    async onSubmit() { // {{{
        this.uiStore.ui.set(
            "date-picker",
            // @ts-expect-error
            new Date(this.querySelector("ui-input").ui.value).toString()
        );

        this.ui.close();
    }; // }}}

    /** @private */
    onLang() { // {{{
        this.ui.title = this.uiLang.ui.get("date-picker-dialog", "title");

        // @ts-expect-error
        this.querySelector("ui-input").ui.title =
            this.uiLang.ui.get("date-picker-dialog", "input-title-month");

        this.cancel.innerText =
            this.uiLang.ui.get("date-picker-dialog", "button-cancel");

        this.submit.innerText =
            this.uiLang.ui.get("date-picker-dialog", "button-submit");
    } // }}}
}
