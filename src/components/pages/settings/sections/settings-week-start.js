import { CleanUp, html } from "ui";

/**
 * HTML: `settings-week-start`
 */
export class SettingsWeekStart extends HTMLElement {
    static register = () => {
        customElements.define("settings-week-start", SettingsWeekStart);
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
            <ui-label ripple>
                <input slot="input" type="checkbox" />
            </ui-label>
        `;

        /** @type {import("ui").UILabel} */
        this.label = this.querySelector("ui-label");

        /** @type {HTMLInputElement} */
        const input = this.label.ui.inputSlot[0];
        input.onclick = async () => {
            this.uiStore.ui.set("week-start", input.checked ? 1 : 0);
        };
    }

    connectedCallback() {
        this.cleanup.add(
            this.uiStore.ui.on(
                "week-start",
                this.storeHandlerWeekStart.bind(this),
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
     * @param {SchedulerStore_WeekStart} weekStart
     */
    async storeHandlerWeekStart(weekStart) {
        this.label.ui.inputSlot[0].checked = weekStart === 1;
    }

    /** @private */
    async storeHandlerLang() {
        this.label.ui.primary = this.uiLang.ui.get(
            "settings",
            "label-primary-week-start",
        );
    }
}
