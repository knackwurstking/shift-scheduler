import svgChevronLeft from "ui/src/svg/smoothie-line-icons/chevron-left";
import svgPen from "ui/src/svg/smoothie-line-icons/pen";
import svgPrinter from "ui/src/svg/smoothie-line-icons/printer";
import svgSettings from "ui/src/svg/smoothie-line-icons/settings";
import svgToday from "ui/src/svg/smoothie-line-icons/today";

import { html, UIAppBar } from "ui";

export class SchedulerAppBar extends UIAppBar {
  static register = () => {
    customElements.define("scheduler-app-bar", SchedulerAppBar);
  };

  constructor() {
    super();

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
      /** @type {import("ui").UIAppBarItem<import("ui").UIIconButton>} */
      back: this.querySelector(`[name="back"]`),
      /** @type {import("ui").UIAppBarItem<import("ui").UIButton>} */
      datePicker: this.querySelector(`[name="date-picker"]`),

      /** @type {import("ui").UIAppBarItem<HTMLElement>} */
      title: this.querySelector(`[name="title"]`),

      /** @type {import("ui").UIAppBarItem<import("ui").UIIconButton>} */
      edit: this.querySelector(`[name="edit"]`),

      /** @type {import("ui").UIAppBarItem<import("ui").UIIconButton>} */
      today: this.querySelector(`[name="today"]`),

      /** @type {import("ui").UIAppBarItem<import("ui").UIIconButton>} */
      pdf: this.querySelector(`[name="pdf"]`),

      /** @type {import("ui").UIAppBarItem<import("ui").UIIconButton>} */
      settings: this.querySelector(`[name="settings"]`),
    };
  }
}
