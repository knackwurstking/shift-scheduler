import { CleanUp, html } from "ui";

/**
 * HTML: `settings-theme-picker`
 */
export class SettingsThemePicker extends HTMLElement {
    static register = () => {
        customElements.define("settings-theme-picker", SettingsThemePicker);
    };

    constructor() {
        super();

        this.cleanup = new CleanUp();

        /** @type {SchedulerStore} */
        this.uiStore = document.querySelector("ui-store");
        /** @type {import("ui").UILang} */
        this.uiLang = document.querySelector("ui-lang");

        this.selectMode;

        this.render();
    }

    render() {
        this.innerHTML = html`
            <ui-secondary style="display: block;"></ui-secondary>

            <ui-flex-grid-row gap="0.25rem">
                <ui-flex-grid-item style="width: 50%;">
                    <ui-select>
                        <ui-select-option value="system">
                            System
                        </ui-select-option>

                        <ui-select-option value="dark"> Dark </ui-select-option>

                        <ui-select-option value="light">
                            Light
                        </ui-select-option>
                    </ui-select>
                </ui-flex-grid-item>
            </ui-flex-grid-row>
        `;

        /** @type {import("ui").UISelect} */
        this.selectMode = this.querySelector("ui-select");

        this.selectMode.ui.events.on("change", (option) => {
            this.uiStore.ui.update("theme", (theme) => {
                return { ...theme, mode: option.ui.value };
            });
        });
    }

    connectedCallback() {
        this.cleanup.add(
            this.uiStore.ui.on(
                "theme",
                this.storeHandlerTheme.bind(this),
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
     * @param {SchedulerStore_Theme} theme
     */
    async storeHandlerTheme(theme) {
        [...this.selectMode.children].forEach(
            (/** @type {import("ui").UISelectOption} */ child) => {
                child.ui.selected = child.ui.value === theme.mode;
            },
        );
    }

    /** @private */
    async storeHandlerLang() {
        this.querySelector("ui-secondary").innerHTML = this.uiLang.ui.get(
            "settings",
            "select-title-theme",
        );
    }
}
