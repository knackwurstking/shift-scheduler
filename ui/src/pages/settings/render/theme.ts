import { constants, html, store } from "@lib";
import { m } from "@paraglide/messages";

export function create(): HTMLElement {
    const article = document.createElement("article");

    const theme = store.obj.get("theme")!;
    article.innerHTML = getHTML(theme.hue);

    initHandler(article);

    return article;
}

function getHTML(hue: number): string {
    return html`
        <h4>${m.settings_theme_title()}</h4>

        <section class="ui-flex column">
            <label
                for="settingsThemeHueSlider"
                class="ui-flex gap justify-between align-center"
            >
                ${m.settings_theme_hue_range_label()}
                <button
                    class="reset-hue"
                    data-ui-variant="outline"
                    data-ui-color="secondary"
                >
                    ${m.reset()}
                </button>
            </label>

            <br />

            <input
                id="settingsThemeHueSlider"
                type="range"
                min="0"
                max="360"
                step="1"
                value="${hue}"
            />
        </section>
    `;
}

function initHandler(container: HTMLElement) {
    const hueSlider = container.querySelector<HTMLInputElement>(
        `input#settingsThemeHueSlider`,
    )!;

    hueSlider.oninput = () => {
        store.obj.set("theme", { hue: parseInt(hueSlider.value, 10) }, false, {
            skipStore: true,
        });
    };

    hueSlider.onchange = () => {
        store.obj.set("theme", { hue: parseInt(hueSlider.value, 10) });
    };

    const resetHueButton =
        container.querySelector<HTMLButtonElement>(`button.reset-hue`)!;

    resetHueButton.onclick = () => {
        hueSlider.value = constants.defaultHue.toString();
        hueSlider.oninput!(new Event("input"));
        hueSlider.onchange!(new Event("change"));
    };
}
