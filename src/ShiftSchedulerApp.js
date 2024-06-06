import { App as CapApp } from "@capacitor/app";
import {
    SvgBackArrow,
    SvgEdit2,
    SvgPDF,
    SvgSettings,
    SvgToday,
    UIAppBar,
    UIButton,
    UIContainer,
    UIFlexGridItem,
    UIIconButton,
    UILang,
    UIStackLayout,
    UIStore,
    UIThemeHandler,
} from "ui";
import { CleanUp, html, isAndroid } from "ui/src/js";
import db from "./db";
import { DatePickerDialog, PDFDialog } from "./dialogs";
import { CalendarPage, SettingsPage } from "./pages";
import utils from "./utils";

const content = html`
    <ui-theme-handler auto></ui-theme-handler>

    <ui-store
        local-storage-prefix="shift-scheduler:"
        enable-local-storage
    ></ui-store>

    <ui-lang>
        <ui-lang-type name="en" href="/lang/en.json" fallback></ui-lang-type>
        <ui-lang-type name="de" href="/lang/de.json"></ui-lang-type>
    </ui-lang>

    <ui-container
        style="width: 100%; height: 100%;"
    >
        <ui-stack-layout></ui-stack-layout>
    </ui-container>

    <ui-app-bar
        style="padding: 0 var(--ui-spacing);"
        position="top"
    >
        <ui-flex-grid-item
            slot="left"
        >
            <ui-icon-button
                id="appBarBackButton"
                style="width: 100%; height: 100%;"
                ghost
            >
                <svg-back-arrow-navigation></svg-back-arrow-navigation>
            </ui-icon-button>
        </ui-flex-grid-item>

        <ui-flex-grid-item
            slot="left"
            style="padding: calc(var(--ui-spacing) / 2)"
        >
            <ui-button
                id="appBarDatePickerButton"
                style="width: 100%; height: 100%; white-space: nowrap;"
                variant="outline"
                color="primary"
            ></ui-button>
        </ui-flex-grid-item>

        <ui-flex-grid-item slot="center" class="flex align-center">
            <h3
                style="white-space: nowrap;"
                id="appBarTitle"
            >
                <slot name="title">Shift Scheduler</slot>
            </h3>
        </ui-flex-grid-item>

        <ui-flex-grid-item slot="right">
            <ui-icon-button
                id="appBarEditButton"
                style="width: 100%; height: 100%;"
                ghost
            >
                <svg-edit2></svg-edit2>
            </ui-icon-button>
        </ui-flex-grid-item>

        <ui-flex-grid-item slot="right">
            <ui-icon-button
                id="appBarTodayButton"
                style="width: 100%; height: 100%;"
                ghost
            >
                <svg-today-outline></svg-today-outline>
            </ui-icon-button>
        </ui-flex-grid-item>

        <ui-flex-grid-item slot="right">
            <ui-icon-button
                id="appBarPDFButton"
                style="width: 100%; height: 100%;"
                ghost
            >
                <svg-pdf-document></svg-pdf-document>
            </ui-icon-button>
        </ui-flex-grid-item>

        <ui-flex-grid-item slot="right">
            <ui-icon-button
                id="appBarSettingsButton"
                style="width: 100%; height: 100%;"
                ghost
            >
                <svg-settings></svg-settings>
            </ui-icon-button>
        </ui-flex-grid-item>
    </ui-app-bar>
`;

/**
 * @typedef {import("./types").UIStoreEvents} UIStoreEvents
 */

export class ShiftSchedulerApp extends HTMLElement {

    static register = () => { // {{{
        if (!customElements.get("ui-theme-handler")) {
            UIThemeHandler.register();
        }

        if (!customElements.get("ui-store")) {
            UIStore.register();
        }

        if (!customElements.get("ui-lang")) {
            UILang.register();
        }

        if (!customElements.get("ui-app-bar")) {
            UIAppBar.register();
        }

        if (!customElements.get("ui-flex-grid-item")) {
            UIFlexGridItem.register();
        }

        if (!customElements.get("ui-icon-button")) {
            UIIconButton.register();
        }

        if (!customElements.get("ui-button")) {
            UIButton.register();
        }

        if (!customElements.get("ui-container")) {
            UIContainer.register();
        }

        if (!customElements.get("ui-stack-layout")) {
            UIStackLayout.register();
        }

        if (!customElements.get("svg-edit2")) {
            SvgEdit2.register();
        }

        if (!customElements.get("svg-settings")) {
            SvgSettings.register();
        }

        if (!customElements.get("svg-pdf-document")) {
            SvgPDF.register();
        }

        if (!customElements.get("svg-today-outline")) {
            SvgToday.register();
        }

        if (!customElements.get("svg-back-arrow-navigation")) {
            SvgBackArrow.register();
        }

        customElements.define("shift-scheduler-app", ShiftSchedulerApp);

        CalendarPage.register();
        SettingsPage.register();

        DatePickerDialog.register();
        PDFDialog.register();
    }; // }}}

