const innerHTML = `
<ui-label>
    <ui-primary slot="primary"></ui-primary>

    <ui-button color="primary" variant="full"></ui-button>
</ui-label>
`;

export class EditRhythm extends HTMLElement {
    /** @type {import("ui/src/wc").Store} */
    #store;
    /** @type {import("ui/src/wc").Lang} */
    #lang;
    /** @type {import("ui/src/wc").Primary} */
    #primary;
    /** @type {import("ui/src/wc").Button} */
    #button

    static register = () => customElements.define("settings-edit-rhythm", EditRhythm)

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

        this.#primary = this.querySelector("ui-primary");
        this.#button = this.querySelector("ui-button")

        this.#button.onclick = () => {
            // TODO: open a (fullscreen) dialog page (add callback function for handling data on submit)
        }
    }

    connectedCallback() {
        setTimeout(() => {
            this.cleanup.push(
                this.#store.data.on("lang", async () => {
                    this.#primary.innerHTML = this.#lang.data.get("settings", "shiftsEditRhythmPrimary");
                    this.#button.innerHTML = this.#lang.data.get("settings", "shiftsEditRhythmButton")
                }, true),
            );
        });
    }

    disconnectedCallback() {
        this.cleanup.forEach((fn) => fn());
        this.cleanup = [];
    }
}
