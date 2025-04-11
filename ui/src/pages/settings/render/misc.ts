import { html, store } from "@lib";
import { m } from "@paraglide/messages";

export function create(): HTMLElement {
    const article = document.createElement("article");

    article.className = "misc";

    article.innerHTML = html`
        <h4>${m.miscellaneous()}</h4>

        <section class="week-start">
            <label
                class="ui-flex justify-between"
                style="padding: var(--ui-spacing);"
            >
                ${m.week_starts_monday()}
                <input type="checkbox" />
            </label>
        </section>
    `;

    const weekStart = article.querySelector<HTMLInputElement>(
        `input[type="checkbox"]`,
    )!;

    // Read week start from store
    weekStart.checked = store.obj.get("weekStart") === 1;

    // Update store on change
    weekStart.onchange = () => {
        store.obj.set("weekStart", weekStart.checked ? 1 : 0);
    };

    return article;
}
