import { CleanUp, html } from "ui";

/**
 * HTML: `settings-start-date`
 */
export class SettingsStartDate extends HTMLElement {
    static register = () => {
        customElements.define("settings-start-date", SettingsStartDate);
    };

    constructor() {
        super();

        this.cleanup = new CleanUp();

        /** @type {SchedulerStore} */
        this.uiStore = document.querySelector("ui-store");
        /** @type {import("ui").UILang} */
        this.uiLang = document.querySelector("ui-lang");

        this.label;

        this.render();
    }

    render() {
        this.innerHTML = html`
            <ui-label>
                <ui-input slot="input" type="date"></ui-input>
            </ui-label>
        `;

        /** @type {import("ui").UILabel} */
        this.label = this.querySelector("ui-label");

        /** @type {import("ui").UIInput<import("ui").UIInput_Events>} */
        const input = this.label.ui.inputSlot[0];
        input.ui.events.on("input", (/** @type {string} */ value) => {
            this.uiStore.ui.update(
                "settings",
                (/**@type{SchedulerStore_Settings}*/ settings) => {
                    settings.startDate = value;
                    return settings;
                },
            );
        });
    }

    connectedCallback() {
        this.cleanup.add(
            this.uiStore.ui.on(
                "settings",
                this.storeHandlerSettings.bind(this),
                true,
            ),

            this.uiStore.ui.on("lang", this.storeHandlerLang.bind(this), true),
        );
    }

    disconnectedCallback() {
        this.cleanup.run();
    }

    /**
     * @private
     * @param {SchedulerStore_Settings} settings
     */
    async storeHandlerSettings(settings) {
        const input = this.label.ui.inputSlot[0];
        if (settings.startDate === input.ui.value) return;
        input.ui.value = settings.startDate;
    }

    /** @private */
    async storeHandlerLang() {
        this.label.ui.primary = this.uiLang.ui.get(
            "settings",
            "label-primary-start-date",
        );
    }
}
