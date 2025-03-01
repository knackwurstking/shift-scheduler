import db from "../../../lib/db";

import { html } from "../../../lib/utils";

import * as store from "../../../lib/store";

const articleHTML = html`
    <h4>Backup</h4>

    <section class="json">
        <label class="ui-flex justify-between align-center" style="padding: var(--ui-spacing)">
            JSON
            <span class="ui-flex gap" style="--justify: flex-end;">
                <button class="import" color="secondary">Import</button>
                <button class="export" color="secondary">Export</button>
            </span>
        </label>
    </section>
`;

export function article(): HTMLElement {
    const article = document.createElement("article");
    article.className = "backup";
    article.innerHTML = articleHTML;

    // JSON
    const importButton = article.querySelector<HTMLButtonElement>(`section.json button.import`)!;
    const exportButton = article.querySelector<HTMLButtonElement>(`section.json button.export`)!;

    importButton.onclick = async () => {
        const input = document.createElement("input");

        input.type = "file";
        input.accept = "application/json";

        input.onchange = async () => {
            if (!input.files || input.files.length === 0) {
                return;
            }

            const reader = new FileReader();

            reader.onload = () => {
                // TODO: Handle the loaded data
                //this.readerOnLoadHandler(reader)
            };

            reader.onerror = () => {
                alert(`Import data: read file failed: ${reader.error}`);
            };

            reader.readAsText(input.files[0]);
        };

        input.click();
    };

    exportButton.onclick = async () => {
        const blob = new Blob(
            [
                JSON.stringify({
                    // Create the backup object
                    weekStart: store.obj.get("week-start"),
                    settings: store.obj.get("settings"),
                    indexedDB: {
                        version: db.version,
                        data: await db.getAll(),
                    },
                }),
            ],
            {
                type: "octet/stream",
            },
        );

        const anchor = document.createElement("a");

        anchor.setAttribute("href", window.URL.createObjectURL(blob));

        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const date = today.getDate().toString().padStart(2, "0");
        const fileName = `shift-scheduler-backup_${today.getFullYear()}-${month}-${date}.json`;
        anchor.setAttribute("download", fileName);

        anchor.click();
    };

    return article;
}
