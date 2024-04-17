import { StackLayoutPage } from "../../components";
import { constants } from "../../lib";
import SwipeHandler from "./swipe-handler";
import * as utils from "./utils";

const template = document.createElement("template");
template.innerHTML = `
<style>
    :host {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        user-select: none;
        overflow: hidden;
        touch-action: none;
    }

    * {
        border: 1px solid red;
    }

    :host .item {
        min-width: 100%;
        height: 100%;
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
            this.app.datePickerButton.dispatchWithData(
                "datepickerchange",
                this.app.month,
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

        this.app.datePickerButton.addListener(
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

        this.app.datePickerButton.removeListener(
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
