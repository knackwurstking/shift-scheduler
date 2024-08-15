import { CleanUp, html, UIDialog, UIInput } from "ui";

/**
 * @extends {UIDialog<import("ui").UIDialog_Events & { submit: Shift }>}
 */
export class EditShiftDialog extends UIDialog {
  static register = () => {
    customElements.define("edit-shift-dialog", EditShiftDialog);
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

    this.colorReset;

    this.inputName;
    this.inputShortName;
    this.labelColorPicker;
    this.labelDefaultColor;
    this.labelVisible;

    this.shift;

    this.cancelAction;
    this.submitAction;

    this.render();
  }

  render() {
    this.innerHTML = html`
      <ui-flex-grid gap="0.5rem">
        <ui-flex-grid-item>
          <ui-input name="name" type="text"></ui-input>
        </ui-flex-grid-item>

        <ui-flex-grid-item>
          <ui-input name="short-name" type="text"></ui-input>
        </ui-flex-grid-item>

        <ui-flex-grid-item>
          <ui-label name="color-picker">
            <input
              name="color-picker"
              slot="input"
              style="width: 100%; min-width: 4rem;"
              type="color"
            />
          </ui-label>
        </ui-flex-grid-item>

        <ui-flex-grid-item>
          <ui-label name="default-color" ripple>
            <input name="default-color" slot="input" type="checkbox" />
          </ui-label>
        </ui-flex-grid-item>

        <ui-flex-grid-item>
          <ui-label name="visible" ripple>
            <input name="visible" slot="input" type="checkbox" />
          </ui-label>
        </ui-flex-grid-item>
      </ui-flex-grid>
    `;

    /** @type {import("ui").UIInput<import("ui").UIInput_Events>} */
    this.inputName = this.querySelector(`ui-input[name="name"]`);
    this.inputName.ui.events.on("input", async (value) => {
      this.shift.name = value;
    });

    /** @type {import("ui").UIInput<import("ui").UIInput_Events>} */
    this.inputShortName = this.querySelector(`ui-input[name="short-name"]`);
    this.inputShortName.ui.events.on("input", (value) => {
      this.shift.shortName = value;
    });

    /** @type {import("ui").UILabel} */
    this.labelColorPicker = this.querySelector(`ui-label[name="color-picker"]`);
    /** @type {HTMLInputElement} */
    const inputColorPicker = this.querySelector(`input[name="color-picker"]`);
    inputColorPicker.addEventListener("change", () => {
      this.shift.color = inputColorPicker.value || null;
      this.inputShortName.ui.input.style.color = this.shift.color || "inherit";
    });

    /** @type {import("ui").UILabel} */
    this.labelDefaultColor = this.querySelector(
      `ui-label[name="default-color"]`,
    );
    const inputDefaultColor = this.labelDefaultColor.ui.inputSlot[0];
    inputDefaultColor.checked = !this.shift.color;
    inputDefaultColor.addEventListener("change", () => {
      if (inputDefaultColor.checked) {
        this.colorReset = this.shift.color;
        inputColorPicker.value = null;
        this.disable(this.labelColorPicker);
      } else {
        this.shift.color = this.colorReset;
        inputColorPicker.value = this.shift.color;
        this.enable(this.labelColorPicker);
      }

      inputColorPicker.dispatchEvent(new Event("change"));
    });

    if (inputDefaultColor.checked) {
      this.colorReset = this.shift.color;
      inputColorPicker.value = null;
      inputColorPicker.dispatchEvent(new Event("change"));
      this.disable(this.labelColorPicker);
    }

    /** @type {import("ui").UILabel} */
    this.labelVisible = this.querySelector(`ui-label[name="visible"]`);
    const inputVisible = this.labelVisible.ui.inputSlot[0];
    inputVisible.addEventListener("change", () => {
      if (inputVisible.checked) {
        this.disable(this.inputShortName);
        this.disable(this.labelColorPicker);
        this.disable(this.labelDefaultColor);
      } else {
        this.enable(this.inputShortName);
        this.enable(this.labelColorPicker);
        this.enable(this.labelDefaultColor);
      }

      this.shift.visible = inputVisible.checked;
      inputDefaultColor.dispatchEvent(new Event("change"));
    });

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
        this.ui.events.dispatch("submit", this.shift);
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
          this.ui.title = this.uiLang.ui.get("edit-shift-dialog", "title");

          // Name
          this.inputName.ui.title = this.uiLang.ui.get(
            "edit-shift-dialog",
            "input-title-name",
          );

          // Short
          this.inputShortName.ui.title = this.uiLang.ui.get(
            "edit-shift-dialog",
            "input-title-short-name",
          );

          this.labelColorPicker.ui.primary = this.uiLang.ui.get(
            "edit-shift-dialog",
            "label-primary-color-picker",
          );

          this.labelDefaultColor.ui.primary = this.uiLang.ui.get(
            "edit-shift-dialog",
            "label-primary-use-default-color",
          );

          this.labelVisible.ui.primary = this.uiLang.ui.get(
            "edit-shift-dialog",
            "label-primary-visible-item",
          );

          this.cancelAction.action.innerText = this.uiLang.ui.get(
            "edit-shift-dialog",
            "button-cancel",
          );

          this.submitAction.action.innerText = this.uiLang.ui.get(
            "edit-shift-dialog",
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

  /** @param {Shift} shift */
  set(shift) {
    /** @type {Shift} */
    this.shift = shift;

    this.inputName.ui.value = this.shift.name;
    this.inputShortName.ui.value = this.shift.shortName;
    this.inputShortName.ui.input.style.color = this.shift.color || "inherit";
    this.labelColorPicker.ui.inputSlot[0].value = this.shift.color;
    this.labelDefaultColor.ui.inputSlot[0].checked = !this.shift.color;
    this.labelVisible.ui.inputSlot[0].checked = !this.shift.visible;

    if (!this.shift.visible) {
      this.disable(this.inputShortName);
      this.disable(this.labelColorPicker);
    } else {
      this.enable(this.inputShortName);
      this.enable(this.labelColorPicker);
    }
  }

  /**
   * @private
   * @param {import("ui").UIInput<import("ui").UIInput_Events> | import("ui").UILabel} el
   */
  enable(el) {
    el.style.opacity = "1";
    el.style.userSelect = "auto";

    if (el instanceof UIInput) {
      el.ui.input.disabled = false;
    } else {
      el.ui.inputSlot.forEach((slot) => {
        if (el instanceof UIInput) {
          slot.ui.input.disabled = false;
        } else {
          slot.disabled = false;
        }
      });
    }
  }

  /**
   * @private
   * @param {import("ui").UIInput<import("ui").UIInput_Events> | import("ui").UILabel} el
   */
  disable(el) {
    el.style.opacity = "0.25";
    el.style.userSelect = "none";

    if (el instanceof UIInput) {
      el.ui.input.disabled = true;
    } else {
      el.ui.inputSlot.forEach((slot) => {
        if (el instanceof UIInput) {
          slot.ui.input.disabled = true;
        } else {
          slot.disabled = true;
        }
      });
    }
  }
}
