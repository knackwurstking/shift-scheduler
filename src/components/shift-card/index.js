const t = document.createElement("template")

t.innerHTML = `
<style>
    :host {
        display: inline-block;
        overflow: hidden;
        width: 100%;
        min-height: calc(1.6rem * 2 + var(--ui-spacing) * 2);
    }

    span {
        display: block;
    }

    .name {
    }

    .short-name {
    }
</style>

<span class="name">
    <slot name="name"></slot>
</span>

<span class="short-name">
    <slot name="short-name"></slot>
</span>
`

/**
 * Special slots:
 *  - name: should be a span element
 *  - short-name: should be a span element
 */
export class ShiftCard extends HTMLElement {
    /** @type {HTMLElement} */
    #shortName

    static register = () => customElements.define("shift-card", ShiftCard)
    static observedAttributes = ["color"]

    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.shadowRoot.appendChild(t.content.cloneNode(true))
        this.classList.add("is-card")
        this.#shortName = this.shadowRoot.querySelector(".short-name")
    }

    /**
     * @param {string} name
     * @param {string | null} _oldValue
     * @param {string | null} newValue
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case "color":
                this.#shortName.style.color = newValue || "transparent"
                break
        }
    }
}
