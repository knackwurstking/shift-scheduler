import {
  SvgRecycle,
  UIButton,
  UIDialog,
  UIFlexGrid,
  UIFlexGridItem,
  UIFlexGridRow,
} from "ui";
import { createDraggable, html } from "ui/src/js";

/**
 * @typedef {import("ui/src/ui-dialog").UIDialogEvents} UIDialogEvents
 * @typedef {import("../types/.index").UIStoreEvents} UIStoreEvents
 * @typedef {import("../types/.index").SettingsStore} SettingsStore
 */

// {{{ HTML FlexGrid Content
const flexGridContent = html`
  <ui-flex-grid-item
    class="no-scrollbar"
    style="height: 100%; overflow-y: scroll;"
  >
    <table>
      <thead>
        <tr>
          <th style="text-align: left;"></th>
          <th style="text-align: left;"></th>
          <th style="text-align: right;"></th>
        </tr>
      </thead>

      <tbody></tbody>
    </table>
  </ui-flex-grid-item>

  <ui-flex-grid-item style="position: relative; max-height: 1.6rem;">
    <hr
      style="
            position: absolute;
            top: var(--ui-spacing);
            left: 0;
            width: 100%;
        "
    />
  </ui-flex-grid-item>

  <ui-flex-grid-item
    class="picker"
    flex="0"
    style="
        max-height: fit-content;
        position: relative;
    "
  >
    <ui-flex-grid-row
      class="shifts no-scrollbar"
      style="
            width: 100%;
            height: fit-content;
            overflow: hidden;
            overflow-x: scroll;
        "
      gap="0.25rem"
    ></ui-flex-grid-row>
  </ui-flex-grid-item>
`;
// }}}

/** @extends {UIDialog<UIDialogEvents>} */
export class EditRhythmDialog extends UIDialog {
  static register = () => {
    SvgRecycle.register();

    UIDialog.register();
    UIFlexGridItem.register();
    UIFlexGridRow.register();
    UIFlexGrid.register();
    UIButton.register();

    if (!customElements.get("edit-rhythm-dialog")) {
      customElements.define("edit-rhythm-dialog", EditRhythmDialog);
    }
  };

  /**
   * @param {import("ui").UIStore<UIStoreEvents>} store
   * @param {import("ui").UILang} lang
   */
  constructor(store, lang) {
    // {{{
    super();

    /**
     * @type {import("ui").UIStore<UIStoreEvents>}
     */
    this.uiStore = store;

    /**
     * @type {import("ui").UILang}
     */
    this.uiLang = lang;

    /**
     * @private
     * @type {import("ui").UIStackLayout}
     */
    this.stackLayout = document.querySelector("ui-stack-layout");

    this.ui.fullscreen = true;

    /**
     * @type {UIFlexGrid}
     */
    this.content;

    /**
     * @type {number[]}
     */
    this.rhythm;

    /**
     * @type {UIButton}
     */
    this.cancel;

    /**
     * @type {UIButton}
     */
    this.submit;

    this.createContent();
    this.createActions();
  } // }}}

  connectedCallback() {
    // {{{
    super.connectedCallback();

    this.stackLayout.ui.lock();
    this.cleanup.add(() => this.stackLayout.ui.unlock());

    setTimeout(() => {
      this.cleanup.add(
        this.uiStore.ui.on("lang", this.onLang.bind(this), true),
      );

      this.cleanup.add(
        this.uiStore.ui.on("settings", this.onSettings.bind(this), true),
      );
    });
  } // }}}

  /** @private */
  createContent() {
    // {{{
    this.content = new UIFlexGrid();

    this.content.setAttribute("gap", "0.5rem");
    this.content.style.width = "100%";
    this.content.style.height = "100%";
    this.content.style.paddingBottom = "var(--ui-spacing)";
    this.content.innerHTML = flexGridContent;

    this.appendChild(this.content);
  } // }}}

