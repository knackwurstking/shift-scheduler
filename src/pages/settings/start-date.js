const innerHTML = `
<ui-label>
    <ui-primary slot="primary"></ui-primary>

    <input slot="input" type="date" />
</ui-label>
`;

/** NOTE: This element need to be appended to "#shiftsStartDateSection" */
export class StartDate extends HTMLElement {
    /** @type {import("ui/src/wc").Store} */
    #store;
    /** @type {import("ui/src/wc").Lang} */
    #lang;
    /** @type {HTMLInputElement} */
    #input;
    /** @type {HTMLElement} */
    #primary;

    static register = () => customElements.define("settings-start-date", StartDate)

    /**
     * @param {import("ui/src/wc").Store} store
     * @param {import("ui/src/wc").Lang} lang
     */
    constructor(store, lang) {
        super();
        this.innerHTML = innerHTML;

        /** @type {(() => void)[]} */
        this.cleanup = [];

        this.#store = store;
        this.#lang = lang;

        this.#input = this.querySelector("input");
        this.#primary = this.querySelector("ui-primary");

        this.#input.oninput = ({ currentTarget }) => {
            this.#store.data.update(
                "settings",
                (/**@type{import("../../types").SettingsStore}*/ settings) => {
                    // NOTE: value format: "YYYY-MM-DD"
                    // @ts-expect-error
                    settings.startDate = currentTarget.value;
                    return settings;
                },
            );
        };
    }

    connectedCallback() {
        setTimeout(() => {
            this.cleanup.push(
                this.#store.data.on(
                    "lang",
                    () => {
                        this.#primary.innerHTML = this.#lang.data.get(
                            "settings",
                            "shiftsStartDatePrimary",
                        );
                    },
                    true,
                ),
                this.#store.data.on(
                    "settings",
                    (settings) => {
                        if (settings.startDate === this.#input.value) return;
                        this.#input.value = settings.startDate;
                    },
                    true,
                ),
            );
        });
    }

    diconnectedCallback() {
        this.cleanup.forEach((fn) => fn());
        this.cleanup = [];
    }
}
