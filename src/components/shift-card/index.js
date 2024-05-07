import ui from "ui";
import { html } from "../../utils";

const innerHTML = html`
<style>
    :host {
        position: relative;
        display: inline-block;
        overflow: hidden;
        width: 100%;
        min-height: calc(1.6rem * 2 + var(--ui-spacing) * 2);
        cursor: pointer;
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

<slot></slot>
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
        this.shadowRoot.innerHTML = innerHTML
        this.classList.add("is-card")
        this.#shortName = this.shadowRoot.querySelector(".short-name")
        ui.js.ripple.create(this)
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
