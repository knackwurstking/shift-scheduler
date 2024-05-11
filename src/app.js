import { App as CapApp } from "@capacitor/app";
import ui from "ui";
import utils from "./utils";

/**
 * @typedef {import("ui/src/wc").AppBar} AppBar
 * @typedef {import("ui/src/wc").Button} Button
 * @typedef {import("ui/src/wc").IconButton} IconButton
 * @typedef {import("ui/src/wc").StackLayout} StackLayout
 * @typedef {import("ui/src/wc").Lang} Lang 
 * @typedef {import("ui/src/wc").ThemeHandler} ThemeHandler 
 * @typedef {import("ui/src/wc").Store<import("./types").StoreEvents>} Store 
 * @typedef {import("ui/src/wc").StackLayoutPage} StackLayoutPage 
 */

export default class App extends ui.js.events.Events {
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

        this.registerPages()
        this.createAppBar()
        this.initializeAndroidHandlers()
    } // }}}

    run() { // {{{
        setTimeout(() => {
            this.stackLayout.ui.events.on(
                "change",
                this.onStackLayoutChange.bind(this),
            );

            this.#store.ui.on("date-picker", (dateString) => {
                const date = new Date(dateString);
                this.appBarDatePickerButton.innerText =
                    `${date.getFullYear()} / ${(date.getMonth() + 1).toString().padStart(2, "0")}`;
            }, true);

            this.stackLayout.ui.setPage("calendar");
            document.body.style.display = "block"
        });
    } // }}}

    /**
     * @private
     */
    registerPages() { // {{{
        /** @type {StackLayout} */
        this.stackLayout = document.querySelector("ui-stack-layout");

        this.stackLayout.ui.registerPage("calendar", () => {
            return document.querySelector("template#pageCalendar")
                // @ts-expect-error
                .content.cloneNode(true);
        });

        this.stackLayout.ui.registerPage("pdf", () => {
            return document.querySelector("template#pagePDF")
                // @ts-expect-error
                .content.cloneNode(true)
        });

        this.stackLayout.ui.registerPage("settings", () => {
            return document.querySelector("template#pageSettings")
                // @ts-expect-error
                .content.cloneNode(true)
        });
    } // }}}

    /**
     * @private
     */
    createAppBar() { // {{{
        /** @type {AppBar} */
        this.appBar = document.querySelector("ui-app-bar");

        /** @type {IconButton} */
        this.appBarBackButton = this.appBar.querySelector("#appBarBackButton")
        this.appBarBackButton.onclick = this.onBack.bind(this);

        /** @type {Button} */
        this.appBarDatePickerButton = this.appBar.querySelector("#appBarDatePickerButton")
        this.appBarDatePickerButton.onclick = async () => null; // TODO: Add date-picker onclick callback

        /** @type {IconButton} */
        this.appBarEditButton = this.appBar.querySelector("#appBarEditButton")
        this.appBarEditButton.onclick = async () => null; // TODO: Add edit onclick callback

        /** @type {IconButton} */
        this.appBarTodayButton = this.appBar.querySelector("#appBarTodayButton")
        this.appBarTodayButton.onclick = async () => this.#store.ui.set("date-picker", new Date().toString());

        /** @type {IconButton} */
        this.appBarPDFButton = this.appBar.querySelector("#appBarPDFButton")
        this.appBarPDFButton.onclick = async () => this.stackLayout.ui.setPage("pdf");

        /** @type {IconButton} */
        this.appBarSettingsButton = this.appBar.querySelector("#appBarSettingsButton")
        this.appBarSettingsButton.onclick = async () => this.stackLayout.ui.setPage("settings");
    } // }}}

    /**
     * Android Handlers
     *  - "backButton"
     *
     * @private
     */
    initializeAndroidHandlers() { // {{{
        if (!utils.isAndroid()) return;
        CapApp.addListener("backButton", this.onBack.bind(this))
    } // }}}

    /**
     * @private
     * @param {Object} data
     * @param {StackLayoutPage | null} data.newPage 
     * @param {StackLayoutPage | null} data.oldPage 
     */
    async onStackLayoutChange({ newPage, oldPage }) { // {{{
        console.debug(`[app] stack layout changed:`, { newPage, oldPage });

        // Update the AppBar buttons...
        if (this.stackLayout.ui.stack.length <= 1) {
            this.appBar.removeChild(this.appBarBackButton.parentElement)
        } else {
            const leftSlot = this.appBar.ui.getLeftSlot()
            if (leftSlot.length > 0) {
                this.appBar.insertBefore(
                    this.appBarBackButton.parentElement,
                    leftSlot[0]
                );
            } else {
                this.appBar.appendChild(
                    this.appBarBackButton.parentElement
                );
            }
        }

        if (!newPage) {
            utils.setAppBarTitle("")
            this.appBar.removeChild(this.appBarDatePickerButton.parentElement)
            this.appBar.removeChild(this.appBarEditButton.parentElement)
            this.appBar.removeChild(this.appBarTodayButton.parentElement)
            this.appBar.removeChild(this.appBarPDFButton.parentElement)
            this.appBar.removeChild(this.appBarSettingsButton.parentElement)
            return
        }

        switch (newPage.ui.name) {
            case "calendar":
                utils.setAppBarTitle("")
                this.appBar.appendChild(this.appBarDatePickerButton.parentElement)
                this.appBar.appendChild(this.appBarEditButton.parentElement)
                this.appBar.appendChild(this.appBarTodayButton.parentElement)
                this.appBar.appendChild(this.appBarPDFButton.parentElement)
                this.appBar.appendChild(this.appBarSettingsButton.parentElement)
                break;
            case "settings":
                utils.setAppBarTitle(this.#lang.ui.get("settings", "appBarTitle"))
                this.appBar.removeChild(this.appBarDatePickerButton.parentElement)
                this.appBar.removeChild(this.appBarEditButton.parentElement)
                this.appBar.removeChild(this.appBarTodayButton.parentElement)
                this.appBar.removeChild(this.appBarPDFButton.parentElement)
                this.appBar.removeChild(this.appBarSettingsButton.parentElement)
                break;
            case "pdf":
                utils.setAppBarTitle("@TODO: PDF Page")
                this.appBar.removeChild(this.appBarDatePickerButton.parentElement)
                this.appBar.removeChild(this.appBarEditButton.parentElement)
                this.appBar.removeChild(this.appBarTodayButton.parentElement)
                this.appBar.removeChild(this.appBarPDFButton.parentElement)
                this.appBar.removeChild(this.appBarSettingsButton.parentElement)
                break;
            default:
                throw `unknown page "${newPage.ui.name}"`;
        }
    } // }}}

    /**
     * @private
     */
    async onBack() { // {{{
        if (this.stackLayout.ui.stack.length <= 1) return;
        if (!!document.body.querySelector("ui-dialog")?.hasAttribute("open")) {
            this.stackLayout.ui.goBack();
        }
    } // }}}
} // }}}
