const t = document.createElement("template")

// TODO: styles: border, positioning (name, short-name)
t.innerHTML = `
<style>
    :host {
        display: inline-block;
        overflow: hidden;
        width: 100%;
        min-height: calc(1.6rem * 2 + var(--spacing) * 2);
        padding: var(--spacing);
        border: var(--border-width) var(--border-style) hsl(var(--border));
        border-radius: var(--radius);
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
        this.#shortName = this.shadowRoot.querySelector(".short-name")
    }

    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case "color":
                this.#shortName.style.color = newValue || "transparent"
                break
        }
    }
}