  /**
   * @private
   * @param {SettingsStore} settings
   */
  renderTable(settings) {
    // {{{
    const tbody = this.content.querySelector("tbody");
    while (!!tbody.firstChild) tbody.removeChild(tbody.firstChild);

    let draggedIndex = null;
    this.rhythm.forEach((id, index) => {
      let shift = settings.shifts.find((shift) => shift.id === id);
      if (!shift) {
        console.warn(`shift with id of "${id}" is missing in shifts`);
        shift = {
          id: id,
          name: "",
          shortName: "",
          color: "var(--destructive)",
          visible: false,
        };
      }

      // Create a table entry for this shift
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td style="text-align: left;">${shift.name}</td>
                <td
                    style="text-align: left; color: ${shift.color || "inherit"};"
                >${!!shift.visible ? shift.shortName : ""}</td>
                <td style="text-align: right;">
                    <ui-flex-grid-row style="justify-content: flex-end;" gap="0.25rem">
                        <ui-flex-grid-item flex="0">
                            <ui-icon-button color="destructive" ghost>
                                <svg-recycle></svg-recycle>
                            </ui-icon-button>
                        </ui-flex-grid-item>
                    </ui-flex-grid-row>
                </td>
            `;

      // @ts-ignore
      tr.querySelector("ui-icon-button:nth-child(1)").onclick = async () => {
        tbody.removeChild(tr);
        this.rhythm = this.rhythm.filter((_n, i) => i !== index);
        this.renderTable(settings);
      };

      tbody.appendChild(tr);

      createDraggable(tr, {
        onDragStart: async () => {
          // {{{
          draggedIndex = index;
        }, // }}}

        onDragging: async () => {
          // {{{
          if (draggedIndex === null) return;

          [...tbody.children].forEach((/**@type{HTMLElement}*/ child, ci) => {
            if (ci !== index) {
              child.style.background = "inherit";
              child.style.color = "inherit";
              return;
            }

            child.style.background = "var(--ui-primary-bgColor)";
            child.style.color = "var(--ui-primary-color)";
          });
        }, // }}}

        onDragEnd: async () => {
          // {{{
          if (draggedIndex === null) return;

          if (draggedIndex < index) {
            // dragged down
            this.rhythm = [
              ...this.rhythm.slice(0, draggedIndex),
              ...this.rhythm.slice(draggedIndex + 1, index + 1),
              this.rhythm[draggedIndex],
              ...this.rhythm.slice(index + 1),
            ];

            this.renderTable(settings);
          } else if (draggedIndex > index) {
            // dragged up
            this.rhythm = [
              ...this.rhythm.slice(0, index),
              this.rhythm[draggedIndex],
              ...this.rhythm.slice(index, draggedIndex),
              ...this.rhythm.slice(draggedIndex + 1),
            ];

            this.renderTable(settings);
          }

          [...tbody.children].forEach((/**@type{HTMLElement}*/ child) => {
            child.style.background = "inherit";
            child.style.color = "inherit";
            return;
          });

          draggedIndex = null;
        }, // }}}
      });
    });
  } // }}}

  /**
   * Add a `ShiftCard` for each shift in `settings.shifts` to the `shiftsPicker` element
   *
   * @private
   * @param {SettingsStore} settings
   */
  renderShiftsPicker(settings) {
    // {{{
    const picker = this.content.querySelector(".picker .shifts");
    while (picker.firstChild) picker.removeChild(picker.firstChild);

    settings.shifts.forEach((shift) => {
      const item = new UIFlexGridItem();
      item.innerHTML = `
                <shift-card color="${shift.color || "inherit"}" ${!!shift.visible ? "visible" : ""}>
                    <span slot="name">${shift.name}</span>
                    <span slot="short-name">${shift.shortName}</span>
                </shift-card>
            `;

      // @ts-ignore
      item.querySelector("shift-card").onclick = () => {
        this.rhythm.push(shift.id);
        this.renderTable(settings);
      };

      picker.appendChild(item);
    });
  } // }}}

  /** @private */
  createActions() {
    // {{{
    // Cancel
    let item = new UIFlexGridItem();
    item.slot = "actions";
    item.setAttribute("flex", "0");
    item.innerHTML = `
            <ui-button variant="full" color="secondary"></ui-button>
        `;
    this.cancel = item.querySelector("ui-button");
    this.cancel.onclick = this.onCancel.bind(this);
    this.appendChild(item);

    // Submit
    item = new UIFlexGridItem();
    item.slot = "actions";
    item.setAttribute("flex", "0");
    item.innerHTML = `
            <ui-button variant="full" color="primary"></ui-button>
        `;
    this.submit = item.querySelector("ui-button");
    this.submit.onclick = this.onSubmit.bind(this);
    this.appendChild(item);
  } // }}}

  onCancel() {
    // {{{
    this.ui.close();
  } // }}}

  async onSubmit() {
    // {{{
    this.uiStore.ui.update("settings", (settings) => {
      return {
        ...settings,
        rhythm: this.rhythm,
      };
    });
    this.ui.close();
  } // }}}

  /** @private */
  async onLang() {
    // {{{
    this.ui.title = this.uiLang.ui.get("edit-rhythm-dialog", "title");

    // Name
    this.content.querySelector("thead th:nth-child(1)").innerHTML =
      this.uiLang.ui.get("edit-rhythm-dialog", "table-header-name");

    // Short
    this.content.querySelector("thead th:nth-child(2)").innerHTML =
      this.uiLang.ui.get("edit-rhythm-dialog", "table-header-short-name");

    this.cancel.innerText = this.uiLang.ui.get(
      "edit-rhythm-dialog",
      "button-cancel",
    );
    this.submit.innerText = this.uiLang.ui.get(
      "edit-rhythm-dialog",
      "button-submit",
    );
  } // }}}

  /**
   * @private
   * @param {SettingsStore} settings
   */
  async onSettings(settings) {
    // {{{
    this.rhythm = [...settings.rhythm];
    this.renderTable(settings);
    this.renderShiftsPicker(settings);
  } // }}}
}
