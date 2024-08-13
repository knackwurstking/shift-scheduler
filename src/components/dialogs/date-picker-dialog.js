import { CleanUp, html, UIDialog, UIFlexGridItem } from "ui";

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
    /** @type {import("ui").UIButton} */
    this.cancel;
    /** @type {import("ui").UIButton} */
    this.submit;

    this.render();
  }

  render() {
    this.innerHTML = html`
      <ui-flex-grid gap="0.5rem">
        <ui-flex-grid-item>
          <ui-input type="month" value=""></ui-input>
        </ui-flex-grid-item>
      </ui-flex-grid>
    `;

    this.input = this.querySelector("ui-input");

    this.appendChild(this.createCancelAction());
    this.appendChild(this.createSubmitAction());
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
          this.ui.title = this.uiLang.ui.get("date-picker-dialog", "title");

          this.input.ui.title = this.uiLang.ui.get(
            "date-picker-dialog",
            "input-title-month",
          );

          this.cancel.innerText = this.uiLang.ui.get(
            "date-picker-dialog",
            "button-cancel",
          );

          this.submit.innerText = this.uiLang.ui.get(
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

  /** @private */
  createCancelAction() {
    const item = new UIFlexGridItem();

    item.slot = "actions";
    item.setAttribute("flex", "0");

    item.innerHTML = html`
      <ui-button variant="full" color="secondary"></ui-button>
    `;

    this.cancel = item.querySelector("ui-button");
    this.cancel.ui.events.on("click", () => {
      this.ui.close();
    });

    return item;
  }

  /** @private */
  createSubmitAction() {
    const item = new UIFlexGridItem();

    item.slot = "actions";
    item.setAttribute("flex", "0");

    item.innerHTML = html`
      <ui-button variant="full" color="primary"></ui-button>
    `;

    this.submit = item.querySelector("ui-button");
    this.submit.ui.events.on("click", () => {
      this.uiStore.ui.set(
        "date-picker",
        new Date(this.input.ui.value).toString(),
      );

      this.ui.close();
    });

    return item;
  }
}
