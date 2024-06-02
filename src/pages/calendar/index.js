import ui from "ui";
import db from "../../db";
import * as dialogs from "../../dialogs";
import { SwipeHandler } from "./swipe-handler";
import * as utils from "./utils";

/**
 * @typedef {import("ui/src/wc").Lang} Lang
 * @typedef {import("ui/src/wc").Store<import("../../types").StoreEvents>} Store
 *
 * @typedef {import("./swipe-handler").Direction} Direction
 *
 * @typedef {import("../../types").DatePickerStore} DatePickerStore 
 * @typedef {import("../../types").WeekStartStore} WeekStartStore 
 * @typedef {import("../../types").LangStore} LangStore 
 * @typedef {import("../../types").DBDataEntry} DBDataEntry
 * @typedef {import("../../types").EditModeStore} EditModeStore
 *
 * @typedef {import("../../db").DB} DB 
 */


// {{{ Component Template

const template = document.createElement("template");

const templateDayItem = `
<ui-flex-grid-item class="day-item" style="position: relative;">
    <div class="day-item-date"></div>
    <div class="day-item-shift"></div>
</ui-flex-grid-item>
`;

const templateDaysRow = `
<ui-flex-grid-row class="days-row" gap="0.05rem">
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
<ui-flex-grid-row class="week-days-row" gap="0.05rem">
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
<ui-flex-grid gap="0.05rem">
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
        --header-height: 2.5rem;
        --edit-mode-height: 4.5rem;
        position: relative;
        display: block;
        height: 100%;
        width: 100%;
    }

    .calendar {
        display: flex;
        position: relative;
        flex-direction: row;
        flex-wrap: nowrap;
        user-select: none;
        overflow: hidden;
        width: 100%;
        height: 100%;
        transition: height 0.25s ease;
    }

    :host([edit]) .calendar {
        height: calc(100% - var(--edit-mode-height));
    }

    .edit-mode {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: var(--edit-mode-height);
        transform: translateY(100%);
        transition: transform 0.25s ease;
        overflow-x: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .edit-mode::-webkit-scrollbar {
        display: none;
    }

    :host([edit]) .edit-mode {
        transform: translateY(0);
    }

    .item {
        position: absolute;
        top: var(--ui-app-bar-height);
        bottom: 0;
        min-width: 100%;
    }

    .calendar .item ui-flex-grid {
        width: calc(100% - 0.25rem);
        height: calc(100% - 0.25rem);
    }

    .week-days-row {
        height: var(--header-height);
        padding: 1px 0;
    }

    .days-row {
        height: 100%;
        padding: 1px 0;
    }

    ui-flex-grid-item {
        border-radius: var(--ui-radius);
        border: 1px solid var(--ui-borderColor);
    }

    :host([no-border]) ui-flex-grid-item {
        border: none;
    }

    .week-day-item {
        width: calc(100% / 7);
        overflow: hidden;
        height: 100%;
        font-size: 115%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .week-day-item.is-saturday,
    .week-day-item.is-sunday {
        font-weight: bold;
    }

    .is-saturday,
    .is-sunday {
        background-color: hsla(var(--ui-color-hsl), 0.05);
    }

    .day-item {
        height: 100%;
        overflow: hidden;
    }

    .day-item.today::after {
        content: "";
        position: absolute;
        z-index: 9;
        top: -1rem;
        left: -1rem;
        width: 2rem;
        height: 2rem;
        border-radius: var(--ui-radius);
        border-bottom-right-radius: 50%;
        background-color: orange;
        filter: blur(1rem);
        animation: fade-in .5s;
    }

    .item:not(.moving) .day-item.note::before {
        content: "";
        position: absolute;
        z-index: 8;
        bottom: -1rem;
        right: -1rem;
        width: 2rem;
        height: 2rem;
        border-radius: var(--ui-radius);
        border-top-left-radius: 50%;
        background-color: red;
        filter: blur(1rem);
        animation: fade-in .5s;
    }

    .day-item.inactive {
        opacity: 0.2;
    }

    .day-item .day-item-date {
        position: absolute;
        top: 0;
        left: 0;
        padding: 0.5vmin;
        font-size: 3vmin;
        font-size: clamp(0rem, 3vmin, 1rem);
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
        font-size: 5vmin;
        font-weight: bold;
        color: var(--shift-color, var(--ui-color));
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

    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
</style>

<div class="calendar">
    <div class="item item1" style="left: -100%;">
        ${templateItemContent}
    </div>

    <div class="item item2" style="left: 0;">
        ${templateItemContent}
    </div>

    <div class="item item3" style="left: 100%;">
        ${templateItemContent}
    </div>
</div>

<ui-flex-grid-row class="edit-mode" gap="0.25rem"><slot name="shifts"></slot></ui-flex-grid-row>
`;

// }}}

export class CalendarPage extends ui.wc.StackLayoutPage {
    /** @type {Store} */
    #store;
    /** @type {Lang} */
    #lang;

    static register = () => {
        customElements.define("calendar-page", CalendarPage);
        dialogs.EditDayDialog.register();
    };

