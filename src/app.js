import ui from "ui";
import utils from "./utils";

/**
 * @typedef {import("ui/src/wc").AppBar} AppBar
 * @typedef {import("ui/src/wc").Button} Button
 * @typedef {import("ui/src/wc").IconButton} IconButton
 * @typedef {import("ui/src/wc").StackLayout} StackLayout
 * @typedef {import("ui/src/wc").Lang} Lang 
 * @typedef {import("ui/src/wc").ThemeHandler} ThemeHandler 
 * @typedef {import("ui/src/wc").Store} Store 
 * @typedef {import("ui/src/wc").StackLayoutPage} StackLayoutPage 
 *
 * @typedef {import("./types").ThemeStore} ThemeStore 
 */

export default class App extends ui.events.Events {
    /** @type {Store} */
    #store
    /** @type {Lang} */
    #lang

    /**
     * @param {Store} store
     */
    constructor(store) { // {{{
        super();

        /** @type {(() => void)[]} */
        this.cleanup = [];

        this.#store = store;
        this.#lang = document.querySelector("ui-lang")

        /** @type {ThemeHandler} */
        this.themeHandler = document.querySelector("#themeHandler");

        // {{{ Stack Layout Initialization

        /** @type {StackLayout} */
        this.stackLayout = document.querySelector("ui-stack-layout");

        this.stackLayout.registerPage("calendar", () => {
            return document.querySelector("template#pageCalendar")
                // @ts-expect-error
                .content.cloneNode(true);
        });

        this.stackLayout.registerPage("pdf", () => {
            return document.querySelector("template#pagePDF")
                // @ts-expect-error
                .content.cloneNode(true)
        });

        this.stackLayout.registerPage("settings", () => {
            return document.querySelector("template#pageSettings")
                // @ts-expect-error
                .content.cloneNode(true)
        });

        // }}}

        // {{{ App Bar Initialization 

        /** @type {AppBar} */
        this.appBar = document.querySelector("ui-app-bar");

        /** @type {IconButton} */
        this.appBarBackButton = this.appBar.querySelector("#appBarBackButton")
        this.appBarBackButton.onclick = async () => this.stackLayout.goBack();

        /** @type {Button} */
        this.appBarDatePickerButton = this.appBar.querySelector("#appBarDatePickerButton")
        this.appBarDatePickerButton.onclick = async () => null; // TODO: Add date-picker onclick callback

        /** @type {IconButton} */
        this.appBarEditButton = this.appBar.querySelector("#appBarEditButton")
        this.appBarEditButton.onclick = async () => null; // TODO: Add edit onclick callback

        /** @type {IconButton} */
        this.appBarTodayButton = this.appBar.querySelector("#appBarTodayButton")
        this.appBarTodayButton.onclick = async () => this.#store.data.set("date-picker", new Date());

        /** @type {IconButton} */
        this.appBarPDFButton = this.appBar.querySelector("#appBarPDFButton")
        this.appBarPDFButton.onclick = async () => this.stackLayout.setPage("pdf");

        /** @type {IconButton} */
        this.appBarSettingsButton = this.appBar.querySelector("#appBarSettingsButton")
        this.appBarSettingsButton.onclick = async () => this.stackLayout.setPage("settings");

        // }}}
    } // }}}

    run() { // {{{
        setTimeout(() => {
            this.#store.data.on(
                "theme",
                (/** @type {ThemeStore} */ data) => {
                    console.log(`[app] current theme in use:`, data)
                    utils.setTheme(data, this.themeHandler);
                },
                true,
            );

            this.stackLayout.events.addListener(
                "change",
                this.#onStackLayoutChange.bind(this),
            );

            this.#store.data.on("date-picker", (dateString) => {
                const date = new Date(dateString);
                this.appBarDatePickerButton.innerText =
                    `${date.getFullYear()} / ${(date.getMonth() + 1).toString().padStart(2, "0")}`;
            }, true);

            this.stackLayout.setPage("calendar");
        });
    } // }}}

    /**
     * @param {Object} data
     * @param {StackLayoutPage | null} data.newPage 
     * @param {StackLayoutPage | null} data.oldPage 
     */
    async #onStackLayoutChange({ newPage, oldPage }) { // {{{
        console.log(`[app] stack layout changed:`, { newPage, oldPage });

        // Update the AppBar buttons...
        if (this.stackLayout.stack.length <= 1) {
            this.appBar.removeChild(this.appBarBackButton.parentElement)
        } else {
            if (!!this.appBar.leftSlotChildren.length) {
                this.appBar.insertBefore(
                    this.appBarBackButton.parentElement,
                    this.appBar.leftSlotChildren[0]
                );
            } else {
                this.appBar.appendChild(
                    this.appBarBackButton.parentElement
                );
            }
        }

        if (!newPage) {
            utils.setAppBarTitle("")
            this.#noPageSetup();
            return
        }

        switch (newPage.name) {
            case "calendar":
                utils.setAppBarTitle("")
                this.#calendarPageSetup();
                break;
            case "settings":
                utils.setAppBarTitle(this.#lang.data.get("settings", "appBarTitle"))
                this.#settingsPageSetup();
                break;
            case "pdf":
                utils.setAppBarTitle("@TODO: PDF Page")
                this.#pdfPageSetup();
                break;
            default:
                throw `unknown page "${newPage.name}"`;
        }
    } // }}}

    #noPageSetup() { // {{{
        this.appBar.removeChild(this.appBarDatePickerButton.parentElement)
        this.appBar.removeChild(this.appBarEditButton.parentElement)
        this.appBar.removeChild(this.appBarTodayButton.parentElement)
        this.appBar.removeChild(this.appBarPDFButton.parentElement)
        this.appBar.removeChild(this.appBarSettingsButton.parentElement)
    } // }}}

    #calendarPageSetup() { // {{{
        this.appBar.appendChild(this.appBarDatePickerButton.parentElement)
        this.appBar.appendChild(this.appBarEditButton.parentElement)
        this.appBar.appendChild(this.appBarTodayButton.parentElement)
        this.appBar.appendChild(this.appBarPDFButton.parentElement)
        this.appBar.appendChild(this.appBarSettingsButton.parentElement)
    } // }}}

    #settingsPageSetup() { // {{{
        this.appBar.removeChild(this.appBarDatePickerButton.parentElement)
        this.appBar.removeChild(this.appBarEditButton.parentElement)
        this.appBar.removeChild(this.appBarTodayButton.parentElement)
        this.appBar.removeChild(this.appBarPDFButton.parentElement)
        this.appBar.removeChild(this.appBarSettingsButton.parentElement)
    } // }}}

    #pdfPageSetup() { // {{{
        this.appBar.removeChild(this.appBarDatePickerButton.parentElement)
        this.appBar.removeChild(this.appBarEditButton.parentElement)
        this.appBar.removeChild(this.appBarTodayButton.parentElement)
        this.appBar.removeChild(this.appBarPDFButton.parentElement)
        this.appBar.removeChild(this.appBarSettingsButton.parentElement)
    } // }}}
}
