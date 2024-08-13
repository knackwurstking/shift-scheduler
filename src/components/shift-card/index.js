import { CleanUp } from "ui";
import { html, ripple } from "ui";

/**
 * HTML: `shift-card`
 *
 * Attributes:
 *  - color: string
 *  - visible
 *  - active
 *
 * Slots:
 *  - name
 *  - short-name
 *  - *
 */
export class ShiftCard extends HTMLElement {
  static register = () => {
    customElements.define("shift-card", ShiftCard);
  };

  static observedAttributes = ["color", "visible", "active"];

  constructor() {
    super();

    /** @private */
    this.shadowCleanUp = new CleanUp();

    /**
     * @private
     * @type {HTMLElement}
     */
    this.shortName;

    /**
     * @private
     * @type {HTMLElement}
     */
    this.background;

    this.shadowRender();
  }

  shadowRender() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = html`
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

        .background {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transition:
            opacity 0.25s linear,
            background-color 0.25s linear;
        }
      </style>

      <div class="background"></div>

      <span class="name">
        <slot name="name"></slot>
      </span>

      <span class="short-name">
        <slot name="short-name"></slot>
      </span>

      <slot></slot>
    `;

    this.classList.add("is-card");

    this.shortName = this.shadowRoot.querySelector(".short-name");
    this.background = this.shadowRoot.querySelector(".background");
  }

  connectedCallback() {
    this.shadowCleanUp.add(ripple.create(this, { useClick: true }).destroy);
  }

  disconnectedCallback() {
    this.shadowCleanUp.run();
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
          this.shortName.style.color = newValue || "inherit";
        } else {
          this.shortName.style.color = "transparent";
        }
        break;

      case "visible":
        this.shortName.style.color =
          newValue === null
            ? "transparent"
            : this.getAttribute("color") || "inherit";
        break;

      case "active":
        if (newValue === null) {
          this.background.style.opacity = "0";
        } else {
          this.background.style.backgroundColor = `${ripple.defaultOptions.color}`;
          this.background.style.opacity = `${ripple.defaultOptions.opacity}`;
        }
        break;
    }
  }
}