    constructor() { // {{{
        super();
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.#store = document.querySelector("ui-store");
        this.#lang = document.querySelector("ui-lang");
        this.swipeHandler = new SwipeHandler(this.shadowRoot.querySelector(".calendar"));

        /** @type {Date} */
        this.today;
        /** @type {number[]} */
        this.order;

        this.shadowRoot.querySelectorAll(".days-row > .day-item").forEach(child => {
            child.addEventListener("click",
                async (/** @type {Event & { currentTarget: HTMLElement }} */ev) =>
                    this.onDayItemClick(ev.currentTarget, child)
            );
        });
    } // }}}

    connectedCallback() { // {{{
        super.connectedCallback();

        setTimeout(() => {
            this.cleanup.add(
                // The "swipe" event will update the date-picker store, base on the swiped direction
                this.swipeHandler.on("swipe", this.handleSwipeEvent.bind(this))
            );

            this.cleanup.add(
                // Handle the "date-picker" state change, update calendar items
                this.#store.ui.on("date-picker",
                    this.onDatePicker.bind(this), true),
            );

            this.cleanup.add(
                // Handle a "week-start" change event
                this.#store.ui.on("week-start",
                    this.onWeekStart.bind(this), true),
            );

            this.cleanup.add(
                // Handle a "lang" change event
                this.#store.ui.on("lang", this.onLang.bind(this), true),
            );

            this.cleanup.add(
                this.#store.ui.on("edit-mode", this.onEditMode.bind(this), true),
            );

            this.swipeHandler.start();
            this.cleanup.add(() => this.swipeHandler.stop());
        });
    } // }}}

    /**
     *  @param {Date} current
     *  @param {Element} calendarItem
     */
    async updateCalendarItem(current, calendarItem) { // {{{
        let dataEntries = await utils.getArray(current.getFullYear(), current.getMonth(), this.#store);
        const cards = calendarItem.querySelectorAll(".days-row > .day-item");

        dataEntries.forEach(async (item, idx) => {
            const data = await db.get(item.year, item.month, item.date);
            if (data !== null) {
                item.note = data.note;
                // TODO: Get shift id from settings first, if possible
                item.shift = data.shift || item.shift;
            }

            this.updateDayItem(cards[idx], item);

            // Inactive Item
            if (item.year !== current.getFullYear() || item.month !== current.getMonth()) {
                cards[idx].classList.add("inactive");
            } else {
                cards[idx].classList.remove("inactive");
            }
        });

        this.markWeekendItems(...cards);
    } // }}}

    /**
     * @param {Element} el
     * @param {DBDataEntry} data
     */
    async updateDayItem(el, data) { // {{{
        // Today Item
        if (this.isToday(data.year, data.month, data.date)) {
            el.classList.add("today");
        } else {
            el.classList.remove("today");
        }

        // Has Note
        if (!!data.note) {
            el.classList.add("note");
        } else {
            el.classList.remove("note");
        }

        // Set date and shift
        el.querySelector(".day-item-date").innerHTML = `${data.date}`

        /** @type {HTMLElement} */
        const itemShift = el.querySelector(".day-item-shift");

        if (!data.shift) {
            itemShift.style.removeProperty("--shift-color");
            itemShift.innerHTML = "";
            return;
        }

        itemShift.style.setProperty(
            "--shift-color",
            data.shift.visible
                ? (data.shift.color || "inherit")
                : "transparent"
        );

        itemShift.innerHTML = data.shift.shortName || "";

        // Needed for the dialog to add a note or modify the shift
        el.setAttribute("data-year", data.year.toString());
        el.setAttribute("data-month", data.month.toString());
        el.setAttribute("data-date", data.date.toString());
    } // }}}

    /**
     * @param {number} year
     * @param {number} month
     * @param {number} date
     */
    isToday(year, month, date) { // {{{
        return (
            this.today.getFullYear() === year &&
            this.today.getMonth() === month &&
            this.today.getDate() === date
        );
    } // }}}

    /**
     * @param {Direction} direction
     */
    async handleSwipeEvent(direction) { // {{{
        console.debug(`[calendar] handle swipe event: direction=${direction}`);

        switch (direction) {
            case "left":
                // Go to next month
                this.#store.ui.update(
                    "date-picker",
                    (/** @type {DatePickerStore} */ dateString) => {
                        const date = new Date(dateString);
                        date.setMonth(date.getMonth() + 1);
                        return date.toString();
                    },
                );
                break;
            case "right":
                // Go to prev month
                this.#store.ui.update(
                    "date-picker",
                    (/** @type {DatePickerStore} */ dateString) => {
                        const date = new Date(dateString);
                        date.setMonth(date.getMonth() - 1);
                        return date.toString();
                    },
                );
                break;
        }
    } // }}}

    /**
     * @private
     * @param {WeekStartStore} weekStart
     */
    async updateWeekDays(weekStart) { // {{{
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

        const items = [...this.shadowRoot.querySelectorAll(
            ".week-days-row .week-day-item",
        )];

        this.markWeekendItems(...items);

        items.forEach((item, i) => {
            item.innerHTML = `${this.#lang.ui.get("week-day", this.order[i % 7].toString())}`;
        });
    } // }}}

    /**
     * @private
     * @param {Element[]} children
     */
    async markWeekendItems(...children) { // {{{
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
    } // }}}

    /**
     * @private
     * @param {DatePickerStore} dateString
     */
    async onDatePicker(dateString) { // {{{
        console.debug(
            `[calendar] date-picker change event: update calendar items`,
            { dateString }
        );

        // Performance testing - start
        const start = new Date().getMilliseconds();

        const date = new Date(dateString);
        date.setMonth(date.getMonth() - 1);
        this.today = new Date();

        const items = this.shadowRoot.querySelectorAll(".item");
        for (let i = 0; i < 3; i++, date.setMonth(date.getMonth() + 1)) {
            this.updateCalendarItem(new Date(date), items[i]);
        }

        // Performance testing - end
        console.debug(
            `[calendar] updating all the (day) items took ${new Date().getMilliseconds() - start}ms`,
        );
    } // }}}

    /** 
     * @param {HTMLElement} target
     * @param {Element} child
     */
    async onDayItemClick(target, child) { // {{{
        if (this.swipeHandler.startX !== null) {
            return;
        }

        const year = parseInt(target.getAttribute("data-year"));
        const month = parseInt(target.getAttribute("data-month"));
        const date = parseInt(target.getAttribute("data-date"));

        const { open, active } = this.#store.ui.get("edit-mode");
        if (!!open) {
            if (!active) return;

            const rhythmStift = utils.calcShiftForDay(
                new Date(year, month, date), this.#store.ui.get("settings")
            );

            const dbEntry = {
                year, month, date,
                shift: active.id === 0 ? null : active,
                note: (await db.get(year, month, date))?.note || "",
            };
            if (rhythmStift?.id === dbEntry.shift?.id) dbEntry.shift = null;

            if (!dbEntry.shift && !dbEntry.note) {
                db.delete(year, month, date)
            } else {
                db.add(dbEntry).catch(() => db.put(dbEntry));
            }

            this.updateDayItem(target, { ...dbEntry, shift: dbEntry.shift || rhythmStift });
            return;
        }

        const dialog = new dialogs.EditDayDialog(this.#store, this.#lang);
        document.body.appendChild(dialog);
        dialog.set(year, month, date);

        dialog.ui.open(true);

        dialog.ui.events.on("close", () => {
            document.body.removeChild(dialog);
        });

        dialog.ui.events.on("submit", async (data) => {
            if (data) {
                this.updateDayItem(child, data);
            }
        });
    } // }}}

    /**
     * @private
     * @param {EditModeStore} data 
     */
    onEditMode(data) { // {{{
        if (this.hasAttribute("edit") && !!data.open) {
            return;
        }

        if (!this.hasAttribute("edit") && !data.open) {
            return;
        }

        if (data.open) {
            this.setAttribute("edit", "");
        } else {
            this.removeAttribute("edit");
            return;
        }

        while (!!this.firstChild) {
            this.removeChild(this.firstChild);
        }

        let shifts = (this.#store.ui.get("settings").shifts || [])
        shifts = [
            {
                id: 0,
                name: "Reset",
                shortName: "",
                visible: false
            },
            ...shifts
        ];

        for (let i = 0; i < shifts.length; i++) {
            const item = new ui.wc.FlexGridItem();
            item.slot = "shifts";
            item.innerHTML = `
                <shift-card color="${shifts[i].color || 'inherit'}" ${!!shifts[i].visible ? 'visible' : ''}>
                    <span slot="name">${shifts[i].name}</span>
                    <span slot="short-name">${shifts[i].shortName}</span>
                </shift-card>
            `;

            /** @type {HTMLElement} */
            const card = item.querySelector("shift-card");
            card.onclick = async () => {
                [...this.children].forEach((child, idx) => {
                    if (idx !== i) {
                        child.querySelector("shift-card").removeAttribute("active");
                    }
                });

                if (card.hasAttribute("active")) {
                    card.removeAttribute("active");
                    this.#store.ui.update(
                        "edit-mode", (data) => ({
                            ...data,
                            active: null,
                        })
                    );
                    return;
                }

                card.setAttribute("active", "");
                this.#store.ui.update(
                    "edit-mode", (data) => ({
                        ...data,
                        active: shifts[i],
                    })
                );
            };

            this.appendChild(item);
        }
    } // }}}

    /**
     * @private
     * @param {WeekStartStore} weekStart
     */
    async onWeekStart(weekStart) { // {{{
        console.debug(
            `[calendar] week-start event: update week days and run the onDatePicker callback`,
        );

        await this.updateWeekDays(weekStart);
        await this.onDatePicker(this.#store.ui.get("date-picker"));
    } // }}}

    /**
     * @private
     * @param {LangStore} lang
     */
    async onLang(lang) { // {{{
        console.debug(`[calendar] language update`, lang);

        // Update week days grid header row
        await this.updateWeekDays(this.#store.ui.get("week-start"));
    } // }}}
}
