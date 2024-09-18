import { CleanUp, UIButton } from "ui";
import { EditShiftDialog } from "../../../dialogs";

/**
 * HTML: `settings-shift-add-button`
 */
export class SettingsShiftAddButton extends UIButton {
    static register = () => {
        customElements.define(
            "settings-shift-add-button",
            SettingsShiftAddButton,
        );
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
        this.ui.variant = "full";
        this.ui.color = "primary";
    }

    connectedCallback() {
        super.connectedCallback();

        this.cleanup.add(
            this.ui.events.on("click", this.clickHandler.bind(this)),
            this.uiStore.ui.on("lang", this.storeHandlerLang.bind(this), true),
        );
    }

    disconnectedCallback() {
        this.cleanup.run();
    }

    /** @private */
    async clickHandler() {
        /**
         * @param {Shift} newShift
         */
        const onSubmit = async (newShift) => {
            // If shift name is missing then reopen the dialog
            if (!newShift.name) {
                alert(this.uiLang.ui.get("edit-shift-alerts", "missing-name"));

                shift = newShift;

                const dialog = new EditShiftDialog();
                dialog.set(shift);

                dialog.ui.events.on("close", () => {
                    document.body.removeChild(dialog);
                });

                dialog.ui.events.on("submit", onSubmit);

                document.body.appendChild(dialog);
                dialog.ui.open(true);
                return;
            }

            if (!newShift.shortName) {
                newShift.shortName = newShift.name.slice(0, 2);
            }

            this.uiStore.ui.update("settings", (settings) => {
                return {
                    ...settings,
                    shifts: [...settings.shifts, newShift],
                };
            });
        };

        /** @type {Shift} */
        let shift = {
            id: new Date().getTime(),
            name: "",
            shortName: "",
            visible: true,
            color: null,
        };

        const dialog = new EditShiftDialog();
        dialog.set(shift);

        dialog.ui.events.on("close", () => {
            document.body.removeChild(dialog);
        });

        dialog.ui.events.on("submit", onSubmit);

        document.body.appendChild(dialog);
        dialog.ui.open(true);
    }

    /** @private */
    async storeHandlerLang() {
        this.innerHTML = this.uiLang.ui.get("settings", "button-add-shift");
    }
}
