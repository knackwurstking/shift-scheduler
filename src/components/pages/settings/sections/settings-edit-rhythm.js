import { CleanUp, UIButton, UILabel, html } from "ui";
import { EditRhythmDialog } from "../../../dialogs";

/**
 * HTML: `settings-edit-rhythm`
 */
export class SettingsEditRhythm extends HTMLElement {
    static register = () => {
        customElements.define("settings-edit-rhythm", SettingsEditRhythm);
    };

    constructor() {
        super();

        this.cleanup = new CleanUp();

        /** @type {SchedulerStore} */
        this.uiStore = document.querySelector("ui-store");
        /** @type {import("ui").UILang} */
        this.uiLang = document.querySelector("ui-lang");

        this.label;
    }

    render() {
        this.innerHTML = html`
            <ui-label ripple>
                <ui-button
                    slot="input"
                    color="primary"
                    variant="full"
                ></ui-button>
            </ui-label>
        `;

        /** @type {UILabel} */
        this.label = this.querySelector("ui-label");

        /** @type {UIButton} */
        const button = this.label.ui.inputSlot[0];
        button.onclick = async () => {
            const dialog = new EditRhythmDialog();

            dialog.ui.events.on("close", async () => {
                document.body.removeChild(dialog);
            });

            document.body.appendChild(dialog);
            dialog.ui.open(true);
        };
    }

    connectedCallback() {
        this.cleanup.add(
            this.uiStore.ui.on("lang", this.storeHandlerLang.bind(this), true),
        );
    }

    disconnectedCallback() {
        this.cleanup.run();
    }

    /** @private */
    async storeHandlerLang() {
        this.label.ui.primary = this.uiLang.ui.get(
            "settings",
            "label-primary-edit-rhythm",
        );
        this.label.ui.inputSlot[0].innerHTML = this.uiLang.ui.get(
            "settings",
            "button-edit-rhythm",
        );
    }
}
