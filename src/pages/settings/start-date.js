const t = document.createElement("template")
t.innerHTML = `
<ui-label ripple>
    <ui-primary slot="primary"></ui-primary>

    <input slot="input" type="date" />
</ui-label>
`

/** NOTE: This element need to be appended to "#shiftsStartDateSection" */
export class StartDate extends HTMLElement {
    /** @type {import("ui/src/wc").Store} */
    #store
    /** @type {import("ui/src/wc").Lang} */
    #lang

    /**
     * @param {import("ui/src/wc").Store} store
     * @param {import("ui/src/wc").Lang} lang
     */
    constructor(store, lang) {
        customElements.define("settings-start-date", StartDate);
        super()
        this.attachShadow({ mode: "open" })
        this.shadowRoot.appendChild(t.content.cloneNode(true))
        this.#store = store
        this.#lang = lang
        this.cleanup = []
    }

    get primary() {
        return this.shadowRoot.querySelector("ui-primary").innerHTML
    }

    set primary(text) {
        this.shadowRoot.querySelector("ui-primary").innerHTML = text
    }

    connectedCallback() {
        setTimeout(() => {
            this.cleanup.push(
                this.#store.data.on("lang", () => {
                    this.primary = this.#lang.data.get("settings", "shiftsStartDatePrimary");
                }, true),
            );
        });
    }

    diconnectedCallback() {
        this.cleanup.forEach(fn => fn())
    }

}
