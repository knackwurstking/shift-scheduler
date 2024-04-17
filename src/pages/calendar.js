import ui from "ui";
import { StackLayoutPage } from "../components";
import { constants } from "../lib";

const template = document.createElement("template");
template.innerHTML = `
<style>
    :host {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        user-select: none;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
    }

    * {
        border: 1px solid red;
    }

    :host .item {
        min-width: 100%;
        height: 100%;
        scroll-snap-align: center;
        scroll-snap-stop: always;
    }

    :host .item1 {
        background: yellow;
    }

    :host .item2 {
        background: green;
    }

    :host .item3 {
        background: blue;
    }
</style>

<div class="item item1">
    item 1
</div>

<div class="item item2">
    item 2
</div>

<div class="item item3">
    item 3
</div>
`;

export class CalendarPage extends StackLayoutPage {
    constructor() {
        super();

        this.scrollStart = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.scrollLeft = this.clientWidth;

        this.onscroll = () => {
            if (this.scrollStart === null) {
                this.scrollStart = this.scrollLeft;
            }
        };

        this.onscrollend = () => {
            // TODO: refactor, to much calculation going on here
            if (
                Math.abs(this.scrollStart - this.scrollLeft) <
                this.clientWidth / 2
            ) {
                return;
            }

            if (this.scrollStart - this.scrollLeft > 0) {
                // right scroll
                const items = this.getItems();
                this.shadowRoot.insertBefore(
                    this.shadowRoot.removeChild(items[2]),
                    items[0],
                );
            } else if (this.scrollStart - this.scrollLeft < 0) {
                // left scroll
                const items = this.getItems();
                this.shadowRoot.appendChild(
                    this.shadowRoot.removeChild(items[0]),
                );
            }

            // TODO: move children and reset scrollStart (maybe need an timeout, or find another way)
            this.scrollStart = null;
        };
    }

    disconnectedCallback() {
        super.connectedCallback();
    }

    getItems() {
        return [...this.shadowRoot.children].filter((c) =>
            c.classList.contains("item"),
        );
    }
}

/**
 * @param {Date} month
 * @param {import("../lib/storage").StorageDataWeekStart} weekStart
 * @returns {Promise<import("../lib/db").DBMonth>}
 */
async function getMonthArray(month, weekStart) {
    /** @type {import("../lib/db").DBMonth} */
    const data = [];

    for (let i = 0; i < 42; i++) {
        data.push({
            date: new Date(
                month.getFullYear(),
                month.getMonth(),
                i + 1 - _getStartDay(month, weekStart),
            ),
            shift: null, // TODO: Calc the current shift (rhythm)
            note: "",
        });
    }

    return data;
}

/**
 * @param {import("../lib/db").default | null} db
 * @param {Date} month
 * @param {import("../lib/db").DBMonth} days
 * @returns {Promise<import("../lib/db").DBMonth>}
 */
async function fillWithData(db, month, days) {
    // TODO: Fill days array with data from the database
    // ...

    return days;
}

/**
 * @param {Date} month
 * @param {import("../lib/storage").StorageDataWeekStart} weekStart
 * @returns {number}
 */
function _getStartDay(month, weekStart) {
    // NOTE: if month starts on sunday (0), but the week start is set to monday (1), than set it to 6 (sunday becomes 6)
    month.setDate(1); // 0-6 Sun-Sat
    const d = month.getDay();
    if (weekStart === 0) return d;
    else if (weekStart === 1) return d === 0 ? 6 : d - 1; // NOTE: This works as long the weekStart is a 0 or a 1
}