    constructor() { // {{{
        super();
        this.innerHTML = content;

        /**
         * @private
         * @type {UIThemeHandler}
         */
        this.uiThemeHandler = this.querySelector("ui-theme-handler");

        /**
         * @private
         * @type {UIStore}
         */
        this.uiStore = this.querySelector("ui-store");

        /**
         * @private
         * @type {UILang}
         */
        this.uiLang = this.querySelector("ui-lang");

        /**
         * @private
         * @type {UIStackLayout}
         */
        this.uiStackLayout = this.querySelector("ui-stack-layout");

        this.cleanup = new CleanUp();

        /**
         * @private
         * @type {UIAppBar}
         */
        this.uiAppBar;

        /**
         * @private
         * @type {UIIconButton}
         */
        this.back;

        /**
         * @private
         * @type {UIButton}
         */
        this.datePicker;

        /**
         * @private
         * @type {UIIconButton}
         */
        this.edit;

        /**
         * @private
         * @type {UIIconButton}
         */
        this.today;

        /**
         * @private
         * @type {UIIconButton}
         */
        this.pdf;

        /**
         * @private
         * @type {UIIconButton}
         */
        this.settings;

        this.createAppBar();

        setTimeout(async () => {
            if (isAndroid()) {
                const handle = await CapApp.addListener(
                    "backButton",
                    () => this.back.click(),
                )
                this.cleanup.add(handle.remove);
            }
        });
    } // }}}

    connectedCallback() {
        this.registerPages();

        this.cleanup.add(
            this.uiStackLayout.ui.events.on(
                "change", this.stackLayoutChange.bind(this)
            ),
        );

        this.cleanup.add(
            this.uiStore.ui.on(
                "date-picker",
                async (dateString) => {
                    const today = new Date();
                    const current = new Date(dateString);

                    const y = current.getFullYear();
                    const m = (current.getMonth() + 1).toString().padStart(2, "0");
                    this.datePicker.innerText = `${y} / ${m}`;

                    if (
                        today.getFullYear() === current.getFullYear() &&
                        today.getMonth() === current.getMonth()
                    ) {
                        this.today.ui.disable();
                    } else {
                        this.today.ui.enable();
                    }
                },
                true,
            ),
        );

        // TODO: Do i need to add a close handler to cleanup?
        db.open(
            async () =>
                this.uiStackLayout.ui.setPage("calendar"),
        );
    }

    disconnectedCallback() {
        this.cleanup.run();
    }

    /**
     * @private
     */
    registerPages() { // {{{
        this.uiStackLayout.ui.registerPage(
            "calendar",
            () => {
                const template = document.createElement("template");

                template.innerHTML = `
                    <calendar-page name="calendar"></calendar-page>
                `;

                return template.content.cloneNode(true);
            },
        );

        this.uiStackLayout.ui.registerPage(
            "settings",
            () => {
                const template = document.createElement("template");

                template.innerHTML = `
                    <settings-page name="settings"></settings-page>
                `;

                return template.content.cloneNode(true);
            }
        );
    } // }}}

