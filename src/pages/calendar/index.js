import { StackLayoutPage } from "../../components";
import { constants } from "../../lib";
import SwipeHandler from "./swipe-handler";
import * as utils from "./utils";

const template = document.createElement("template");

const templateDayItem = `
<ui-flex-grid-item class="day-item ui-card" style="position: relative;">
    <div class="day-item-date"></div>
    <div class="day-item-shift"></div>
</ui-flex-grid-item>
`;

const templateDaysRow = `
<ui-flex-grid-row class="days-row" gap="0.1rem">
    ${templateDayItem}
    ${templateDayItem}
    ${templateDayItem}
    ${templateDayItem}
    ${templateDayItem}
    ${templateDayItem}
    ${templateDayItem}
</ui-flex-grid-row>
`;

const templateWeekDaysRow = `
<ui-flex-grid-row class="week-days-row" gap="0.1rem">
    <ui-flex-grid-item class="week-day-item ui-card"></ui-flex-grid-item>
    <ui-flex-grid-item class="week-day-item ui-card"></ui-flex-grid-item>
    <ui-flex-grid-item class="week-day-item ui-card"></ui-flex-grid-item>
    <ui-flex-grid-item class="week-day-item ui-card"></ui-flex-grid-item>
    <ui-flex-grid-item class="week-day-item ui-card"></ui-flex-grid-item>
    <ui-flex-grid-item class="week-day-item ui-card"></ui-flex-grid-item>
    <ui-flex-grid-item class="week-day-item ui-card"></ui-flex-grid-item>
</ui-flex-grid-row>
`

const templateItemContent = `
<div class="item-content ui-grid">
    ${templateWeekDaysRow}

    ${templateDaysRow}
    ${templateDaysRow}
    ${templateDaysRow}
    ${templateDaysRow}
    ${templateDaysRow}
    ${templateDaysRow}
</div>
`;

template.innerHTML = `
<style>
    :host {
        --header-height: 2.5em;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        user-select: none;
        overflow: hidden;
        touch-action: none;
    }

    :host .item {
        position: absolute;
        top: 0;
        min-width: 100%;
        height: 100%;
    }

    :host .item1 ui-flex-grid-item {
        background: yellow;
    }

    :host .item2 ui-flex-grid-item {
        background: green;
    }

    :host .item3 ui-flex-grid-item {
        background: blue;
    }

    :host .item .item-content {
        --gap: 0.1rem;
        width: 100%;
        height: 100%;
    }

    :host .item .item-content .week-days-row {
        height: var(--header-height);
    }

    :host .item .item-content .week-days-row > .week-day-item {
        width: calc(100% / 7);
        overflow: hidden;
        height: 100%;
        font-family: var(--font-family-heading);
        font-size: 1.15em;
        font-weight: normal;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    :host .item .item-content .week-days-row .week-day-item.is-saturday,
    :host .item .item-content .week-days-row .week-day-item.is-sunday {
        /* TODO: Some special highlighting */
        font-weight: bolder;
    }

    :host .item .item-content .week-days-row .week-day-item.is-saturday {
        /* TODO: Some special highlighting */
        background: violet;
    }

    :host .item .item-content .week-days-row .week-day-item.is-sunday {
        /* TODO: Some special highlighting */
        background: violet;
    }

    :host .item .item-content .days-row {
        height: calc((100% - var(--header-height)) / 6 - var(--gap));
    }

    :host .item .item-content .days-row .day-item {
        width: calc(100% / 7);
        height: 100%;
        overflow: hidden;
    }

    :host .item .item-content .days-row .day-item.is-inactive {
        opacity: 0.2;
    }

    :host .item .item-content .days-row .day-item.is-today {
        /* TODO: Add some highlighting here... */
        background: orange;
    }

    :host .item .item-content .days-row .day-item.is-saturday {
        /* TODO: Some special highlighting */
        background: violet;
    }

    :host .item .item-content .days-row  .day-item.is-sunday {
        /* TODO: Some special highlighting */
        background: violet;
    }

    :host .item .item-content .days-row .day-item.has-note .day-item-date {
        /* TODO: Add some highlighting here... */
        background: red; /* NOTE: Just a placeholder */
    }

    :host .item .item-content .days-row .day-item .day-item-date {
        position: absolute;
        top: 0;
        left: 0;
        padding: 0.5vmin;
        /*font-size: 3vmin;*/
        font-size: clamp(0em, 3vmin, 1em);
        font-weight: normal;
        border-radius: inherit;
    }

    :host .item .item-content .days-row .day-item .day-item-shift {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        /*font-size: 4vmin;*/
        font-size: clamp(0em, 4vmin, 1.5em);
        font-weight: bold;
        color: var(--shift-color, var(--color-fg));
        text-shadow: 0.1em 0.1em 0.1em hsla(var(--shift-color, var(--card-fg)), 0.2);
        border-radius: inherit;
    }

    @media (orientation: landscape) {
        :host .item .item-content .days-row .day-item .day-item-shift {
            left: 4vmin;
        }
    }

    @media (orientation: portrait) {
        :host .item .item-content .days-row .day-item .day-item-shift {
            top: 5vmin;
        }
    }
</style>

<div class="item item1" style="left: -100%;">
    ${templateItemContent}
</div>

<div class="item item2" style="left: 0;">
    ${templateItemContent}
</div>

<div class="item item3" style="left: 100%;">
    ${templateItemContent}
</div>
`;

