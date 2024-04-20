import { constants } from "../../lib";
import { App } from "../../app";
import * as utils from "./utils";

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
`;

export class StackLayoutPage extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        /** @type {import("../../app").App | null} */
        this.app = null;
    }

    connectedCallback() {
        if (constants.debug)
            console.log(`[StackLayoutPage] connectedCallback: title=${this.getAttribute("title")}`);

        // @ts-ignore
        if (this.parentElement.app instanceof App) {
            // @ts-ignore
            this.app = this.parentElement.app;
            this.app.title.innerHTML = utils.getTitleElement(this.getAttribute("title"))
        }
    }

    disconnectedCallback() {
        if (constants.debug)
            console.log(`[StackLayoutPage] disconnectedCallback: title=${this.getAttribute("title")}`);
    }
}
