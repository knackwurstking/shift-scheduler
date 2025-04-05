import { html } from "@lib";
import { m } from "@paraglide/messages";

export function create(): HTMLElement {
    const article = document.createElement("article");

    article.className = "db-browser";

    article.innerHTML = html`
        <h4>${m.indexeddb()}</h4>

        <section>
            <label
                class="ui-flex justify-between align-center"
                style="padding: var(--ui-spacing)"
            >
                ${m.edit_entries()}
                <button class="browse">${m.browse()}</button>
            </label>
        </section>
    `;

    article.querySelector<HTMLButtonElement>(`button.browse`)!.onclick =
        async () => {
            // TODO: Goto DB Browser page via hash router
        };

    return article;
}
