import svgChevronLeft from "ui/src/svg/smoothie-line-icons/chevron-left";
import svgPen from "ui/src/svg/smoothie-line-icons/pen";
import svgPrinter from "ui/src/svg/smoothie-line-icons/printer";
import svgSettings from "ui/src/svg/smoothie-line-icons/settings";
import svgToday from "ui/src/svg/smoothie-line-icons/today";

import { html, UIAppBar } from "ui";
import { DatePickerDialog, PDFDialog } from "..";

/**
 * HTML: `scheduler-app-bar`
 */
export class SchedulerAppBar extends UIAppBar {
    static register = () => {
        customElements.define("scheduler-app-bar", SchedulerAppBar);
    };

    constructor() {
        super();

        /** @type {SchedulerStore} */
        this.uiStore = document.querySelector("ui-store");

        /** @type {import("ui").UIStackLayout} */
        this.uiStackLayout = document.querySelector("ui-stack-layout");

        /** @type {import("ui").UILang} */
        this.uiLang = document.querySelector("ui-lang");

        this.items;

        this.render();
    }

    render() {
        this.ui.position = "top";

        this.innerHTML = html`
            <ui-app-bar-item name="back" slot="left">
                <ui-icon-button ghost> ${svgChevronLeft} </ui-icon-button>
            </ui-app-bar-item>

            <ui-app-bar-item name="date-picker" slot="left">
                <ui-button
                    style="height: 100%; white-space: nowrap;"
                    variant="outline"
                    color="primary"
                ></ui-button>
            </ui-app-bar-item>

            <ui-app-bar-item name="title" slot="center">
                <h4 style="white-space: nowrap;"></h4>
            </ui-app-bar-item>

            <ui-app-bar-item name="edit" slot="right">
                <ui-icon-button ghost> ${svgPen} </ui-icon-button>
            </ui-app-bar-item>

            <ui-app-bar-item name="today" slot="right">
                <ui-icon-button ghost> ${svgToday} </ui-icon-button>
            </ui-app-bar-item>

            <ui-app-bar-item name="pdf" slot="right">
                <ui-icon-button ghost> ${svgPrinter} </ui-icon-button>
            </ui-app-bar-item>

            <ui-app-bar-item name="settings" slot="right">
                <ui-icon-button ghost> ${svgSettings} </ui-icon-button>
            </ui-app-bar-item>
        `;

        this.items = {
            back: this.createBackItem(),
            datePicker: this.createDatePickerItem(),

            /** @type {import("ui").UIAppBarItem<HTMLElement>} */
            title: this.querySelector(`[name="title"]`),

            edit: this.createEditItem(),
            today: this.createTodayItem(),
            pdf: this.createPDFItem(),
            settings: this.createSettingsItem(),
        };
    }

    /** @private */
    createBackItem() {
        /** @type {import("ui").UIAppBarItem<import("ui").UIIconButton>} */
        const item = this.querySelector(`[name="back"]`);

        item.ui.child.ui.events.on("click", async () => {
            if (this.uiStackLayout.ui.size() > 1) {
                this.uiStackLayout.ui.goBack();
            }
        });

        return item;
    }

    /** @private */
    createDatePickerItem() {
        /** @type {import("ui").UIAppBarItem<import("ui").UIButton>} */
        const item = this.querySelector(`[name="date-picker"]`);

        item.ui.child.ui.events.on("click", async () => {
            const dialog = new DatePickerDialog();

            dialog.ui.events.on("close", () => {
                document.body.removeChild(dialog);
            });

            document.body.appendChild(dialog);
            dialog.ui.open(true);
        });

        return item;
    }

    /** @private */
    createEditItem() {
        /** @type {import("ui").UIAppBarItem<import("ui").UIIconButton>} */
        const item = this.querySelector(`[name="edit"]`);

        item.ui.child.ui.events.on("click", async () => {
            this.uiStore.ui.update("edit-mode", (data) => ({
                ...data,
                open: !data.open,
            }));
        });

        return item;
    }

    /** @private */
    createTodayItem() {
        /** @type {import("ui").UIAppBarItem<import("ui").UIIconButton>} */
        const item = this.querySelector(`[name="today"]`);

        item.ui.child.ui.events.on("click", async () => {
            const t = new Date();
            this.uiStore.ui.set(
                "date-picker",
                new Date(t.getFullYear(), t.getMonth(), 1).toString(),
            );
        });

        return item;
    }

    createPDFItem() {
        /** @type {import("ui").UIAppBarItem<import("ui").UIIconButton>} */
        const item = this.querySelector(`[name="pdf"]`);

        item.ui.child.ui.events.on("click", async () => {
            const dialog = new PDFDialog();
            document.body.appendChild(dialog);

            dialog.ui.events.on("close", () => {
                document.body.removeChild(dialog);
            });

            dialog.ui.open(true);
        });

        return item;
    }

    createSettingsItem() {
        /** @type {import("ui").UIAppBarItem<import("ui").UIIconButton>} */
        const item = this.querySelector(`[name="settings"]`);

        item.ui.child.ui.events.on("click", async () => {
            console.debug("app-bar settings clicked");
            this.uiStackLayout.ui.set("settings", () => {
                console.debug("open settings page");
            });
        });

        return item;
    }
}
