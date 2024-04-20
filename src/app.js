import { StackLayout } from "./components";
import { constants, DB, Language, Storage } from "./lib";
import ui from "ui";

export const eventDatePickerChange = "datepickerchange"

/**
 * @typedef {import("ui/src/web-components/button/button").Button} Button 
 * @typedef {import("ui/src/web-components/button/icon-button").IconButton} IconButton 
 */

export class App extends ui.events.Events {
    /** @type {Element} */
    #root;

    /**
     * @type {(data: import("./lib/storage").StorageDataLang) => void|Promise<void>}
     */
    #onlang;

    /**
     * @param {Element} app
     */
    constructor(app) {
        super(constants.debug) // NOTE: Events: "datepickerchange"
        this.#root = app;

        this.db;
        this.storage = new Storage();
        this.language = new Language(this);

        /** @type {StackLayout} */
        this.stackLayout = document.querySelector("stack-layout");

        // AppBar left slot
        /** @type {IconButton} */
        this.backButton = document.querySelector("#appBarBackButton");
        /** @type {Button} */
        this.datePickerButton = document.querySelector(
            "#appBarDatePickerButton",
        );

        // AppBar center slot
        /** @type {HTMLElement} */
        this.title = document.querySelector("#appBarTitle");

        // AppBar right slot
        /** @type {IconButton} */
        this.editButton = document.querySelector("#appBarEditButton");
        /** @type {IconButton} */
        this.todayButton = document.querySelector("#appBarTodayButton");
        /** @type {IconButton} */
        this.pdfButton = document.querySelector("#appBarPDFButton");
        /** @type {IconButton} */
        this.settingsButton = document.querySelector("#appBarSettingsButton");
    }

    get element() {
        return this.#root;
    }

    getMonth() {
        let [year, month] = this.datePickerButton.innerText.split("/");

        if (!year || !month)
            throw `the date-picker button contains no date!`;

        if (isNaN(Number(year)) || isNaN(Number(month)))
            throw `the date-picker button contains no date!`;

        return new Date(Number(year), Number(month) - 1, 1);
    }

    /** @param {Date} date */
    setMonth(date) {
        this.datePickerButton.innerText = this.getMonthString(date);
        this.dispatchWithData(eventDatePickerChange, date)
    }

    onMount() {
        if (constants.debug) console.log("[app] onMount");

        // Initialize the database, close if already exists
        if (!!this.db) this.db.close();

        this.db = new DB(constants.db.name, constants.db.version);

        // Storage event: "lang"
        this.#onlang = async (data) => {
            await this.language.setLanguage(data || constants.language);
        };

        this.storage.addListener("lang", this.#onlang);

        // Trigger (storage) language event - this will initially load the language data
        this.storage.dispatchWithData(
            "lang",
            this.storage.get("lang", constants.language),
        );

        // Set on click handlers
        this.backButton.onclick = () => this.#onBackButtonClick();
        this.datePickerButton.onclick = () => this.#onDatePickerButtonClick();
        this.editButton.onclick = () => this.#onEditButtonClick();
        this.todayButton.onclick = () => this.#onTodayButtonClick();
        this.pdfButton.onclick = () => this.#onPDFButtonClick();
        this.settingsButton.onclick = () => this.#onSettingsButtonClick();

        // TODO: Get the last used date from the local storage
        this.setMonth(new Date());

        return this;
    }

    onDestroy() {
        if (constants.debug) console.log("[app] onDestroy");

        // Close database
        if (!!this.db) this.db.close();

        // Storage event: "lang"
        this.storage.removeListener("lang", this.#onlang);

        return this;
    }

    run() {
        // Setup pages
        this.stackLayout.app = this;
        this.stackLayout.setPage(this.stackLayout.pages.calendar);

        return this;
    }

    /** @param {Date} date */
    getMonthString(date) {
        return `${date.getFullYear()} / ${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    }

    goNextMonth() {
        const date = this.getMonth()
        date.setMonth(date.getMonth() + 1);
        this.setMonth(date)
    }

    goPrevMonth() {
        const date = this.getMonth()
        date.setMonth(date.getMonth() - 1);
        this.setMonth(date)
    }

    #onBackButtonClick() {
        // ...
    }

    #onDatePickerButtonClick() {
        // ...
    }

    #onEditButtonClick() {
        // ...
    }

    #onTodayButtonClick() {
        // ...
    }

    #onPDFButtonClick() {
        // ...
    }

    #onSettingsButtonClick() {
        // ...
    }
}
