import { spinner } from "@components";

import { constants, html, store } from "@lib";
import { m } from "@paraglide/messages";

export function create(): HTMLElement {
    const article = document.createElement("article");

    article.className = "backup";

    article.innerHTML = html`
        <h4>${m.update()}</h4>

        <section
            class="current-version ui-flex justify-between gap"
            style="font-size: 0.85rem;"
        >
            <span>Current Version:</span>
            <span style="--mono: 1;">
                <span class="version">v${constants.version}</span>
                <span class="build">[Build: ${constants.build}]</span>
            </span>
        </section>

        <section class="info" style="display: none;"></section>
    `;

    store.obj.listen(
        "update",
        ({ updateSW }) => {
            const infoContainer = article.querySelector<HTMLElement>(`.info`)!;
            infoContainer.style.display = "block";
            infoContainer.innerHTML = html`
                <label class="ui-flex justify-between gap">
                    <span>${m.update_available()}</span>
                    <button
                        style="min-width: fit-content;"
                        data-ui-variant="outline"
                        data-ui-color="destructive"
                    >
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
        true,
        { skipStore: true },
    );

    return article;
}
