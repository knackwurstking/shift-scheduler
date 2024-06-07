import { UIInput, UILabel } from "ui";
import { CleanUp, html } from "ui/src/js";

/**
 * @typedef {import("ui/src/ui-input").UIInputEvents} UIInputEvents
 * @typedef {import("../../../types").UIStoreEvents} UIStoreEvents
 * @typedef {import("../../../types").SettingsStore} SettingsStore
 */

const innerHTML = html`
<ui-label>
    <ui-input
        slot="input"
        type="date"
    ></ui-input>
</ui-label>
`;

export class StartDate extends HTMLElement {

    static register = () => {
        UIInput.register();
        UILabel.register();

        customElements.define("settings-start-date", StartDate)
    };

    /**
     * @param {import("ui").UIStore<UIStoreEvents>} store
     * @param {import("ui").UILang} lang
     */
    constructor(store, lang) { // {{{
        super();
        this.innerHTML = innerHTML;

        /** @type {import("ui").UIStore<UIStoreEvents>} */
        this.uiStore = store;
        /** @type {import("ui").UILang} */
        this.uiLang = lang;

        this.cleanup = new CleanUp();

        /** @type {UILabel} */
        this.label = this.querySelector("ui-label");

        /** @type {UIInput<UIInputEvents, "date">} */
        this.input;
        this.createInput();
    } // }}}

    connectedCallback() { // {{{
        this.cleanup.add(
            this.uiStore.ui.on("lang", this.onLang.bind(this), true),
        );

        this.cleanup.add(
            this.uiStore.ui.on("settings", this.onSettings.bind(this), true),
        );
    } // }}}

    disconnectedCallback() { // {{{
        this.cleanup.run();
    } // }}}

    /** @private */
    createInput() { // {{{
        this.input = this.querySelector("ui-input");

        this.input.ui.events.on("input", (/** @type {string} */value) => {
            this.uiStore.ui.update(
                "settings", (/**@type{SettingsStore}*/ settings) => {
                    settings.startDate = value;
                    return settings;
                },
            );
        });
    } // }}}

    /** @private */
    async onLang() { // {{{
        this.label.ui.primary = this.uiLang.ui.get(
            "settings", "label-primary-start-date"
        );
    } // }}}

    /**
     * @private
     * @param {SettingsStore} settings
     */
    async onSettings(settings) { // {{{
        if (settings.startDate === this.input.ui.value) return;
        this.input.ui.value = settings.startDate;
    } // }}}
}
