import svgPen from "ui/src/svg/smoothie-line-icons/pen";
import svgTrash from "ui/src/svg/smoothie-line-icons/trash";

import { CleanUp, draggable, html, styles } from "ui";
import { EditShiftDialog } from "../../../dialogs";

/**
 * HTML: `settings-shifts-table`
 */
export class SettingsShiftsTable extends HTMLTableElement {
    static register = () => {
        customElements.define("settings-shifts-table", SettingsShiftsTable, {
            extends: "table",
        });
    };

    constructor() {
        super();

        this.cleanup = new CleanUp();

        /** @type {SchedulerStore} */
        this.uiStore = document.querySelector("ui-store");
        /** @type {import("ui").UILang} */
        this.uiLang = document.querySelector("ui-lang");

        this.render();
    }

    render() {
        this.innerHTML = html`
            <thead>
                <tr>
                    <th style="text-align: left;"></th>
                    <th style="text-align: left;"></th>
                    <th style="text-align: right;"></th>
                </tr>
            </thead>

            <tbody></tbody>
        `;

        this.tbody = this.querySelector("tbody");
    }

    connectedCallback() {
        this.cleanup.add(
            this.uiStore.ui.on(
                "settings",
                (data) => {
                    this.renderShiftsTable(data);
                },
                true,
            ),

            this.uiStore.ui.on("lang", this.storeHandlerLang.bind(this), true),
        );
    }

    disconnectedCallback() {
        this.cleanup.run();
    }

    /**
     * @private
     * @param {SchedulerStore_Settings} settings
     */
    renderShiftsTable(settings) {
        while (!!this.tbody.firstChild)
            this.tbody.removeChild(this.tbody.firstChild);

        settings.shifts.forEach((shift) => {
            this.appendChild(this.createTableRow(shift));
        });

        draggable.createMobile(this.tbody, {
            onDragEnd: () => {
                settings.shifts = Array.from(this.tbody.children).map((child) =>
                    JSON.parse(child.getAttribute("data-json")),
                );

                this.uiStore.ui.set("settings", settings);
            },
        });
    }

    /**
     * @private
     * @param {Shift} shift
     */
    createTableRow(shift) {
        const tr = document.createElement("tr");

        tr.setAttribute("data-json", JSON.stringify(shift));

        tr.innerHTML = html`
            <td style="text-align: left;">${shift.name}</td>

            <td
                style="${styles({
                    textAlign: "left",
                    color: shift.color || "inherit",
                })};"
            >
                ${shift.visible ? shift.shortName : ""}
            </td>

            <td style="text-align: right;">
                <ui-flex-grid-row
                    style="justify-content: flex-end;"
                    gap="0.25rem"
                >
                    <ui-flex-grid-item flex="0">
                        <ui-icon-button name="pen" ghost>
                            ${svgPen}
                        </ui-icon-button>
                    </ui-flex-grid-item>

                    <ui-flex-grid-item flex="0">
                        <ui-icon-button name="trash" color="destructive" ghost>
                            ${svgTrash}
                        </ui-icon-button>
                    </ui-flex-grid-item>
                </ui-flex-grid-row>
            </td>
        `;

        /** @type {import("ui").UIIconButton} */
        const edit = tr.querySelector(`ui-icon-button[name="pen"]`);
        edit.addEventListener("click", () => this.clickHandlerEdit(shift));

        /** @type {import("ui").UIIconButton} */
        const trash = tr.querySelector(`ui-icon-button[name="trash"]`);
        trash.addEventListener("click", () => this.clickHandlerRemove(shift));

        return tr;
    }

    /**
     * @private
     * @param {Shift} shift
     */
    async clickHandlerEdit(shift) {
        const dialog = new EditShiftDialog();
        dialog.set(shift);

        dialog.ui.events.on("close", () => {
            document.body.removeChild(dialog);
        });

        dialog.ui.events.on("submit", (shift) => {
            this.uiStore.ui.update("settings", (settings) => {
                return {
                    ...settings,
                    shifts: settings.shifts.map((s) => {
                        if (s.id === shift.id) {
                            return shift;
                        }

                        return s;
                    }),
                };
            });
        });

        document.body.appendChild(dialog);
        dialog.ui.open(true);
    }

    /**
     * @private
     * @param {Shift} shift
     */
    async clickHandlerRemove(shift) {
        const message = this.uiLang.ui
            .get("settings", "confirm-delete-shift")
            .replace("%s", shift.name);

        if (!window.confirm(message)) return;

        this.uiStore.ui.update("settings", (settings) => {
            return {
                ...settings,
                shifts: settings.shifts.filter((s) => s.id !== shift.id),
            };
        });
    }

    /** @private */
    async storeHandlerLang() {
        Array.from(this.querySelectorAll("thead th")).forEach((th, i) => {
            switch (i) {
                case 0:
                    th.innerHTML = this.uiLang.ui.get(
                        "settings",
                        "table-header-name",
                    );
                    break;
                case 1:
                    th.innerHTML = this.uiLang.ui.get(
                        "settings",
                        "table-header-short-name",
                    );
                    break;
            }
        });
    }
}
