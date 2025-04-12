import * as ui from "ui";

import { html } from "@lib";
import { m } from "@paraglide/messages";

export function create(): HTMLElement {
    const article = document.createElement("article");

    article.className = "db-browser";

    article.innerHTML = getHTML();

    article.querySelector<HTMLButtonElement>(`button.browse`)!.onclick =
        gotoBrowserPage;

    return article;
}

function getHTML(): string {
    return html`
        <h4>${m.indexeddb()}</h4>

        <section>
            <label
                class="ui-flex justify-between align-center gap"
                style="padding: var(--ui-spacing)"
            >
                ${m.edit_entries()}
                <button class="browse">${m.browse()}</button>
            </label>
        </section>
    `;
}

async function gotoBrowserPage() {
    ui.router.hash.goTo(null, "dbbrowser");
}