export class CalendarPage extends StackLayoutPage {
    constructor() {
        super();

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.swipeHandler = new SwipeHandler(this);
        /** @type {Date} */
        this.today;
        /** @type {number[]} */
        this.order;

        /** @param {Date} date */
        this.ondatepickerchange = async (date) => {
            // Performance testing - start
            const start = new Date().getMilliseconds();

            date.setMonth(date.getMonth() - 1);
            this.today = new Date();

            for (let i = 0; i < 3; i++, date.setMonth(date.getMonth() + 1)) {
                this.updateItem(new Date(date), this.getItems()[i]);
            }

            // Performance testing - end
            if (constants.debug)
                console.log(
                    `[Calendar] updating all the (day) items took ${new Date().getMilliseconds() - start}ms`,
                );
        };

        /** @param {import("../../lib/storage").StorageDataWeekStart | null} weekStart */
        this.onweekstart = (weekStart) => {
            if (weekStart !== 0 && weekStart !== 1) {
                weekStart = constants.weekStart;
            }

            this.updateWeekDays(weekStart);

            // Crete days, note, shifts, ... if the week-start changes
            this.app.dispatchWithData(
                "datepickerchange",
                this.app.getMonth(),
            );
        };

        /** @param {"left" | "right"} direction */
        this.onswipe = (direction) => {
            switch (direction) {
                case "left":
                    this.app.goNextMonth();
                    break;
                case "right":
                    this.app.goPrevMonth();
                    break;
            }
        };

        /** @param {import("../../lib/storage").StorageDataLang} _lang */
        this.onlang = (_lang) => {
            // This will update the week days
            this.updateWeekDays(this.app.storage.get("week-start", constants.weekStart));
        };
    }

    connectedCallback() {
        super.connectedCallback();

        this.app.addListener(
            "datepickerchange",
            this.ondatepickerchange,
        );

        this.app.storage.addListener("week-start", this.onweekstart);
        this.app.storage.addListener("lang", this.onlang);

        this.swipeHandler.addListener("swipe", this.onswipe);
        this.swipeHandler.start();

        this.app.storage.dispatch("week-start");
    }

    disconnectedCallback() {
        super.connectedCallback();

        this.app.removeListener(
            "datepickerchange",
            this.ondatepickerchange,
        );

        this.app.storage.removeListener("week-start", this.onweekstart);
        this.app.storage.removeListener("lang", this.onlang);

        this.swipeHandler.removeListener("swipe", this.onswipe);
        this.swipeHandler.stop();
    }

    getItems() {
        return [...this.shadowRoot.children].filter((c) =>
            c.classList.contains("item"),
        );
    }

    /**
     * @param {import("../../lib/storage").StorageDataWeekStart} weekStart
     */
    updateWeekDays(weekStart) {
        if (weekStart === null) {
            console.error(`weekStart has to be a "0" or a "1"!`);
            return;
        }

        this.order = [0, 1, 2, 3, 4, 5, 6];

        if (weekStart > 0) {
            this.order = [...this.order.slice(weekStart), ...this.order.slice(0, weekStart)];
        }

        const items = this.shadowRoot.querySelectorAll(
            ".week-days-row .week-day-item",
        )

        this.#markWeekendItems(...items)
        items.forEach((item, i) => {
            item.innerHTML = `${this.app.language.get("calendar", this.order[i % 7].toString())}`
        });
    }

    /**
     *  @param {Date} date
     *  @param {Element} calendarItem
     */
    async updateItem(date, calendarItem) {
        const promise = utils.getMonthArray(
            date,
            this.app.storage.get("week-start", constants.weekStart),
        );

        const cards = calendarItem.querySelectorAll(
            ".days-row > .day-item",
        );

        const data = await utils.fillWithData(this.app.db, date, await promise);

        for (let i = 0; i < data.length; i++) {
            if (this.isNope(data[i].date, date)) cards[i].classList.add("is-inactive");
            else cards[i].classList.remove("is-inactive");

            if (this.isToday(data[i].date)) cards[i].classList.add("is-today");
            else cards[i].classList.remove("is-today");

            if (!!data[i].note) cards[i].classList.add("has-note");
            else cards[i].classList.remove("has-note");

            cards[i].querySelector(".day-item-date").innerHTML =
                `${data[i].date.getDate()}`;

            cards[i].querySelector(".day-item-shift").innerHTML =
                !!data[i].shift?.visible ? data[i].shift?.shortName || "" : "";
        }

        this.#markWeekendItems(...cards)
    }

    /**
     * @param {Date} date
     */
    isToday(date) {
        return (
            this.today.getFullYear() === date.getFullYear() &&
            this.today.getMonth() === date.getMonth() &&
            this.today.getDate() === date.getDate()
        );
    }

    /**
     * @param {Date} d1
     * @param {Date} d2
     */
    isNope(d1, d2) {
        return (
            d1.getFullYear() !== d2.getFullYear() ||
            d1.getMonth() !== d2.getMonth()
        );
    }

    /**
     * @param {Element[]} children
     */
    async #markWeekendItems(...children) {
        const satIndex = this.order.findIndex(o => o === 6)
        const sunIndex = this.order.findIndex(o => o === 0)
        children.forEach((c, i) => {
            c.classList.remove("is-saturday");
            c.classList.remove("is-sunday");

            if ((i % this.order.length) === satIndex) {
                c.classList.add("is-saturday")
            }

            if ((i % this.order.length) === sunIndex) {
                c.classList.add("is-sunday")
            }
        });
    }
}
