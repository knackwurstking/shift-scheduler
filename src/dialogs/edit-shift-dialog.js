import ui from "ui";

/**
 * @typedef {import("../types").Shift} Shift
 *
 * @typedef {import("ui/src/wc").Store<import("../types").StoreEvents>} Store
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").FlexGrid} FlexGrid
 * @typedef {import("ui/src/wc").FlexGridItem} FlexGridItem
 * @typedef {import("ui/src/wc").StackLayout} StackLayout
 * @typedef {import("ui/src/wc").Button} Button
 * @typedef {import("ui/src/wc").Label} Label
 * @typedef {import("ui/src/wc/dialog/dialog").DialogEvents} DialogEvents 
 */

/**
 * @extends {ui.wc.Dialog<DialogEvents & { submit: Shift }>}
 */
export class EditShiftDialog extends ui.wc.Dialog {
    /** @type {Store} */
    #store;
    /** @type {Lang} */
    #lang;
    /** @type {StackLayout} */
    #stackLayout;

    /** @type {Button} */
    #cancelButton;
    #onCancel = async () => this.ui.close();

    /** @type {Button} */
    #submitButton;
    #onSubmit = () => {
        this.ui.events.dispatch("submit", this.shift);
        this.ui.close();
    };

    static register = () => customElements.define("edit-shift-dialog", EditShiftDialog);

    /**
     * @param {Shift} shift
     * @param {Store} store
     * @param {Lang} lang
     */
    constructor(shift, store, lang) { // {{{
        super();

        /** @type {Shift} */
        this.shift = { ...shift }

        this.#store = store;
        this.#lang = lang
        this.#stackLayout = document.querySelector("ui-stack-layout")

        this.colorReset = null;

        this.createContent();
        this.createActionButtons();

        this.cleanup = []
    } // }}}

    connectedCallback() { // {{{
        super.connectedCallback();
        this.#stackLayout.ui.lock()

        setTimeout(() => {
            this.#store.ui.on("lang", this.onLang.bind(this), true);
        });
    } // }}}

    disconnectedCallback() { // {{{
        super.disconnectedCallback();
        this.#stackLayout.ui.unlock()
        this.cleanup.forEach(fn => fn());
        this.cleanup = [];
    } // }}}

    /** @private */
    createContent() { // {{{
        const content = new ui.wc.FlexGrid();

        content.setAttribute("gap", "0.5rem");

        this.createContentSectionName(content)
        this.createContentSectionShortName(content)
        this.createContentColorPicker(content);
        this.createContentUseDefaultColorCheckbox(content)
        this.createContentVisibleCheckbox(content)

        this.appendChild(content);
    } // }}}

    /**
     * @private
     * @param {FlexGrid} container 
     */
    createContentSectionName(container) { // {{{
        this.nameItem = new ui.wc.FlexGridItem();
        this.nameItem.innerHTML = `
                <ui-secondary></ui-secondary>
                <input type="text" value="${this.shift.name}">
            `;

        this.nameItem.querySelector("input").oninput =
            async (/** @type {Event & { currentTarget: HTMLInputElement }} */ev) => {
                this.shift.name = ev.currentTarget.value;
            };

        container.appendChild(this.nameItem);
    } // }}}

    /**
     * @private
     * @param {FlexGrid} container 
     */
    createContentSectionShortName(container) { // {{{
        this.shortNameItem = new ui.wc.FlexGridItem();
        this.shortNameItem.innerHTML = `
            <ui-secondary>
                ${this.#lang.ui.get("edit-shift-dialog", "input-title-short-name")}
            </ui-secondary>
            <input
                style="color: ${this.shift.color || 'inherit'};"
                type="text"
                value="${this.shift.shortName}"
            >
        `;

        this.shortNameItem.querySelector("input").oninput =
            async (/** @type {Event & { currentTarget: HTMLInputElement }} */ev) => {
                this.shift.shortName = ev.currentTarget.value;
            };

        if (!this.shift.visible) {
            this.disableContentSection(this.shortNameItem);
        } else {
            this.enableContentSection(this.shortNameItem);
        }

        container.appendChild(this.shortNameItem);
    } // }}}

    /**
     * @private
     * @param {FlexGrid} container 
     */
    createContentColorPicker(container) { // {{{
        this.colorPickerItem = new ui.wc.FlexGridItem();
        this.colorPickerItem.innerHTML = `
            <ui-label>
                <input slot="input" style="width: 100%; min-width: 4rem;" type="color" value="${this.shift.color}">
            </ui-label>
        `;

        this.colorPickerItem.querySelector("input").onchange =
            async (/**@type{Event & { currentTarget:  HTMLInputElement }}*/ev) => {
                this.updateShiftColor(ev.currentTarget.value || null)
            };

        if (!this.shift.visible) {
            this.disableContentSection(this.colorPickerItem);
        } else {
            this.enableContentSection(this.colorPickerItem);
        }

        container.appendChild(this.colorPickerItem);
    } // }}}

    /**
     * @private
     * @param {FlexGrid} container 
     */
    createContentUseDefaultColorCheckbox(container) { // {{{
        this.useDefaultColorItem = new ui.wc.FlexGridItem();
        this.useDefaultColorItem.innerHTML = `
            <ui-label ripple>
                <input slot="input" type="checkbox">
            </ui-label>
        `;

        /** @type {HTMLInputElement} */
        const input = this.useDefaultColorItem.querySelector("input");
        input.checked = !this.shift.color;
        input.onchange = async () => {
            if (input.checked) {
                this.colorReset = this.shift.color;
                this.updateShiftColor(null);
                this.disableContentSection(this.colorPickerItem);
            } else {
                this.shift.color = this.colorReset;
                this.updateShiftColor(this.shift.color);
                this.enableContentSection(this.colorPickerItem);
            }
        };

        if (input.checked) {
            this.colorReset = this.shift.color;
            this.updateShiftColor(null)
            this.disableContentSection(this.colorPickerItem);
        }

        container.appendChild(this.useDefaultColorItem);
    } // }}}

    /**
     * @private
     * @param {FlexGrid} container 
     */
    createContentVisibleCheckbox(container) { // {{{
        this.visibleItem = new ui.wc.FlexGridItem();
        this.visibleItem.innerHTML = `
            <ui-label ripple>
                <input slot="input" type="checkbox">
            </ui-label>
        `;

        const input = this.visibleItem.querySelector("input");
        input.checked = !this.shift.visible;
        input.onchange = async () => {
            if (input.checked) {
                this.setVisible(false)
            } else {
                this.setVisible(true)
                const input = this.useDefaultColorItem.querySelector("input");
                input.onchange(null);
            }
        };

        if (input.checked) {
            this.setVisible(false)
        }

        container.appendChild(this.visibleItem);
    } // }}}

    /** @private */
    createActionButtons() { // {{{
        // Cancel Button
        let item = new ui.wc.FlexGridItem()
        item.slot = "actions"
        item.setAttribute("flex", "0")
        item.innerHTML = `<ui-button color="secondary" variant="full"></ui-button>`
        this.#cancelButton = item.querySelector("ui-button")
        this.#cancelButton.onclick = this.#onCancel;
        this.appendChild(item)

        // Submit Button
        item = new ui.wc.FlexGridItem()
        item.slot = "actions"
        item.setAttribute("flex", "0")
        item.innerHTML = `<ui-button color="primary" variant="full"></ui-button>`
        this.#submitButton = item.querySelector("ui-button")
        this.#submitButton.onclick = this.#onSubmit;
        this.appendChild(item)
    } // }}}

    /**
     * @private
     * @param {FlexGridItem} item
     */
    enableContentSection(item) { // {{{
        item.style.opacity = "1";
        item.style.userSelect = "auto";
        const input = item.querySelector("input");
        if (!!input) input.disabled = false;
    } // }}}

    /**
     * @private
     * @param {FlexGridItem} item
     */
    disableContentSection(item) { // {{{
        item.style.opacity = "0.25";
        item.style.userSelect = "none";
        const input = item.querySelector("input");
        if (!!input) input.disabled = true;
    } // }}}

    /**
     * @private 
     * @param {string | null} color
     */
    async updateShiftColor(color) { // {{{
        this.shift.color = color;
        this.shortNameItem.querySelector("input").style.color = this.shift.color || "inherit";
    } // }}}

    /**
     * @private 
     * @param {boolean} state
     */
    async setVisible(state) { // {{{
        if (state) {
            this.enableContentSection(this.shortNameItem);
            this.enableContentSection(this.colorPickerItem);
            this.enableContentSection(this.useDefaultColorItem);
        } else {
            this.disableContentSection(this.shortNameItem);
            this.disableContentSection(this.colorPickerItem);
            this.disableContentSection(this.useDefaultColorItem);
        }

        this.shift.visible = state;
    } // }}}

    /** @private */
    async onLang() { // {{{
        this.ui.title = this.#lang.ui.get("edit-shift-dialog", "title");

        // Name
        this.nameItem.querySelector("ui-secondary").innerHTML =
            this.#lang.ui.get("edit-shift-dialog", "input-title-name");

        // Short
        this.shortNameItem.querySelector("ui-secondary").innerHTML =
            this.#lang.ui.get("edit-shift-dialog", "input-title-short-name");

        // @ts-expect-error - ui.primary is a `ui.wc.Label` thing
        this.colorPickerItem.querySelector("ui-label").ui.primary =
            this.#lang.ui.get("edit-shift-dialog", "label-primary-color-picker");

        // @ts-expect-error - ui.primary is a `ui.wc.Label` thing
        this.useDefaultColorItem.querySelector("ui-label").ui.primary =
            this.#lang.ui.get("edit-shift-dialog", "label-primary-use-default-color");

        // @ts-expect-error - ui.primary is a `ui.wc.Label` thing
        this.visibleItem.querySelector("ui-label").ui.primary =
            this.#lang.ui.get("edit-shift-dialog", "label-primary-visible-item");

        this.#cancelButton.innerText = this.#lang.ui.get("edit-shift-dialog", "button-cancel");
        this.#submitButton.innerText = this.#lang.ui.get("edit-shift-dialog", "button-submit");
    }
} // }}}
