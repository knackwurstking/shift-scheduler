import ui from "ui";
import utils from "./utils";

/**
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
        /** @type {StackLayout} */
        this.stackLayout = document.querySelector("ui-stack-layout");

        this.#registerPages();

        // TODO: Query select the AppBar component and fix this mess
        this.appBar = {
            // {{{ Left Slot
            /** @type {IconButton} */
            backButton: document.querySelector("#appBarBackButton"),
            /** @type {Button} */
            datePickerButton: document.querySelector("#appBarDatePickerButton"),
            // }}}
            // {{{ Right Slot
            /** @type {IconButton} */
            editButton: document.querySelector("#appBarEditButton"),
            /** @type {IconButton} */
            todayButton: document.querySelector("#appBarTodayButton"),
            /** @type {IconButton} */
            pdfButton: document.querySelector("#appBarPDFButton"),
            /** @type {IconButton} */
            settingsButton: document.querySelector("#appBarSettingsButton"),
            // }}}
        };

        this.appBar.leftSlot = this.appBar.backButton.parentElement.parentElement
        this.appBar.rightSlot = this.appBar.settingsButton.parentElement.parentElement

        this.appBar.backButton.onclick = async () => this.stackLayout.goBack();
        this.appBar.datePickerButton.onclick = async () => null; // TODO: Add date-picker onclick callback
        this.appBar.editButton.onclick = async () => null; // TODO: Add edit onclick callback
        this.appBar.todayButton.onclick = async () => this.#store.data.set("date-picker", new Date());
        this.appBar.pdfButton.onclick = async () => this.stackLayout.setPage("pdf");
        this.appBar.settingsButton.onclick = async () => this.stackLayout.setPage("settings");
    } // }}}

    run() { // {{{
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
            this.appBar.datePickerButton.innerText =
                `${date.getFullYear()} / ${(date.getMonth() + 1).toString().padStart(2, "0")}`;
        }, true);

        this.stackLayout.setPage("calendar");
    } // }}}

    #registerPages() { // {{{
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
    } // }}}

    /**
     * @param {Object} data
     * @param {StackLayoutPage | null} data.newPage 
     * @param {StackLayoutPage | null} data.oldPage 
     */
    async #onStackLayoutChange({ newPage, oldPage }) { // {{{
        console.log(`[app] stack layout changed:`, { newPage, oldPage })

        // Update the AppBar buttons...
        if (this.stackLayout.stack.length <= 1) {
            this.appBar.leftSlot.removeChild(this.appBar.backButton.parentElement)
        } else {
            if (!!this.appBar.leftSlot.children.length) {
                this.appBar.leftSlot.insertBefore(this.appBar.backButton.parentElement, this.appBar.leftSlot.children[0])
            } else {
                this.appBar.leftSlot.appendChild(this.appBar.backButton.parentElement)
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
        this.appBar.leftSlot.removeChild(this.appBar.datePickerButton.parentElement)
        this.appBar.rightSlot.removeChild(this.appBar.editButton.parentElement)
        this.appBar.rightSlot.removeChild(this.appBar.todayButton.parentElement)
        this.appBar.rightSlot.removeChild(this.appBar.pdfButton.parentElement)
        this.appBar.rightSlot.removeChild(this.appBar.settingsButton.parentElement)
    } // }}}

    #calendarPageSetup() { // {{{
        this.appBar.leftSlot.appendChild(this.appBar.datePickerButton.parentElement)
        this.appBar.rightSlot.appendChild(this.appBar.editButton.parentElement)
        this.appBar.rightSlot.appendChild(this.appBar.todayButton.parentElement)
        this.appBar.rightSlot.appendChild(this.appBar.pdfButton.parentElement)
        this.appBar.rightSlot.appendChild(this.appBar.settingsButton.parentElement)
    } // }}}

    #settingsPageSetup() { // {{{
        this.appBar.leftSlot.removeChild(this.appBar.datePickerButton.parentElement)
        this.appBar.rightSlot.removeChild(this.appBar.editButton.parentElement)
        this.appBar.rightSlot.removeChild(this.appBar.todayButton.parentElement)
        this.appBar.rightSlot.removeChild(this.appBar.pdfButton.parentElement)
        this.appBar.rightSlot.removeChild(this.appBar.settingsButton.parentElement)
    } // }}}

    #pdfPageSetup() { // {{{
        this.appBar.leftSlot.removeChild(this.appBar.datePickerButton.parentElement)
        this.appBar.rightSlot.removeChild(this.appBar.editButton.parentElement)
        this.appBar.rightSlot.removeChild(this.appBar.todayButton.parentElement)
        this.appBar.rightSlot.removeChild(this.appBar.pdfButton.parentElement)
        this.appBar.rightSlot.removeChild(this.appBar.settingsButton.parentElement)
    } // }}}
}
