import svgTrash from "ui/src/svg/smoothie-line-icons/trash";

import { CleanUp, draggable, html, styles, UIDialog, UIFlexGridItem } from "ui";

/**
 * HTML: `edit-rhythm-dialog`
 *
 * @extends {UIDialog<import("ui").UIDialog_Events>}
 */
export class EditRhythmDialog extends UIDialog {
    static register = () => {
        customElements.define("edit-rhythm-dialog", EditRhythmDialog);
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

        /** @type {number[]} */
        this.rhythm;

        this.cancelAction;
        this.submitAction;

        this.render();
    }

    render() {
        this.innerHTML = html`
            <ui-flex-grid
                style="width: 100%; height: 100%; padding-bottom: var(--ui-spacing);"
                gap="0.5rem"
            >
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

                <ui-flex-grid-item
                    style="position: relative; max-height: 1.6rem;"
                >
                    <hr
                        style="${styles({
                            position: "absolute",
                            top: "var(--ui-spacing)",
                            left: "0",
                            width: "100%",
                        })}"
                    />
                </ui-flex-grid-item>

                <ui-flex-grid-item
                    class="picker"
                    flex="0"
                    style="${styles({
                        maxHeight: "fit-content",
                        position: "relative",
                    })}"
                >
                    <ui-flex-grid-row
                        class="shifts no-scrollbar"
                        style="${styles({
                            width: "100%",
                            height: "100%",
                            overflow: "hidden",
                            overflowX: "auto",
                        })}"
                        gap="0.25rem"
                    ></ui-flex-grid-row>
                </ui-flex-grid-item>
            </ui-flex-grid>
        `;

        this.ui.fullscreen = true;

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
                this.uiStore.ui.update("settings", (settings) => {
                    return {
                        ...settings,
                        rhythm: this.rhythm,
                    };
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
                    this.ui.title = this.uiLang.ui.get(
                        "edit-rhythm-dialog",
                        "title",
                    );

                    // Name
                    this.querySelector("thead th:nth-child(1)").innerHTML =
                        this.uiLang.ui.get(
                            "edit-rhythm-dialog",
                            "table-header-name",
                        );

                    // Short
                    this.querySelector("thead th:nth-child(2)").innerHTML =
                        this.uiLang.ui.get(
                            "edit-rhythm-dialog",
                            "table-header-short-name",
                        );

                    this.cancelAction.action.innerText = this.uiLang.ui.get(
                        "edit-rhythm-dialog",
                        "button-cancel",
                    );

                    this.submitAction.action.innerText = this.uiLang.ui.get(
                        "edit-rhythm-dialog",
                        "button-submit",
                    );
                },
                true,
            ),

            this.uiStore.ui.on(
                "settings",
                (data) => {
                    this.rhythm = [...data.rhythm];
                    this.renderTable(data);
                    this.renderShiftsPicker(data);
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
     * @private
     * @param {SchedulerStore_Settings} data
     */
    renderTable(data) {
        const tbody = this.querySelector("tbody");
        while (!!tbody.firstChild) tbody.removeChild(tbody.firstChild);

        this.rhythm.forEach((id, index) => {
            let shift = data.shifts.find((shift) => shift.id === id);
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
            tr.setAttribute("data-json", JSON.stringify(index));
            tr.innerHTML = html`
                <td style="text-align: left;">${shift.name}</td>
                <td
                    style="text-align: left; color: ${shift.color ||
                    "inherit"};"
                >
                    ${!!shift.visible ? shift.shortName : ""}
                </td>
                <td style="text-align: right;">
                    <ui-flex-grid-row
                        style="justify-content: flex-end;"
                        gap="0.25rem"
                    >
                        <ui-flex-grid-item flex="0">
                            <ui-icon-button color="destructive" ghost>
                                ${svgTrash}
                            </ui-icon-button>
                        </ui-flex-grid-item>
                    </ui-flex-grid-row>
                </td>
            `;

            tr.querySelector("ui-icon-button:nth-child(1)").addEventListener(
                "click",
                async () => {
                    tbody.removeChild(tr);
                    this.rhythm = this.rhythm.filter((_n, i) => i !== index);
                    this.renderTable(data);
                },
            );

            tbody.appendChild(tr);
        });

        const scrollContainer = tbody.parentElement.parentElement;
        scrollContainer.scrollTop = scrollContainer.scrollHeight;

        draggable.createMobile(tbody, {
            onDragEnd: () => {
                this.rhythm = Array.from(tbody.children).map((child) => {
                    return JSON.parse(child.getAttribute("data-json"));
                });
                this.renderTable(data);
            },
        });
    }

    /**
     * Add a `ShiftCard` for each shift in `settings.shifts` to the `shiftsPicker` element
     *
     * @private
     * @param {SchedulerStore_Settings} settings
     */
    renderShiftsPicker(settings) {
        const picker = this.querySelector(".picker .shifts");
        while (picker.firstChild) picker.removeChild(picker.firstChild);

        settings.shifts.forEach((shift) => {
            const item = new UIFlexGridItem();
            item.innerHTML = html`
                <shift-card
                    color="${shift.color || "inherit"}"
                    ${!!shift.visible ? "visible" : ""}
                >
                    <span slot="name">${shift.name}</span>
                    <span slot="short-name">${shift.shortName}</span>
                </shift-card>
            `;

            item.querySelector("shift-card").addEventListener("click", () => {
                this.rhythm.push(shift.id);
                this.renderTable(settings);
            });

            picker.appendChild(item);
        });
    }
}
