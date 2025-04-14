import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

import { backupUtils, db, html, store } from "@lib";
import { BackupV3 } from "@types";
import { m } from "@paraglide/messages";

export function create(
    reRenderCallback: () => Promise<void> | void,
): HTMLElement {
    const article = document.createElement("article");

    article.className = "backup";

    article.innerHTML = html`
        <h4>${m.backup()}</h4>

        <section class="json ui-flex justify-between align-center">
            <label style="padding: var(--ui-spacing)"> JSON </label>

            <span
                class="ui-flex gap"
                style="--justify: flex-end; padding: var(--ui-spacing)"
            >
                <button class="import" color="secondary">${m.import()}</button>
                <button class="export" color="secondary">${m.export()}</button>
            </span>
        </section>
    `;

    // JSON
    const importButton = article.querySelector<HTMLButtonElement>(
        `section.json button.import`,
    )!;
    const exportButton = article.querySelector<HTMLButtonElement>(
        `section.json button.export`,
    )!;

    importButton.onclick = async () => {
        const input = document.createElement("input");

        input.type = "file";
        input.accept = "application/json";

        input.onchange = async () => {
            if (!input.files || input.files.length === 0) {
                return;
            }

            const reader = new FileReader();

            reader.onload = async () => {
                try {
                    await backupUtils.updateViaJSON(
                        reader.result,
                        reRenderCallback,
                    );
                } catch (err) {
                    return alert(err);
                }
            };

            reader.onerror = () => {
                alert(
                    m.alert_import_data_failed({
                        error: `${reader.error}`,
                    }),
                );
            };

            reader.readAsText(input.files[0]);
        };

        input.click();
    };

    exportButton.onclick = async () => {
        const data: BackupV3 = {
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

        if (process.env.MODE === "capacitor") {
            Share.share({
                title: `Shift Scheduler ${m.backup()}`,
                dialogTitle: m.backup_shift_scheduler_data(),
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
                const shareData = {
                    title: `Shift Scheduler ${m.backup()}`,
                    files: [new File([blob], fileName, { type: blob.type })],
                };

                if (!navigator.canShare(shareData)) {
                    throw new Error(
                        "Cannot share data here... Fallback to download!",
                    );
                }

                await navigator.share(shareData);
            } catch (err) {
                console.error(err);

                const anchor = document.createElement("a");
                anchor.setAttribute("href", window.URL.createObjectURL(blob));
                anchor.setAttribute("download", fileName);
                anchor.click();
            }
        }
    };

    return article;
}
