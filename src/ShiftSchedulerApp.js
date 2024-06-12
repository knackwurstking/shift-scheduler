import { App as CapApp } from "@capacitor/app";
import {
    SvgBackArrow,
    SvgEdit,
    SvgPDF,
    SvgSettings,
    SvgToday,
    UIAppBar,
    UIButton,
    UIContainer,
    UIFlexGridItem,
    UIIconButton,
    UILang,
    UILangType,
    UIStackLayout,
    UIStore,
    UIThemeHandler,
} from "ui";
import { CleanUp, html, isAndroid } from "ui/src/js";
import db from "./db";
import { DatePickerDialog, PDFDialog } from "./dialogs";
import { CalendarPage, SettingsPage } from "./pages";
import { setAppBarTitle, setTheme } from "./utils";

// {{{ HTML Content
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
            class="flex align-center justify-center"
        >
            <ui-icon-button
                id="appBarBackButton"
                ghost
            >
                <svg-back-arrow></svg-back-arrow>
            </ui-icon-button>
        </ui-flex-grid-item>

        <ui-flex-grid-item
            slot="left"
            style="padding: calc(var(--ui-spacing) / 2)"
        >
            <ui-button
                id="appBarDatePickerButton"
                style="height: 100%; white-space: nowrap;"
                variant="outline"
                color="primary"
            ></ui-button>
        </ui-flex-grid-item>

        <ui-flex-grid-item slot="center" class="flex align-center">
            <h4
                class="app-bar-title"
                style="white-space: nowrap;"
            >
            </h4>
        </ui-flex-grid-item>

        <ui-flex-grid-item
            slot="right"
            class="flex align-center justify-center"
        >
            <ui-icon-button
                id="appBarEditButton"
                ghost
            >
                <svg-edit></svg-edit>
            </ui-icon-button>
        </ui-flex-grid-item>

        <ui-flex-grid-item
            slot="right"
            class="flex align-center justify-center"
        >
            <ui-icon-button
                id="appBarTodayButton"
                ghost
            >
                <svg-today></svg-today>
            </ui-icon-button>
        </ui-flex-grid-item>

        <ui-flex-grid-item
            slot="right"
            class="flex align-center justify-center"
        >
            <ui-icon-button
                id="appBarPDFButton"
                ghost
            >
                <svg-pdf></svg-pdf>
            </ui-icon-button>
        </ui-flex-grid-item>

        <ui-flex-grid-item
            slot="right"
            class="flex align-center justify-center"
        >
            <ui-icon-button
                id="appBarSettingsButton"
                ghost
            >
                <svg-settings></svg-settings>
            </ui-icon-button>
        </ui-flex-grid-item>
    </ui-app-bar>
`;
// }}}

/**
 * @typedef {import("./types").UIStoreEvents} UIStoreEvents
 */

export class ShiftSchedulerApp extends HTMLElement {

    static register = () => { // {{{
        UIThemeHandler.register();
        UIStore.register();
        UILang.register();
        UILangType.register();
        UIAppBar.register();
        UIFlexGridItem.register();
        UIIconButton.register();
        UIButton.register();
        UIContainer.register();
        UIStackLayout.register();
        SvgEdit.register();
        SvgSettings.register();
        SvgPDF.register();
        SvgToday.register();
        SvgBackArrow.register();

        CalendarPage.register();
        SettingsPage.register();

        DatePickerDialog.register();
        PDFDialog.register();

        customElements.define("shift-scheduler-app", ShiftSchedulerApp);
    }; // }}}

    constructor() { // {{{
        super();
        this.innerHTML = content;
        this.style.width = "100%";
        this.style.height = "100%";
        this.style.overflow = "hidden";

        /**
         * @private
         * @type {UIThemeHandler}
         */
        this.uiThemeHandler = this.querySelector("ui-theme-handler");

        /**
         * @private
         * @type {UIStore<import("./types").UIStoreEvents>}
         */
        this.uiStore = this.querySelector("ui-store");
        this.setupUIStore();

        /**
         * @private
         * @type {UILang}
         */
        this.uiLang = this.querySelector("ui-lang");

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

        this.createStackLayout();
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

    connectedCallback() { // {{{

        for (const l of ["en", "de"]) {
            if (navigator.language.match(new RegExp(`^${l}`, "i"))) {
                this.uiLang.setAttribute("current", l);
                break;
            }
            // NOTE: No need for iterating through `navigator.languages`,
            //       only two languages are supported for now.
        }

        if (!this.uiLang.hasAttribute("current")) {
            this.uiLang.setAttribute("current", this.uiLang.ui.getFallbackElement().ui.name);
        }

        this.cleanup.add(
            this.uiLang.ui.on(
                "change",
                (ltElement) => { // {{{
                    if (!ltElement) {
                        return;
                    }

                    this.uiStore.ui.set("lang", ltElement.ui.name);
                }, // }}}
                true,
            ),
        );

        this.cleanup.add(
            this.uiStackLayout.ui.events.on(
                "change", this.stackLayoutChange.bind(this),
            ),
        );

        this.cleanup.add(
            this.uiStore.ui.on(
                "date-picker",
                async (dateString) => { // {{{
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
                }, // }}}
                true,
            ),
        );

        // TODO: Do i need to add a close handler for cleanup?
        db.open(async () => this.uiStackLayout.ui.setPage("calendar"));
    } // }}}

    disconnectedCallback() {
        this.cleanup.run();
    }

    /**
     * @private
     */
    setupUIStore() { // {{{
        const t = new Date();
        this.uiStore.ui.set(
            "date-picker",
            new Date(t.getFullYear(), t.getMonth(), 1).toString(),
            true,
        );

        this.uiStore.ui.set("theme", { mode: "system", name: "zinc" }, true);
        this.uiStore.ui.set("week-start", 0, true);
        this.uiStore.ui.set("settings", { shifts: [], rhythm: [], startDate: "" }, true);
        this.uiStore.ui.set("edit-mode", { open: false, active: null }, true);

        this.uiStore.ui.on("theme", (data) => {
            setTheme(data, document.querySelector("ui-theme-handler"));
        }, true);
    } // }}}

    /**
     * @private
     */
    createStackLayout() { // {{{
        /**
         * @private
         * @type {UIStackLayout}
         */
        this.uiStackLayout = this.querySelector("ui-stack-layout");

        this.pages = {
            calendar: new CalendarPage(),
            settings: new SettingsPage(),
        };

        this.uiStackLayout.ui.registerPage(
            this.pages.calendar.ui.name,
            () => {
                return this.pages.calendar;
            },
        );

        this.uiStackLayout.ui.registerPage(
            this.pages.settings.ui.name,
            () => {
                return this.pages.settings;
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
            if (this.uiStackLayout.ui.stackSize() <= 1) {
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
        setAppBarTitle(null)
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
        // Update the AppBar buttons...
        if (this.uiStackLayout.ui.stackSize() <= 1) {
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
        setAppBarTitle("")
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
        setAppBarTitle(this.uiLang.ui.get("settings", "app-bar-title"))

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
        setAppBarTitle(
            this.uiLang.ui.get("indexeddb-browser", "app-bar-title"),
        );
    } // }}}
}
