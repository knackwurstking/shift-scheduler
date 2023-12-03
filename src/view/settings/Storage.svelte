<script>
    import DeleteOutline from "svelte-material-icons/DeleteOutline.svelte";
    import Upload from "svelte-material-icons/Upload.svelte";
    import Download from "svelte-material-icons/Download.svelte";
    import OpenInNew from "svelte-material-icons/OpenInNew.svelte";

    import {
        Button,
        Text,
    } from "svelte-css";

    import {
        StorageDialog,
    } from "../../lib/components";

    import * as lang from "../../lib/js/lang";
    import * as db from "../../lib/js/db";
    import * as utils from "../../lib/js/utils";

    /***********
     * Bindings
     ***********/

    /** @type {StorageDialog} */
    let storageDialog;

    /************************
     * Variable Definitions
     ************************/

    let dataStorage = false;
    let reloadDataStorageTable = false;

    /***********************
     * Function Definitions
     ***********************/

    async function storageFileUpload() {
        const input = document.createElement("input");

        input.type = "file";

        input.onchange = async () => {
            const r = new FileReader();

            r.onload = async () => {
                if (typeof r.result === "string") {
                    try {
                        const result = JSON.parse(r.result);

                        for (const [key, dbData] of Object.entries(result)) {
                            if (!db.validate(dbData)) {
                                console.error(
                                    `Data Upload: data "${key}" invalid`,
                                    dbData
                                );
                                return;
                            }

                            await utils.mergeDataWithShifts(dbData);
                        }

                        for (const [key, dbData] of Object.entries(result)) {
                            const keySplit = key.split("-", 3);
                            const year = parseInt(keySplit[1], 10);
                            const month = parseInt(keySplit[2], 10);
                            await db.set(year, month, dbData);
                        }

                        if (dataStorage) dataStorage = false;
                    } catch (err) {
                        alert(`Data upload failed!\n${err}`);
                    }
                }
            };

            r.onerror = async (ev) => {
                console.error("Data Upload: Read file failed:", ev);
            };

            r.readAsText(input.files[0]);
        };

        input.click();
    }

    async function storageFileDownload() {
        const data = await db.getAll();
        try {
            await db.exportDatabase(
                data,
                utils.isAndroid() ? "android" : "browser"
            );
        } catch (err) {
            alert(`Data download failed!\n${err}`);
        }
    }

    function listDataBaseKeys() {
        const keys = db.listKeys();

        const loops = keys.length-1;
        for (let n = 0; n < loops; n++) {
            for (let i = 0; i < loops; i++) {
                let itemCurrent = keys[i];
                let itemNext = keys[i+1];

                if (itemCurrent.year > itemNext.year) {
                    keys[i] = itemNext;
                    keys[i+1] = itemCurrent;
                    itemCurrent = keys[i];
                    itemNext = keys[i+1];
                }

                if (itemCurrent.month > itemNext.month && itemCurrent.year === itemNext.year) {
                    keys[i] = itemNext;
                    keys[i+1] = itemCurrent;
                }
            }
        }

        return keys;
    }
</script>

<article class="ui-card has-margin">
    <h3 style="margin: var(--spacing)">
        {lang.get("settingsView", "titleStorage")}
    </h3>

    <hr />

    <section>
        <Text.Label
            primary={lang.get("settingsView", "labelupdownPrimaryText")}
            secondary={lang.get(
                "settingsView",
                "labelupdownSecondaryText"
            )}
            row
        >
            <Button.Icon
                style="margin: calc(var(--spacing) / 2)"
                on:click={() => storageFileUpload()}
            >
                <Upload />
            </Button.Icon>
            <Button.Icon
                style="margin: calc(var(--spacing) / 2)"
                on:click={() => storageFileDownload()}
            >
                <Download />
            </Button.Icon>
        </Text.Label>
    </section>

    <hr />

    {#if dataStorage}
        <section>
            <figure>
                <table class="storage-data-table">
                    <thead>
                        <tr>
                            <th class="is-text-left">
                                {lang.get(
                                    "settingsView",
                                    "tableHeaderYear"
                                )}
                            </th>
                            <th class="is-text-left">
                                {lang.get(
                                    "settingsView",
                                    "tableHeaderMonth"
                                )}
                            </th>
                            <th class="is-text-left" />
                        </tr>
                    </thead>

                    <tbody>
                        {#key reloadDataStorageTable}
                            {#each listDataBaseKeys() as item}
                                <tr>
                                    <td class="is-text-left">{item.year}</td>
                                    <td class="is-text-left">{item.month + 1}</td>
                                    <td
                                        class="actions is-text-right"
                                        style="font-size: 1.1em;"
                                    >
                                        <Button.Icon
                                            style="margin: 4px;"
                                            ghost
                                            on:click={async () => {
                                                storageDialog.open(
                                                    item.year,
                                                    item.month
                                                );
                                            }}
                                        >
                                            <OpenInNew />
                                        </Button.Icon>

                                        <Button.Icon
                                            style="margin: 4px;"
                                            color="destructive"
                                            ghost
                                            on:click={async () => {
                                                const yes = window.confirm(
                                                    `Delete all data for "${
                                                        item.year
                                                    }/${(item.month + 1)
                                                        .toString()
                                                        .padStart(
                                                            2,
                                                            "0"
                                                        )}" ?`
                                                );
                                                if (yes) {
                                                    await db.remove(
                                                        item.year,
                                                        item.month
                                                    );
                                                    reloadDataStorageTable =
                                                        !reloadDataStorageTable;
                                                }
                                            }}
                                        >
                                            <DeleteOutline />
                                        </Button.Icon>
                                    </td>
                                </tr>
                            {/each}
                        {/key}
                    </tbody>
                </table>
            </figure>
        </section>
    {:else}
        <section>
            <Button.Root color="secondary" on:click={() => (dataStorage = true)}>
                {lang.get("settingsView", "storageFetchDataButton")}
            </Button.Root>
        </section>
    {/if}
</article>

<StorageDialog
    bind:this={storageDialog}
    on:close={async () => {
        storageDialog.close();
    }}
/>

<style>
    .storage-data-table tr > *:last-child {
        width: calc(6em + (4px * 4) + (var(--spacing) * 2));
    }
</style>
