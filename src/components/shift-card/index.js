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
        user-select: none;
    }

    span {
        display: block;
    }

    .name,
    .short-name {
        text-wrap: nowrap;
    }

    .active-background {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transition:
            opacity .25s linear,
            background-color .25s linear;
    }
</style>

<div class="active-background"></div>

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
    /** @type {HTMLElement} */
    #rippleBackground

    static register = () => customElements.define("shift-card", ShiftCard)
    static observedAttributes = ["color", "visible", "active"]

    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = innerHTML;

        this.classList.add("is-card");

        this.#shortName = this.shadowRoot.querySelector(".short-name");
        this.#rippleBackground = this.shadowRoot.querySelector(".active-background");

        ui.js.ripple.create(this, { useClick: true });
    }

    /**
     * @param {string} name
     * @param {string | null} _oldValue
     * @param {string | null} newValue
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case "color":
                if (this.hasAttribute("visible")) {
                    this.#shortName.style.color = newValue || "inherit";
                } else {
                    this.#shortName.style.color = "transparent";
                }
                break;
            case "visible":
                this.#shortName.style.color = newValue === null ? "transparent" : (this.getAttribute("color") || "inherit");
                break;
            case "active":
                if (newValue === null) {
                    this.#rippleBackground.style.opacity = "0";
                } else {
                    this.#rippleBackground.style.backgroundColor = `${ui.js.ripple.defaultOptions.color}`;
                    this.#rippleBackground.style.opacity = `${ui.js.ripple.defaultOptions.opacity}`;
                }
                break;
        }
    }
}