    /**
     * @private
     */
    createAppBar() { // {{{
        this.uiAppBar = this.querySelector("ui-app-bar");

        this.back = this.uiAppBar.querySelector("#appBarBackButton")
        this.back.onclick = async () => { // {{{
            if (this.uiStackLayout.ui.stack.length <= 1) {
                return;
            }

            this.uiStackLayout.ui.goBack();
        }; // }}}

        this.datePicker = this.uiAppBar.querySelector("#appBarDatePickerButton")
        this.datePicker.onclick = async () => { // {{{
            const dialog = new DatePickerDialog(this.uiStore, this.uiLang);
            document.body.appendChild(dialog);

            dialog.ui.open(true);

            dialog.ui.events.on("close", () => {
                document.body.removeChild(dialog);
            });
        }; // }}}

        this.edit = this.uiAppBar.querySelector("#appBarEditButton")
        this.edit.onclick = async () => { // {{{
            this.uiStore.ui.update(
                "edit-mode",
                (data) => ({ ...data, open: !data.open }),
            );
        }; // }}}

        this.today = this.uiAppBar.querySelector("#appBarTodayButton")
        this.today.onclick = async () => { // {{{
            const t = new Date();
            this.uiStore.ui.set(
                "date-picker",
                new Date(t.getFullYear(), t.getMonth(), 1).toString(),
            );
        }; // }}}

        this.pdf = this.uiAppBar.querySelector("#appBarPDFButton")
        this.pdf.onclick = async () => { // {{{
            const dialog = new PDFDialog(this.uiStore, this.uiLang);
            document.body.appendChild(dialog);;

            dialog.ui.events.on("close", () => {
                document.body.removeChild(dialog);
            });

            dialog.ui.open(true);
        }; // }}}

        this.settings = this.uiAppBar.querySelector("#appBarSettingsButton")
        this.settings.onclick = async () => { // {{{
            this.uiStackLayout.ui.setPage("settings");
        } // }}}

        this.noPageSetup();
    } // }}}

    /**
     * @private
     */
    noPageSetup() { // {{{
        utils.setAppBarTitle(null)
        this.uiAppBar.removeChild(this.back.parentElement)
        this.uiAppBar.removeChild(this.datePicker.parentElement)
        this.uiAppBar.removeChild(this.edit.parentElement)
        this.uiAppBar.removeChild(this.today.parentElement)
        this.uiAppBar.removeChild(this.pdf.parentElement)
        this.uiAppBar.removeChild(this.settings.parentElement)
    } // }}}

    /**
     * @private
     * @param {Object} data
     * @param {import("ui").UIStackLayoutPage | null} data.newPage 
     * @param {import("ui").UIStackLayoutPage | null} data.oldPage 
     */
    async stackLayoutChange({ newPage, oldPage }) { // {{{
        console.debug(`[app] stack layout changed:`, { newPage, oldPage });

        // Update the AppBar buttons...
        if (this.uiStackLayout.ui.stack.length <= 1) {
            try {
                this.uiAppBar.removeChild(this.back.parentElement);
            } catch { }
        } else {
            const leftSlot = this.uiAppBar.ui.getLeftSlot()
            if (leftSlot.length > 0) {
                this.uiAppBar.insertBefore(
                    this.back.parentElement,
                    leftSlot[0]
                );
            } else {
                this.uiAppBar.appendChild(
                    this.back.parentElement
                );
            }
        }

        if (!newPage) {
            this.noPageSetup();
            return;
        }

        switch (newPage.ui.name) {
            case "calendar":
                this.calendarAppBarLayout();
                break;
            case "settings":
                this.settingsAppBarLayout(oldPage);
                break;
            case "indexeddb-browser":
                this.indexedDBBrowserAppBarLayout();
                break;
            default:
                throw `unknown page "${newPage.ui.name}"`;
        }
    } // }}}

    /**
     * @private
     */
    calendarAppBarLayout() { // {{{
        utils.setAppBarTitle("")
        this.uiAppBar.appendChild(this.datePicker.parentElement)
        this.uiAppBar.appendChild(this.edit.parentElement)
        this.uiAppBar.appendChild(this.today.parentElement)
        this.uiAppBar.appendChild(this.pdf.parentElement)
        this.uiAppBar.appendChild(this.settings.parentElement)
    } // }}}

    /**
     * @private
     * @param {import("ui").UIStackLayoutPage | null} oldPage
     */
    settingsAppBarLayout(oldPage) { // {{{
        utils.setAppBarTitle(this.uiLang.ui.get("settings", "app-bar-title"))

        if (oldPage.ui.name === "calendar") {
            this.uiAppBar.removeChild(this.datePicker.parentElement);
            this.uiAppBar.removeChild(this.edit.parentElement);
            this.uiAppBar.removeChild(this.today.parentElement);
            this.uiAppBar.removeChild(this.pdf.parentElement);
            this.uiAppBar.removeChild(this.settings.parentElement);
        }
    } // }}}

    /**
     * @private
     */
    indexedDBBrowserAppBarLayout() { // {{{
        utils.setAppBarTitle(
            this.uiLang.ui.get("indexeddb-browser", "app-bar-title"),
        );
    } // }}}
}
