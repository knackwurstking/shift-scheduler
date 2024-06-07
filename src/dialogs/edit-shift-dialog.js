import {
    UIButton,
    UIDialog,
    UIFlexGrid,
    UIFlexGridItem,
    UIInput,
    UILabel
} from "ui";

/**
 * @typedef {import("ui/src/ui-input").UIInputEvents} UIInputEvents
 * @typedef {import("ui/src/ui-dialog").UIDialogEvents} UIDialogEvents
 * @typedef {import("../types").Shift} Shift
 * @typedef {import("../types").UIStoreEvents} UIStoreEvents
 */

/**
 * @extends {UIDialog<UIDialogEvents & { submit: Shift }>}
 */
export class EditShiftDialog extends UIDialog {

    static register = () => {
        UIDialog.register();
        UIFlexGrid.register();
        UIFlexGridItem.register();
        UIButton.register();
        UIInput.register();
        UILabel.register();

        if (!customElements.get("edit-shift-dialog")) {
            customElements.define("edit-shift-dialog", EditShiftDialog);
        }
    }

    /**
     * @param {Shift} shift
     * @param {import("ui").UIStore<UIStoreEvents>} store
     * @param {import("ui").UILang} lang
     */
    constructor(shift, store, lang) { // {{{
        super();

        /** @type {Shift} */
        this.shift = { ...shift }

        /** @type {import("ui").UIStore<UIStoreEvents>} */
        this.uiStore = store;

        /** @type {import("ui").UILang} */
        this.uiLang = lang

        /** @type {import("ui").UIStackLayout} */
        this.stackLayout = document.querySelector("ui-stack-layout")

        this.colorReset = null;

        /** @type {UIFlexGridItem} */
        this.nameItem;

        /** @type {UIFlexGridItem} */
        this.shortNameItem;

        /** @type {UIFlexGridItem} */
        this.colorPickerItem;

        /** @type {UIFlexGridItem} */
        this.useDefaultColorItem;

        /** @type {UIFlexGridItem} */
        this.visibleItem;

        /** @type {UIInput<UIInputEvents, "text">} */
        this.name;

        /** @type {UIInput<UIInputEvents, "text">} */
        this.shortName;

        /** @type {UIButton} */
        this.cancel;

        /** @type {UIButton} */
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
                this.uiStore.ui.on("lang", this.onLang.bind(this), true),
            );
        });
    } // }}}

    /** @private */
    createContent() { // {{{
        const content = new UIFlexGrid();

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
     * @param {UIFlexGrid} container 
     */
    createContentSectionName(container) { // {{{
        this.nameItem = new UIFlexGridItem();
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
     * @param {UIFlexGrid} container 
     */
    createContentSectionShortName(container) { // {{{
        this.shortNameItem = new UIFlexGridItem();
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
     * @param {UIFlexGrid} container 
     */
    createContentColorPicker(container) { // {{{
        this.colorPickerItem = new UIFlexGridItem();
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
     * @param {UIFlexGrid} container 
     */
    createContentUseDefaultColorCheckbox(container) { // {{{
        this.useDefaultColorItem = new UIFlexGridItem();
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
     * @param {UIFlexGrid} container 
     */
    createContentVisibleCheckbox(container) { // {{{
        this.visibleItem = new UIFlexGridItem();
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
    createActions() { // {{{
        // Cancel Button
        let item = new UIFlexGridItem()
        item.slot = "actions"
        item.setAttribute("flex", "0")
        item.innerHTML = `<ui-button color="secondary" variant="full"></ui-button>`
        this.cancel = item.querySelector("ui-button")
        this.cancel.onclick = this.onCancel.bind(this);
        this.appendChild(item)

        // Submit Button
        item = new UIFlexGridItem()
        item.slot = "actions"
        item.setAttribute("flex", "0")
        item.innerHTML = `<ui-button color="primary" variant="full"></ui-button>`
        this.submit = item.querySelector("ui-button")
        this.submit.onclick = this.onSubmit.bind(this);
        this.appendChild(item)
    } // }}}

    /**
     * @private
     * @param {UIFlexGridItem} item
     */
    enableContentSection(item) { // {{{
        item.style.opacity = "1";
        item.style.userSelect = "auto";
        const input = item.querySelector("input");
        if (!!input) input.disabled = false;
    } // }}}

    /**
     * @private
     * @param {UIFlexGridItem} item
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

    onCancel() {
        this.ui.close();
    }

    async onSubmit() {
        this.ui.events.dispatch("submit", this.shift);
        this.ui.close();
    }

    /** @private */
    async onLang() { // {{{
        this.ui.title = this.uiLang.ui.get("edit-shift-dialog", "title");

        // Name
        this.name.ui.title =
            this.uiLang.ui.get("edit-shift-dialog", "input-title-name");

        // Short
        this.shortName.ui.title =
            this.uiLang.ui.get("edit-shift-dialog", "input-title-short-name");

        // @ts-expect-error - ui.primary is a `ui.wc.Label` thing
        this.colorPickerItem.querySelector("ui-label").ui.primary =
            this.uiLang.ui.get(
                "edit-shift-dialog",
                "label-primary-color-picker"
            );

        // @ts-expect-error - ui.primary is a `ui.wc.Label` thing
        this.useDefaultColorItem.querySelector("ui-label").ui.primary =
            this.uiLang.ui.get(
                "edit-shift-dialog",
                "label-primary-use-default-color"
            );

        // @ts-expect-error - ui.primary is a `ui.wc.Label` thing
        this.visibleItem.querySelector("ui-label").ui.primary =
            this.uiLang.ui.get(
                "edit-shift-dialog",
                "label-primary-visible-item"
            );

        this.cancel.innerText =
            this.uiLang.ui.get("edit-shift-dialog", "button-cancel");

        this.submit.innerText =
            this.uiLang.ui.get("edit-shift-dialog", "button-submit");
    } // }}}
}
