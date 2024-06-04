import * as ui from "ui";

/**
 * @typedef {import("ui/src/ui-dialog").UIDialogEvents} UIDialogEvents
 * @typedef {import("../types").UIStoreEvents} UIStoreEvents
 */

/** @extends {ui.UIDialog<UIDialogEvents>} */
export class DatePickerDialog extends ui.UIDialog {
    /** @type {ui.UIStore<UIStoreEvents>} */
    #store;
    /** @type {ui.UILang} */
    #lang;

    /** @type {ui.UIButton} */
    #cancelButton;
    /** @type {() => void|Promise<void>} */
    #onCancel = () => this.ui.close();

    /** @type {ui.UIButton} */
    #submitButton;
    /** @type {() => void|Promise<void>} */
    #onSubmit = () => {
        this.#store.ui.set(
            "date-picker",
            // @ts-expect-error
            new Date(this.querySelector("ui-input").ui.value).toString()
        );

        this.ui.close();
    };

    static register = () =>
        customElements.define("date-picker-dialog", DatePickerDialog);

    /**
     * @param {ui.UIStore} store
     * @param {ui.UILang} lang
     */
    constructor(store, lang) { // {{{
        super();

        this.#store = store;
        this.#lang = lang;

        /**
         * @private
         * @type {ui.UIStackLayout}
         */
        this.stackLayout = document.querySelector("ui-stack-layout")

        this.createContent();
        this.createActions();
    } // }}}

    connectedCallback() { // {{{
        super.connectedCallback();

        this.stackLayout.ui.lock();
        this.cleanup.add(() => this.stackLayout.ui.unlock());

        setTimeout(() => {
            this.cleanup.add(
                this.#store.ui.on("lang", this.onLang.bind(this), true)
            );
        });
    } // }}}

    /** @private */
    createContent() { // {{{
        const content = new ui.UIFlexGrid();
        content.setAttribute("gap", "0.5rem");
        this.createInput(content);
        this.appendChild(content);
    } // }}}

    /**
     * @private
     * @param {ui.UIFlexGrid} content
     */
    createInput(content) { // {{{
        const date = new Date(this.#store.ui.get("date-picker"));
        const item = new ui.UIFlexGridItem();

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
        let item = new ui.UIFlexGridItem();
        item.slot = "actions"
        item.setAttribute("flex", "0")
        item.innerHTML = `
            <ui-button variant="full" color="secondary"></ui-button>
        `;
        this.#cancelButton = item.querySelector("ui-button");
        this.#cancelButton.onclick = this.#onCancel;
        this.appendChild(item)

        // Submit
        item = new ui.UIFlexGridItem();
        item.slot = "actions"
        item.setAttribute("flex", "0")
        item.innerHTML = `
            <ui-button variant="full" color="primary"></ui-button>
        `;
        this.#submitButton = item.querySelector("ui-button");
        this.#submitButton.onclick = this.#onSubmit;
        this.appendChild(item)
    } // }}}

    /** @private */
    onLang() { // {{{
        this.ui.title = this.#lang.ui.get("date-picker-dialog", "title");

        // @ts-expect-error
        this.querySelector("ui-input").ui.title =
            this.#lang.ui.get("date-picker-dialog", "input-title-month");

        this.#cancelButton.innerText =
            this.#lang.ui.get("date-picker-dialog", "button-cancel");

        this.#submitButton.innerText =
            this.#lang.ui.get("date-picker-dialog", "button-submit");
    } // }}}
}
