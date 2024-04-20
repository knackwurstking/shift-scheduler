import { constants } from "../../lib";
import { StackLayoutPage } from "./stack-layout-page";
import * as utils from "./utils";

/**
 * @typedef Pages
 * @type {{
 *  calendar: () => import("../../pages/calendar").CalendarPage;
 *  settings: () => import(".").StackLayoutPage;
 *  pdf: () => import(".").StackLayoutPage;
 * }}
 */

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
    /**
     * @type {Pages}
     */
    #pages = {
        calendar: () => document.querySelector("template#pageCalendar")
            // @ts-ignore
            .content.cloneNode(true),

        settings: () => document.querySelector("template#pageSettings")
            // @ts-ignore
            .content.cloneNode(true),

        pdf: () => document.querySelector("template#pagePDF")
            // @ts-ignore
            .content.cloneNode(true),
    };

    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        /** @type {import("../../app").App | null} */
        this.app = null;

        /**
         * All rendered pages
         *
         * @type {{ element: Element, name: ("calendar" | "pdf" | "settings") }[]}
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

        this.app.handlePage(this.stack[this.stack.length - 1]?.name || "")
    }

    disconnectedCallback() {
        if (constants.debug)
            console.log(`[StackLayout] disconnectedCallback: this.children=${this.children} (${this.children.length})`);
    }

    goBack() {
        if (!this.stack.length) return;
        const page = this.stack.pop()
        this.removeChild(page.element)

        this.app.title.innerHTML = utils.getTitleElement(this.children[this.children.length - 1]?.getAttribute("title") || "");
        this.app.handlePage(this.stack[this.stack.length - 1]?.name || "")
    }

    /**
     * @param {"calendar" | "pdf" | "settings"} name
     */
    setPage(name) {
        this.stack.push({
            name: name,
            element: this.appendChild(this.#pages[name]().children[0]),
        });

        this.app.handlePage(name)
    }
}
