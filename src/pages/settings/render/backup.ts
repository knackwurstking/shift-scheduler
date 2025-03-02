import db from "../../../lib/db";

import { html } from "../../../lib/utils";

import * as store from "../../../lib/store";
import * as types from "../../../types";
import * as backupUtils from "./backup-utils";

const articleHTML = html`
    <h4>Backup</h4>

    <section class="json ui-flex justify-between align-center">
        <label style="padding: var(--ui-spacing)"> JSON </label>

        <span class="ui-flex gap" style="--justify: flex-end; padding: var(--ui-spacing)">
            <button class="import" color="secondary">Import</button>
            <button class="export" color="secondary">Export</button>
        </span>
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

            reader.onload = async () => await parseJSON(reader.result);

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

async function parseJSON(result: string | ArrayBuffer | null): Promise<void> {
    if (typeof result !== "string") return alert("Invalid data!");

    // Parsing JSON
    let data: types.settings.BackupV1 | types.settings.BackupV2 | types.settings.BackupV3;
    try {
        data = JSON.parse(result);
    } catch (err) {
        return alert("Invalid JSON data!");
    }

    // Validate backup version
    let backupV3: types.settings.BackupV3;
    if (backupUtils.isBackupV3(data)) {
        backupV3 = data as types.settings.BackupV3;
    } else if (backupUtils.isBackupV2(data)) {
        backupV3 = backupUtils.convertV2(data as types.settings.BackupV2);
    } else if (backupUtils.isBackupV1(data)) {
        backupV3 = backupUtils.convertV1(data as types.settings.BackupV1);
    } else {
        return alert("Invalid JSON data!");
    }

    // Initialize
    store.obj.set("settings", backupV3.settings);
    store.obj.set("week-start", backupV3.weekStart);

    await db.deleteAll();
    for (const entry of backupV3.indexedDB.data || []) {
        db.add(entry).catch(() => db.put(entry));
    }
}
