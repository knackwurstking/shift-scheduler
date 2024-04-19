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
    <ui-flex-grid-item class="ui-card"></ui-flex-grid-item>
    <ui-flex-grid-item class="ui-card"></ui-flex-grid-item>
    <ui-flex-grid-item class="ui-card"></ui-flex-grid-item>
    <ui-flex-grid-item class="ui-card"></ui-flex-grid-item>
    <ui-flex-grid-item class="ui-card"></ui-flex-grid-item>
    <ui-flex-grid-item class="ui-card"></ui-flex-grid-item>
    <ui-flex-grid-item class="ui-card"></ui-flex-grid-item>
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

// TODO: Update old classes and add missing (css) styles
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

    :host .item .item-content .week-days-row > ui-flex-grid-item {
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

    :host .item .item-content .week-days-row > .ui-flex-grid-item.is-saturday,
    :host .item .item-content .week-days-row > .ui-flex-grid-item.is-sunday {
        font-weight: bolder;
        /* TODO: Some special highlighting */
    }

    :host .item .item-content .week-days-row > .ui-flex-grid-item.is-saturday {
        /* TODO: Some special highlighting */
    }

    :host .item .item-content .week-days-row > .ui-flex-grid-item.is-sunday {
        /* TODO: Some special highlighting */
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

    :host .item .item-content .days-row .day-item .day-item-date {
        position: absolute;
        top: 0;
        left: 0;
        padding: 0.5vmin;
        /*font-size: 3vmin;*/
        font-size: clamp(0em, 3vmin, 1em);
        font-weight: 0.5vmin;
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

        this.swipeHandler = new SwipeHandler(this);
        this.today;

        /** @param {Date} date */
        this.ondatepickerchange = async (date) => {
            if (constants.debug)
                console.log("[Calendar] date picker change:", date);

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
            if (constants.debug) console.log("[Calendar] update week start");
            if (weekStart !== 0 && weekStart !== 1)
                weekStart = constants.weekStart;
            this.updateWeekDays(weekStart);

            // Crete days, note, shifts, ... if the week-start changes
            this.app.dispatchWithData(
                "datepickerchange",
                this.app.getMonth(),
            );
        };

        /** @param {"left" | "right"} direction */
        this.onswipe = (direction) => {
            if (constants.debug)
                console.log(`[Calendar] handle swipe to "${direction}"`);

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
            this.updateWeekDays(this.app.storage.get("week-start"));
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.shadowRoot.appendChild(template.content.cloneNode(true));

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
        let order = [0, 1, 2, 3, 4, 5, 6];

        if (weekStart > 0) {
            order = [...order.slice(weekStart), ...order.slice(0, weekStart)];
        }

        // TODO: Do i need to use the shadowRoot here?
        const children = this.querySelectorAll(
            ".page-calendar-week-days .ui-grid-column",
        );

        for (let x = 0; x < children.length; x++) {
            if (order[x] === 0 || order[x] === 6) {
                children[x].classList.add("page-calendar-weekend");
            } else {
                children[x].classList.remove("page-calendar-weekend");
            }

            children[x].innerHTML =
                `${this.app.language.get("calendar", order[x % 7].toString())}`;
        }
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

        // TODO: Do i need to use the shadowRoot here?
        const cards = calendarItem.querySelectorAll(
            ".page-calendar-days > .ui-card",
        );
        const data = await utils.fillWithData(this.app.db, date, await promise);
        for (let i = 0; i < data.length; i++) {
            if (this.isNope(data[i].date, date)) cards[i].classList.add("nope");
            else cards[i].classList.remove("nope");

            if (this.isToday(data[i].date)) cards[i].classList.add("today");
            else cards[i].classList.remove("today");

            if (!!data[i].note) cards[i].classList.add("note");
            else cards[i].classList.remove("note");

            cards[i].querySelector(".page-calendar-day-date").innerHTML =
                `${data[i].date.getDate()}`;

            cards[i].querySelector(".page-calendar-day-shift").innerHTML =
                !!data[i].shift?.visible ? data[i].shift?.shortName || "" : "";
        }
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
}
