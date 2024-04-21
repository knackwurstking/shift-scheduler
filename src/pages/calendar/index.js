import { constants } from "../../lib";
import SwipeHandler from "./swipe-handler";
import * as utils from "./utils";
import ui from "ui"
import { eventDatePickerChange } from "../../app"

const template = document.createElement("template");

const templateDayItem = `
<ui-flex-grid-item class="day-item" style="position: relative;">
    <div class="day-item-date"></div>
    <div class="day-item-shift"></div>
</ui-flex-grid-item>
`;

const templateDaysRow = `
<ui-flex-grid-row class="days-row">
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
<ui-flex-grid-row class="week-days-row">
    <ui-flex-grid-item class="week-day-item"></ui-flex-grid-item>
    <ui-flex-grid-item class="week-day-item"></ui-flex-grid-item>
    <ui-flex-grid-item class="week-day-item"></ui-flex-grid-item>
    <ui-flex-grid-item class="week-day-item"></ui-flex-grid-item>
    <ui-flex-grid-item class="week-day-item"></ui-flex-grid-item>
    <ui-flex-grid-item class="week-day-item"></ui-flex-grid-item>
    <ui-flex-grid-item class="week-day-item"></ui-flex-grid-item>
</ui-flex-grid-row>
`

const templateItemContent = `
<ui-flex-grid>
    ${templateWeekDaysRow}

    ${templateDaysRow}
    ${templateDaysRow}
    ${templateDaysRow}
    ${templateDaysRow}
    ${templateDaysRow}
    ${templateDaysRow}
</ui-flex-grid>
`;

template.innerHTML = `
<style>
    :host {
        --header-height: 2.5em;
        display: flex;
        position: relative;
        flex-direction: row;
        flex-wrap: nowrap;
        user-select: none;
        overflow: hidden;
    }

    .item {
        position: absolute;
        top: var(--app-bar-height);
        bottom: 0;
        min-width: 100%;
    }

    :host .item ui-flex-grid {
        --gap: .1em;
        width: calc(100% - 0.25rem);
        height: calc(100% - 0.25rem);
    }

    .week-days-row {
        --row-gap: .1em;
        height: var(--header-height);
        padding: var(--border-width) 0;
    }

    .days-row {
        --row-gap: .1em;
        height: 100%;
        padding: var(--border-width) 0;
    }

    ui-flex-grid-item {
        border-radius: var(--radius);
        border: var(--border-width) var(--border-style) hsl(var(--border));

        /*
        border-radius: 0;
        border: var(--border-width) var(--border-style) hsl(var(--border));
        */
    }

    :host([no-border]) ui-flex-grid-item {
        border: none;
    }

    .week-day-item {
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

    .week-day-item.is-saturday,
    .week-day-item.is-sunday {
        /* TODO: Some special highlighting */
        font-weight: bolder;
    }

    .day-item {
        height: 100%;
        overflow: hidden;
    }

    .day-item.is-inactive {
        opacity: 0.2;
    }

    .day-item .day-item-date {
        position: absolute;
        top: 0;
        left: 0;
        padding: 0.5vmin;
        /*font-size: 3vmin;*/
        font-size: clamp(0em, 3vmin, 1em);
        font-weight: normal;
        border-radius: inherit;
    }

    .day-item-shift {
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
        .day-item .day-item-shift {
            left: 4vmin;
        }
    }

    @media (orientation: portrait) {
        .day-item .day-item-shift {
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

export class CalendarPage extends ui.wc.StackLayoutPage {
    /** @type {import("../../app").App | null} */
    #app = null;
    #initialized = false;

    /** @param {Date} date */
    #onDatePickerChange = async (date) => {
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
    #onWeekStart = async (weekStart) => {
        if (weekStart !== 0 && weekStart !== 1) {
            weekStart = constants.weekStart;
        }

        this.updateWeekDays(weekStart);

        // Crete days, note, shifts, ... if the week-start changes
        this.app.dispatchWithData(
            eventDatePickerChange,
            this.app.getMonth(),
        );
    };

    /** @param {"left" | "right"} direction */
    #onSwipe = async (direction) => {
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
    #onLang = async (_lang) => {
        // This will update the week days
        this.updateWeekDays(this.app.storage.get("week-start", constants.weekStart));
    };

    constructor() {
        super();
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.swipeHandler = new SwipeHandler(this);
        /** @type {Date} */
        this.today;
        /** @type {number[]} */
        this.order;
    }

    get app() {
        return this.#app
    }

    set app(app) {
        this.#app = app

        if (super.isConnected && !this.#initialized) {
            this.#initialized = true

            this.app.addListener(
                eventDatePickerChange,
                this.#onDatePickerChange,
            );

            this.app.storage.addListener("week-start", this.#onWeekStart);
            this.app.storage.addListener("lang", this.#onLang);

            this.app.storage.dispatch("week-start");
        }
    }

    connectedCallback() {
        super.connectedCallback();

        this.swipeHandler.addListener("swipe", this.#onSwipe);
        this.swipeHandler.start();

        if (!!this.app) {
            this.app = this.app
        }
    }

    disconnectedCallback() {
        super.connectedCallback();
        this.#initialized = false;

        this.swipeHandler.removeListener("swipe", this.#onSwipe);
        this.swipeHandler.stop();

        if (!!this.app) {
            this.app.removeListener(
                eventDatePickerChange,
                this.#onDatePickerChange,
            );

            this.app.storage.removeListener("week-start", this.#onWeekStart);
            this.app.storage.removeListener("lang", this.#onLang);
        }
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
