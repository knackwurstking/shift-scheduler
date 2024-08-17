import { CleanUp, html, UIDialog } from "ui";
import { style } from "../../data/constants";

/**
 * HTML: `date-picker-dialog`
 *
 * @extends {UIDialog<import("ui").UIDialog_Events>}
 */
export class DatePickerDialog extends UIDialog {
    static register = () => {
        customElements.define("date-picker-dialog", DatePickerDialog);
    };

    constructor() {
        super("");

        /** @type {SchedulerStore} */
        this.uiStore = document.querySelector("ui-store");
        /** @type {import("ui").UILang} */
        this.uiLang = document.querySelector("ui-lang");
        /** @type {import("ui").UIStackLayout} */
        this.stackLayout = document.querySelector("ui-stack-layout");

        this.cleanup = new CleanUp();

        /** @type {import("ui").UIInput<import("ui").UIInput_Events>} */
        this.input;

        this.cancelAction;
        this.submitAction;

        this.render();
    }

    render() {
        this.innerHTML = html`
            <ui-flex-grid
                style="${style.datePickerDialog.flexGrid}"
                gap="0.5rem"
            >
                <ui-flex-grid-item>
                    <ui-input type="month" value=""></ui-input>
                </ui-flex-grid-item>
            </ui-flex-grid>
        `;

        this.input = this.querySelector("ui-input");

        this.cancelAction = UIDialog.createAction({
            variant: "full",
            color: "secondary",
            onClick: () => {
                this.ui.close();
            },
        });
        this.appendChild(this.cancelAction.container);

        this.submitAction = UIDialog.createAction({
            variant: "full",
            color: "primary",
            onClick: () => {
                this.uiStore.ui.set(
                    "date-picker",
                    new Date(this.input.ui.value).toString(),
                );

                this.ui.close();
            },
        });
        this.appendChild(this.submitAction.container);
    }

    connectedCallback() {
        super.connectedCallback();

        this.stackLayout.ui.lock = true;

        const date = new Date(this.uiStore.ui.get("date-picker"));
        this.input.ui.value = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;

        this.cleanup.add(
            this.uiStore.ui.on(
                "lang",
                () => {
                    this.ui.title = this.uiLang.ui.get(
                        "date-picker-dialog",
                        "title",
                    );

                    this.input.ui.title = this.uiLang.ui.get(
                        "date-picker-dialog",
                        "input-title-month",
                    );

                    this.cancelAction.action.innerText = this.uiLang.ui.get(
                        "date-picker-dialog",
                        "button-cancel",
                    );

                    this.submitAction.action.innerText = this.uiLang.ui.get(
                        "date-picker-dialog",
                        "button-submit",
                    );
                },
                true,
            ),
        );
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.cleanup.run();
        this.stackLayout.ui.lock = false;
    }
}
