import { html } from "../../../utils";

const articleHTML = html`
    <h4>IndexedDB</h4>

    <section>
        <label class="ui-flex justify-between align-center" style="padding: var(--ui-spacing)">
            Edit entries
            <button disabled>Browse</button>
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
