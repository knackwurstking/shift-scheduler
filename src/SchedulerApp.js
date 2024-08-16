import { App as CapApp } from "@capacitor/app";
import { CleanUp, html, isAndroid } from "ui";
import {
    CalendarPage,
    DatePickerDialog,
    EditDayDialog,
    EditRhythmDialog,
    EditShiftDialog,
    IndexedDBBrowserPage,
    PDFDialog,
    SchedulerAppBar,
    SettingsPage,
    ShiftCard,
} from "./components";
import { pages } from "./data/constants";
import { db, utils } from "./lib";

export class SchedulerApp extends HTMLElement {
    static register = () => {
        DatePickerDialog.register();
        EditDayDialog.register();
        EditRhythmDialog.register();
        EditShiftDialog.register();
        PDFDialog.register();

        SchedulerAppBar.register();
        ShiftCard.register();

        CalendarPage.register();
        SettingsPage.register();
        IndexedDBBrowserPage.register();

        customElements.define("scheduler-app", SchedulerApp);
    };

    constructor() {
        super();
        this.cleanup = new CleanUp();

        /** @type {SchedulerStore} */
        this.uiStore;

        /** @type {import("ui").UIStackLayout} */
        this.uiStackLayout;

        /** @type {import("ui").UILang} */
        this.uiLang;

        /** @type {SchedulerAppBar} */
        this.schedulerAppBar;

        this.render();
    }

    render() {
        this.innerHTML = html`
            <ui-theme-handler auto></ui-theme-handler>

            <ui-store storageprefix="shift-scheduler:" storage></ui-store>

            <ui-lang>
                <ui-lang-type
                    name="en"
                    href="/lang/en.json"
                    fallback
                ></ui-lang-type>
                <ui-lang-type name="de" href="/lang/de.json"></ui-lang-type>
            </ui-lang>

            <ui-container style="width: 100%; height: 100%;">
                <ui-stack-layout></ui-stack-layout>
            </ui-container>

            <scheduler-app-bar></scheduler-app-bar>
        `;

        this.uiStore = this.querySelector("ui-store");
        this.uiLang = this.querySelector("ui-lang");
        this.uiStackLayout = this.querySelector("ui-stack-layout");

        this.schedulerAppBar = this.querySelector("scheduler-app-bar");

        this.createStore();
        this.createLang();
        this.createStackLayout();
    }

    connectedCallback() {
        setTimeout(async () => {
            if (isAndroid()) {
                this.cleanup.add(
                    (
                        await CapApp.addListener("backButton", () =>
                            this.schedulerAppBar.items.back.ui.child.click(),
                        )
                    ).remove,
                );
            }
        });

        this.cleanup.add(
            this.uiStore.ui.on(
                "theme",
                (data) => {
                    utils.setTheme(
                        data,
                        document.querySelector("ui-theme-handler"),
                    );
                },
                true,
            ),

            this.uiStore.ui.on(
                "date-picker",
                async (dateString) => {
                    const today = new Date();
                    const current = new Date(dateString);

                    const y = current.getFullYear();
                    const m = (current.getMonth() + 1)
                        .toString()
                        .padStart(2, "0");
                    this.schedulerAppBar.items.datePicker.ui.child.innerText = `${y} / ${m}`;

                    if (
                        today.getFullYear() === current.getFullYear() &&
                        today.getMonth() === current.getMonth()
                    ) {
                        this.schedulerAppBar.items.today.ui.child.ui.disabled = true;
                    } else {
                        this.schedulerAppBar.items.today.ui.child.ui.disabled = false;
                    }
                },
                true,
            ),
        );

        db.open(async () => this.uiStackLayout.ui.set("calendar"));
    }

    disconnectedCallback() {
        this.cleanup.run();
    }

    createStore() {
        const date = new Date();
        this.uiStore.ui.set(
            "date-picker",
            new Date(date.getFullYear(), date.getMonth(), 1).toString(),
            true,
        );

        this.uiStore.ui.set("theme", { mode: "system", name: "zinc" }, true);
        this.uiStore.ui.set("week-start", 0, true);

        this.uiStore.ui.set(
            "settings",
            { shifts: [], rhythm: [], startDate: "" },
            true,
        );

        this.uiStore.ui.set("edit-mode", { open: false, active: null }, true);
    }

    createStackLayout() {
        this.uiStackLayout.ui.events.on("change", ({ newPage }) => {
            if (this.uiStackLayout.ui.size() > 1) {
                this.schedulerAppBar.items.back.ui.show();
            } else {
                this.schedulerAppBar.items.back.ui.hide();
            }

            if (!newPage) {
                this.noPageSetup();
                return;
            }

            switch (newPage.ui.name) {
                case pages.calendar:
                case pages.settings:
                case pages.dbBrowser:
                    this.resetAppBar();
                    break;
            }

            switch (newPage.ui.name) {
                case pages.calendar:
                    this.schedulerAppBar.items.datePicker.ui.show();
                    this.schedulerAppBar.items.edit.ui.show();
                    this.schedulerAppBar.items.today.ui.show();
                    this.schedulerAppBar.items.pdf.ui.show();
                    this.schedulerAppBar.items.settings.ui.show();
                    break;

                case pages.settings:
                    this.schedulerAppBar.items.title.ui.child.innerHTML =
                        this.uiLang.ui.get(pages.settings, "app-bar-title");
                    break;

                case pages.dbBrowser:
                    this.schedulerAppBar.items.title.ui.child.innerHTML =
                        this.uiLang.ui.get(pages.dbBrowser, "app-bar-title");
                    break;
            }
        });

        this.uiStackLayout.ui.register(pages.calendar, () => {
            return new CalendarPage();
        });

        this.uiStackLayout.ui.register(pages.settings, () => {
            return new SettingsPage();
        });

        this.uiStackLayout.ui.register(pages.dbBrowser, () => {
            return new IndexedDBBrowserPage();
        });

        this.noPageSetup();
    }

    createLang() {
        this.uiLang.ui.events.on("change", (ltElement) => {
            if (!ltElement) {
                return;
            }

            console.debug(`[SchedulerApp] Set language:`, ltElement);
            this.uiStore.ui.set("lang", ltElement.ui.name);
        });

        // Iinitialize language
        for (const l of ["en", "de"]) {
            if (navigator.language.match(new RegExp(`^${l}`, "i"))) {
                this.uiLang.setAttribute("current", l);
                break;
            }
            // NOTE: No need for iterating through `navigator.languages`,
            //       only two languages are supported for now.
        }

        if (!this.uiLang.hasAttribute("current")) {
            this.uiLang.setAttribute(
                "current",
                this.uiLang.ui.fallback().ui.name,
            );
        }
    }

    resetAppBar() {
        this.schedulerAppBar.items.datePicker.ui.hide();
        this.schedulerAppBar.items.edit.ui.hide();
        this.schedulerAppBar.items.today.ui.hide();
        this.schedulerAppBar.items.pdf.ui.hide();
        this.schedulerAppBar.items.settings.ui.hide();
    }

    noPageSetup() {
        this.schedulerAppBar.items.title.ui.child.innerHTML = "";
        this.resetAppBar();
    }
}
