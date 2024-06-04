import * as ui from "ui";

/**
 * @typedef {import("ui/src/ui-input").UIInputEvents} UIInputEvents
 * @typedef {import("ui/src/ui-dialog").UIDialogEvents} UIDialogEvents
 * @typedef {import("../types").Shift} Shift
 * @typedef {import("../types").UIStoreEvents} UIStoreEvents
 */

/**
 * @extends {ui.UIDialog<UIDialogEvents & { submit: Shift }>}
 */
export class EditShiftDialog extends ui.UIDialog {
    /** @type {ui.UIStore<UIStoreEvents>} */
    #store;
    /** @type {ui.UILang} */
    #lang;

    /** @type {ui.UIButton} */
    #cancelButton;
    #onCancel = async () => this.ui.close();

    /** @type {ui.UIButton} */
    #submitButton;
    #onSubmit = () => {
        this.ui.events.dispatch("submit", this.shift);
        this.ui.close();
    };

    static register = () =>
        customElements.define("edit-shift-dialog", EditShiftDialog);

    /**
     * @param {Shift} shift
     * @param {ui.UIStore<UIStoreEvents>} store
     * @param {ui.UILang} lang
     */
    constructor(shift, store, lang) { // {{{
        super();

        /** @type {Shift} */
        this.shift = { ...shift }

        this.#store = store;
        this.#lang = lang

        /**
         * @private
         * @type {ui.UIStackLayout}
         */
        this.stackLayout = document.querySelector("ui-stack-layout")

        this.colorReset = null;

        /**
         * @private
         * @type {ui.UIFlexGridItem}
         */
        this.nameItem;

        /**
         * @private
         * @type {ui.UIFlexGridItem}
         */
        this.shortNameItem;

        /**
         * @private
         * @type {ui.UIFlexGridItem}
         */
        this.colorPickerItem;

        /**
         * @private
         * @type {ui.UIFlexGridItem}
         */
        this.useDefaultColorItem;

        /**
         * @private
         * @type {ui.UIFlexGridItem}
         */
        this.visibleItem;

        /**
         * @private
         * @type {ui.UIInput<UIInputEvents, "text">}
         */
        this.name;

        /**
         * @private
         * @type {ui.UIInput<UIInputEvents, "text">}
         */
        this.shortName;

        this.createContent();
        this.createActionButtons();
    } // }}}

    connectedCallback() { // {{{
        super.connectedCallback();

        this.stackLayout.ui.lock();
        this.cleanup.add(() => this.stackLayout.ui.unlock());

        setTimeout(() => {
            this.cleanup.add(
                this.#store.ui.on("lang", this.onLang.bind(this), true),
            );
        });
    } // }}}

    /** @private */
    createContent() { // {{{
        const content = new ui.UIFlexGrid();

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
     * @param {ui.UIFlexGrid} container 
     */
    createContentSectionName(container) { // {{{
        this.nameItem = new ui.UIFlexGridItem();
        this.nameItem.innerHTML = `
            <ui-input
                type="text"
                value="${this.shift.name}"
            ></ui-input>
        `;

        this.name = this.nameItem.querySelector("ui-input");
        this.name.ui.events.on("input", async (/** @type {string} */value) => {
            this.shift.name = value;
        });

        container.appendChild(this.nameItem);
    } // }}}

    /**
     * @private
     * @param {ui.UIFlexGrid} container 
     */
    createContentSectionShortName(container) { // {{{
        this.shortNameItem = new ui.UIFlexGridItem();
        this.shortNameItem.innerHTML = `
            <ui-input
                type="text"
                value="${this.shift.shortName}"
            ></ui-input>
        `;

        this.shortName = this.shortNameItem.querySelector("ui-input");
        this.shortName.ui.input.style.color = this.shift.color || "inherit";

        this.shortName.ui.events.on("input", async (/** @type {string} */ value) => {
            this.shift.shortName = value;
        });

        if (!this.shift.visible) {
            this.disableContentSection(this.shortNameItem);
        } else {
            this.enableContentSection(this.shortNameItem);
        }

        container.appendChild(this.shortNameItem);
    } // }}}

    /**
     * @private
     * @param {ui.UIFlexGrid} container 
     */
    createContentColorPicker(container) { // {{{
        this.colorPickerItem = new ui.UIFlexGridItem();
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
     * @param {ui.UIFlexGrid} container 
     */
    createContentUseDefaultColorCheckbox(container) { // {{{
        this.useDefaultColorItem = new ui.UIFlexGridItem();
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
     * @param {ui.UIFlexGrid} container 
     */
    createContentVisibleCheckbox(container) { // {{{
        this.visibleItem = new ui.UIFlexGridItem();
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
        let item = new ui.UIFlexGridItem()
        item.slot = "actions"
        item.setAttribute("flex", "0")
        item.innerHTML = `<ui-button color="secondary" variant="full"></ui-button>`
        this.#cancelButton = item.querySelector("ui-button")
        this.#cancelButton.onclick = this.#onCancel;
        this.appendChild(item)

        // Submit Button
        item = new ui.UIFlexGridItem()
        item.slot = "actions"
        item.setAttribute("flex", "0")
        item.innerHTML = `<ui-button color="primary" variant="full"></ui-button>`
        this.#submitButton = item.querySelector("ui-button")
        this.#submitButton.onclick = this.#onSubmit;
        this.appendChild(item)
    } // }}}

    /**
     * @private
     * @param {ui.UIFlexGridItem} item
     */
    enableContentSection(item) { // {{{
        item.style.opacity = "1";
        item.style.userSelect = "auto";
        const input = item.querySelector("input");
        if (!!input) input.disabled = false;
    } // }}}

    /**
     * @private
     * @param {ui.UIFlexGridItem} item
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
        this.shortName.ui.input.style.color = this.shift.color || "inherit"
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
        this.name.ui.title =
            this.#lang.ui.get("edit-shift-dialog", "input-title-name");

        // Short
        this.shortName.ui.title =
            this.#lang.ui.get("edit-shift-dialog", "input-title-short-name");

        // @ts-expect-error - ui.primary is a `ui.wc.Label` thing
        this.colorPickerItem.querySelector("ui-label").ui.primary =
            this.#lang.ui.get(
                "edit-shift-dialog",
                "label-primary-color-picker"
            );

        // @ts-expect-error - ui.primary is a `ui.wc.Label` thing
        this.useDefaultColorItem.querySelector("ui-label").ui.primary =
            this.#lang.ui.get(
                "edit-shift-dialog",
                "label-primary-use-default-color"
            );

        // @ts-expect-error - ui.primary is a `ui.wc.Label` thing
        this.visibleItem.querySelector("ui-label").ui.primary =
            this.#lang.ui.get(
                "edit-shift-dialog",
                "label-primary-visible-item"
            );

        this.#cancelButton.innerText =
            this.#lang.ui.get("edit-shift-dialog", "button-cancel");

        this.#submitButton.innerText =
            this.#lang.ui.get("edit-shift-dialog", "button-submit");
    } // }}}
}
