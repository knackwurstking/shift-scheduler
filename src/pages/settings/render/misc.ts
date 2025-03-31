import { html, store } from "@lib";
import { m } from "@paraglide/messages";

// TODO: Use translate here
const articleHTML = html`
    <h4>Miscellaneous</h4>

    <section class="week-start">
        <label
            class="ui-flex justify-between"
            style="padding: var(--ui-spacing);"
        >
            The week starts on Monday
            <input type="checkbox" />
        </label>
    </section>
`;

export function article(): HTMLElement {
    const article = document.createElement("article");
    article.className = "misc";
    article.innerHTML = articleHTML;

    const weekStart = article.querySelector<HTMLInputElement>(
        `section.week-start input[type="checkbox"]`,
    )!;

    // Read week start from store
    weekStart.checked = store.obj.get("weekStart") === 1;

    // Update store on change
    weekStart.onchange = () => {
        store.obj.set("weekStart", weekStart.checked ? 1 : 0);
    };

    return article;
}
