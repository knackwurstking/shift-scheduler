import { constants } from "../../lib";
import { StackLayoutPage } from "./stack-layout-page";

const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            display: block;
            position: relative;
            width: 100%;
            height: 100%;
        }
    </style>

    <slot></slot>
`;

export class StackLayout extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        /** @type {import("../../app").App | null} */
        this.app = null;

        /**
         * @type {{ [key: string]: import("./stack-layout-page").StackLayoutPage }}
         */
        this.pages = {
            calendar: document
                .querySelector("template#pageCalendar")
                // @ts-ignore
                .content.cloneNode(true),
            settings: document
                .querySelector("template#pageSettings")
                // @ts-ignore
                .content.cloneNode(true),
            pdf: document
                .querySelector("template#pagePDF")
                // @ts-ignore
                .content.cloneNode(true),
        };

        /**
         * All rendered pages
         *
         * @type {import("./stack-layout-page").StackLayoutPage[]}
         */
        this.stack = [];
    }

    connectedCallback() {
        if (constants.debug)
            console.log(`[StackLayout] connectedCallback: this.children=${this.children} (${this.children.length})`);

        // @ts-ignore
        this.stack = [...this.children].filter(
            (page) => page instanceof StackLayoutPage,
        );
    }

    disconnectedCallback() {
        if (constants.debug)
            console.log(`[StackLayout] disconnectedCallback: this.children=${this.children} (${this.children.length})`);
    }

    goBack() {
        if (!this.stack.length) return;
        this.removeChild(this.stack.pop());
    }

    /**
     * @param {import("./stack-layout-page").StackLayoutPage} page
     */
    setPage(page) {
        this.stack.push(page);
        this.appendChild(page);
    }
}
