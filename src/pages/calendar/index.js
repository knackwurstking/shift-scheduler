import ui from "ui";
import { db } from "../../lib";
import SwipeHandler from "./swipe-handler";
import * as utils from "./utils";

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
`;

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
    /** @type {import("ui/src/wc").Store} */
    #store
    /** @type {import("ui/src/wc").Lang} */
    #lang

    constructor() {
        super();
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        /** @type {(() => void)[]} */
        this.cleanup = [];

        this.#store = document.querySelector("ui-store");
        this.#lang = document.querySelector("ui-lang");

        /** @type {Date} */
        this.today;
        /** @type {number[]} */
        this.order;

        this.swipeHandler = new SwipeHandler(this);
    }


    connectedCallback() {
        // TODO: remove this after testing, need to know how the stack layout will call the (dis-)connected callback(s)
        console.log("[calendar] connected callback running...");

        this.cleanup.push(
            // The "swipe" event will update the date-picker store, base on the swiped direction
            this.swipeHandler.addListener(
                "swipe",
                this.handleSwipeEvent.bind(this),
            ),
            // Handle the "date-picker" state change, update calendar items
            this.#store.data.on(
                "date-picker",
                this.handleDatePickerChangeEvent.bind(this),
            ),
            // Handle a "week-start" change event
            this.#store.data.on("week-start", this.#onWeekStart.bind(this)),
            // Handle a "lang" change event
            this.#store.data.on("lang", this.#onLang.bind(this)),
        );

        this.swipeHandler.start();
    }

    disconnectedCallback() {
        // TODO: remove this after testing, need to know how the stack layout will call the (dis-)connected callback(s)
        console.log("[calendar] disconnected callback running...");

        this.swipeHandler.stop();
        this.cleanup.forEach((fn) => fn());
    }

    getItems() {
        return [...this.shadowRoot.children].filter((c) =>
            c.classList.contains("item"),
        );
    }

    /**
     *  @param {Date} date
     *  @param {Element} calendarItem
     */
    async updateItem(date, calendarItem) {
        const promise = utils.getMonthArray(date, this.#store.data.get("week-start"));
        const cards = calendarItem.querySelectorAll(".days-row > .day-item");
        const data = await utils.fillWithData(db, date, await promise);

        for (let i = 0; i < data.length; i++) {
            if (this.isNope(data[i].date, date))
                cards[i].classList.add("is-inactive");
            else cards[i].classList.remove("is-inactive");

            if (this.isToday(data[i].date)) cards[i].classList.add("is-today");
            else cards[i].classList.remove("is-today");

            if (!!data[i].note) cards[i].classList.add("has-note");
            else cards[i].classList.remove("has-note");

            cards[i].querySelector(".day-item-date").innerHTML =
                `${data[i].date.getDate()}`;

            cards[i].querySelector(".day-item-shift").innerHTML = !!data[i]
                .shift?.visible
                ? data[i].shift?.shortName || ""
                : "";
        }

        this.#markWeekendItems(...cards);
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
     * @param {import("./swipe-handler").Direction} direction
     */
    async handleSwipeEvent(direction) {
        console.log(`[calendar] handle swipe event: direction=${direction}`)

        switch (direction) {
            case "left":
                // Go to next month
                this.#store.data.update(
                    "date-picker",
                    (/**@type{Date}*/ date) => {
                        date.setMonth(date.getMonth() + 1);
                        return date;
                        // TODO: Need to catch this in the app, and update the date-picker
                    },
                );
                break;
            case "right":
                // Go to prev month
                this.#store.data.update(
                    "date-picker",
                    (/**@type{Date}*/ date) => {
                        date.setMonth(date.getMonth() - 1);
                        return date;
                        // TODO: Need to catch this in the app, and update the date-picker
                    },
                );
                break;
        }
    }

    /** @param {import("../../types").DatePickerStore} date */
    async handleDatePickerChangeEvent(date) {
        console.log(`[calendar] date-picker change event: update calendar items`)

        // Performance testing - start
        const start = new Date().getMilliseconds();

        date.setMonth(date.getMonth() - 1);
        this.today = new Date();

        for (let i = 0; i < 3; i++, date.setMonth(date.getMonth() + 1)) {
            this.updateItem(new Date(date), this.getItems()[i]);
        }

        // Performance testing - end
        console.log(`[Calendar] updating all the (day) items took ${new Date().getMilliseconds() - start}ms`);
    }

    /**
     * @param {import("../../types").WeekStartStore} weekStart
     */
    async #updateWeekDays(weekStart) {
        if (weekStart === null) {
            console.error(`weekStart has to be a "0" or a "1"!`);
            return;
        }

        this.order = [0, 1, 2, 3, 4, 5, 6];

        if (weekStart > 0) {
            this.order = [
                ...this.order.slice(weekStart),
                ...this.order.slice(0, weekStart),
            ];
        }

        const items = this.shadowRoot.querySelectorAll(
            ".week-days-row .week-day-item",
        );

        this.#markWeekendItems(...items);
        items.forEach((item, i) => {
            item.innerHTML = `${this.#lang.data.get("calendar", this.order[i % 7].toString())}`;
        });
    }

    /**
     * @param {Element[]} children
     */
    async #markWeekendItems(...children) {
        const satIndex = this.order.findIndex((o) => o === 6);
        const sunIndex = this.order.findIndex((o) => o === 0);
        children.forEach((c, i) => {
            c.classList.remove("is-saturday");
            c.classList.remove("is-sunday");

            if (i % this.order.length === satIndex) {
                c.classList.add("is-saturday");
            }

            if (i % this.order.length === sunIndex) {
                c.classList.add("is-sunday");
            }
        });
    }

    /** @param {import("../../types").WeekStartStore} weekStart */
    async #onWeekStart(weekStart) {
        console.log(`[calendar] week-start event: update week days and run the handleDatePickerChangeEvent callback`)

        await this.#updateWeekDays(weekStart);
        await this.handleDatePickerChangeEvent(this.#store.data.get("date-picker"))
    }

    /** @param {import("../../types").LangStore} lang */
    async #onLang(lang) {
        console.log(`[calendar] language update`, lang)

        // Update week days grid header row
        await this.#updateWeekDays(this.#store.data.get("week-start"));
    }
}
