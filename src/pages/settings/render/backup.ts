import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

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

export function article(reRenderCallback: () => Promise<void> | void): HTMLElement {
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

            reader.onload = async () => await parseJSON(reader.result, reRenderCallback);

            reader.onerror = () => {
                alert(`Import data: read file failed: ${reader.error}`);
            };

            reader.readAsText(input.files[0]);
        };

        input.click();
    };

    exportButton.onclick = async () => {
        const data: types.backup.BackupV3 = {
            // Create the backup object
            weekStart: store.obj.get("weekStart")!,
            shifts: store.obj.get("shifts")!,
            rhythm: store.obj.get("rhythm")!,
            startDate: store.obj.get("startDate")!,
            version: store.obj.get("version")!,
            indexedDB: {
                version: db.version,
                data: await db.getAll(),
            },
        };

        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const date = today.getDate().toString().padStart(2, "0");
        const fileName = `shift-scheduler-backup_${today.getFullYear()}-${month}-${date}.json`;

        if (process.env.MODE === "android") {
            Share.share({
                title: "Shift Scheduler Backup",
                text: "Backup of your Shift Scheduler data",
                url: (
                    await Filesystem.writeFile({
                        path: fileName,
                        data: JSON.stringify(data),
                        encoding: Encoding.UTF8,
                        directory: Directory.Cache,
                    })
                ).uri,
            });
        } else {
            const blob = new Blob([JSON.stringify(data)], {
                type: "plain/text",
            });

            try {
                await navigator.share({
                    title: "Shift Scheduler Backup",
                    text: "Backup of your Shift Scheduler data",
                    files: [new File([blob], fileName)],
                });
            } catch {
                const anchor = document.createElement("a");
                anchor.setAttribute("href", window.URL.createObjectURL(blob));
                anchor.setAttribute("download", fileName);
                anchor.click();
            }
        }
    };

    return article;
}

async function parseJSON(
    result: string | ArrayBuffer | null,
    reRenderCallback: () => Promise<void> | void,
): Promise<void> {
    if (typeof result !== "string") return alert("Invalid data!");

    // Parsing JSON
    let data: types.backup.BackupV1 | types.backup.BackupV2 | types.backup.BackupV3;
    try {
        data = JSON.parse(result);
    } catch (err) {
        return alert("Invalid JSON data!");
    }

    // Validate backup version
    let backupV3: types.backup.BackupV3;
    if (backupUtils.isBackupV3(data)) {
        backupV3 = data as types.backup.BackupV3;
    } else if (backupUtils.isBackupV2(data)) {
        backupV3 = backupUtils.convertV2(data as types.backup.BackupV2);
    } else if (backupUtils.isBackupV1(data)) {
        backupV3 = backupUtils.convertV1(data as types.backup.BackupV1);
    } else {
        return alert("Invalid JSON data!");
    }

    // Initialize
    store.obj.set("shifts", backupV3.shifts);
    store.obj.set("rhythm", backupV3.rhythm);
    store.obj.set("startDate", backupV3.startDate);
    store.obj.set("weekStart", backupV3.weekStart);

    await db.deleteAll();
    for (const entry of backupV3.indexedDB.data || []) {
        db.add(entry).catch(() => db.put(entry));
    }

    setTimeout(reRenderCallback);
}
