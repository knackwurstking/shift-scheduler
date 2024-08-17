import { CleanUp, html, UIDialog, UISelectOption } from "ui";
import { db, utils } from "../../lib";
import { style } from "../../data/constants";

/**
 * HTML: `edit-day-dialog`
 *
 * @extends {UIDialog<import("ui").UIDialog_Events & { submit: DB_Entry }>}
 */
export class EditDayDialog extends UIDialog {
    static register = () => {
        customElements.define("edit-day-dialog", EditDayDialog);
    };

    constructor() {
        super("");

        this.cleanup = new CleanUp();

        /** @type {SchedulerStore} */
        this.uiStore = document.querySelector("ui-store");

        /** @type {import("ui").UILang} */
        this.uiLang = document.querySelector("ui-lang");

        /** @type {import("ui").UIStackLayout} */
        this.stackLayout = document.querySelector("ui-stack-layout");

        this.data = null;

        this.select;
        this.notes;

        this.cancelAction;
        this.submitAction;

        this.rhythmShift;

        this.render();
    }

    render() {
        this.innerHTML = html`
            <ui-flex-grid style="${style.dialog.flexGrid}" gap="0.5rem">
                <ui-flex-grid-item>
                    <ui-select></ui-select>
                </ui-flex-grid-item>

                <ui-flex-grid-item>
                    <ui-textarea rows="6"></ui-textarea>
                </ui-flex-grid-item>
            </ui-flex-grid>
        `;

        // Shift select
        /** @type {import("ui").UISelect} */
        this.select = this.querySelector("ui-select");

        this.select.ui.events.on("change", (selectOption) => {
            this.data.shift =
                this.uiStore.ui
                    .get("settings")
                    .shifts.find(
                        (shift) =>
                            shift.id.toString() === selectOption.ui.value,
                    ) || null;
        });

        // NOTE: Reset shift (value: 0)
        let option = new UISelectOption();
        option.ui.value = "0";
        option.innerHTML = this.uiLang.ui.get("edit-day-dialog", "reset");

        // Set shifts as options for select
        this.select.append(
            ...this.uiStore.ui.get("settings").shifts.map((shift) => {
                const item = new UISelectOption();

                item.ui.value = shift.id.toString();
                item.innerHTML = shift.name;

                return item;
            }),
        );

        // Notes textarea
        /** @type {import("ui").UITextarea<import("ui").UITextarea_Events>} */
        this.notes = this.querySelector("ui-textarea");
        this.notes.oninput = () => {
            this.data.note = this.notes.ui.value;
        };

        this.cancelAction = UIDialog.createAction({
            color: "secondary",
            onClick: () => {
                this.ui.close();
            },
        });

        this.appendChild(this.cancelAction.container);

        this.submitAction = UIDialog.createAction({
            color: "primary",
            onClick: async () => {
                if (this.data.shift === this.rhythmShift) {
                    this.data.shift = null;
                }

                if (!this.data.note && !this.data.shift) {
                    try {
                        db.delete(
                            this.data.year,
                            this.data.month,
                            this.data.date,
                        );
                    } catch (err) {
                        alert(err);
                    }
                } else {
                    try {
                        await db.add(this.data);
                    } catch {
                        try {
                            await db.put(this.data);
                        } catch (err) {
                            alert(err);
                        }
                    }
                }

                this.ui.events.dispatch("submit", {
                    ...this.data,
                    shift: this.data.shift || this.rhythmShift,
                });

                this.ui.close();
            },
        });

        this.appendChild(this.submitAction.container);
    }

    connectedCallback() {
        super.connectedCallback();

        this.stackLayout.ui.lock = true;

        this.cleanup.add(
            this.uiStore.ui.on(
                "lang",
                () => {
                    this.notes.ui.title = this.uiLang.ui.get(
                        "edit-day-dialog",
                        "textarea-title-notes",
                    );

                    this.cancelAction.action.innerText = this.uiLang.ui.get(
                        "edit-day-dialog",
                        "button-cancel",
                    );
                    this.submitAction.action.innerText = this.uiLang.ui.get(
                        "edit-day-dialog",
                        "button-submit",
                    );
                },
                true,
            ),
        );
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.stackLayout.ui.lock = false;
        this.cleanup.run();
    }

    /**
     * @param {number} year
     * @param {number} month
     * @param {number} date
     */
    async set(year, month, date) {
        const m = (month + 1).toString().padStart(2, "0");
        const d = date.toString().padStart(2, "0");
        this.ui.title = `${year}/${m}/${d}`;

        /** @type {DB_Entry | null} */
        this.data = await db.get(year, month, date);

        /** @type {Shift} */
        this.rhythmShift = utils.calendar.calcShiftForDay(
            new Date(year, month, date),
            this.uiStore.ui.get("settings"),
        );

        if (this.data === null) {
            this.data = {
                year,
                month,
                date,
                shift: null,
                note: "",
            };
        }

        this.selectShift(this.data.shift || this.rhythmShift);
        this.notes.ui.value = this.data.note || "";
    }

    /**
     * @private
     * @param {Shift | null} shift
     */
    selectShift(shift) {
        Array.from(this.select.children).forEach(
            (/** @type {UISelectOption} */ child) => {
                child.ui.selected =
                    shift?.id.toString() === child.ui.value ||
                    (!shift && child.ui.value === "0");
            },
        );
    }
}
