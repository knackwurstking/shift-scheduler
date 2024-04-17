import { constants } from "../../lib";
import { App } from "../../app";

const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            animation: fade-in 0.5s;
            transition: opacity 0.5s ease;
        }

        :host(:last-child) {
            opacity: 1;
        }

        @keyframes fade-in {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
    </style>

    <slot></slot>
`;

export class StackLayoutPage extends HTMLElement {
    constructor() {
        super();

        /** @type {import("../../app").App | null} */
        this.app = null;
    }

    connectedCallback() {
        if (constants.debug) console.log(`[StackLayoutPage] connectedCallback`);

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // @ts-ignore
        if (this.parentElement.app instanceof App) {
            this.app = this.parentElement.app;
        }
    }

    disconnectedCallback() {
        if (constants.debug)
            console.log(`[StackLayoutPage] disconnectedCallback`);
    }
}
