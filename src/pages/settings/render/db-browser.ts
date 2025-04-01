import { html } from "@lib";
import { m } from "@paraglide/messages";

const articleHTML = html`
    <h4>${m.indexeddb()}</h4>

    <section>
        <label
            class="ui-flex justify-between align-center"
            style="padding: var(--ui-spacing)"
        >
            ${m.edit_entries()}
            <button disabled>${m.browse()}</button>
        </label>
    </section>
`;

export function article(): HTMLElement {
    const article = document.createElement("article");
    article.className = "db-browser";
    article.innerHTML = articleHTML;

    // TODO: ...

    return article;
}
