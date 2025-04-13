import { spinner } from "@components";

import { html, store } from "@lib";
import { m } from "@paraglide/messages";

export function create(): HTMLElement {
    const article = document.createElement("article");

    article.className = "backup";

    article.innerHTML = html`
        <h4>${m.update()}</h4>

        <section class="info">
            <p>${m.update_uptodate_info()}</p>
        </section>
    `;

    store.obj.listen(
        "update",
        ({ updateSW }) => {
            article.querySelector(`.info`)!.innerHTML = html`
                <label class="ui-flex justify-between gap">
                    <span>${m.update_available()}</span>
                    <button variant="outline" color="destructive">
                        ${m.update()}
                    </button>
                </label>
            `;

            article.querySelector(`button`)!.onclick = async () => {
                const s = spinner.create();
                s.methods.start();
                await updateSW();
            };
        },
        false,
        { skipStore: true },
    );

    return article;
}
