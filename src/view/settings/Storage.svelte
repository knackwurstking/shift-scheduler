<script>
    import DeleteOutline from "svelte-material-icons/DeleteOutline.svelte";
    import OpenInNew from "svelte-material-icons/OpenInNew.svelte";

    import {
        Button,
    } from "svelte-css";

    import {
        StorageDialog,
    } from "../../lib/components";

    import * as lang from "../../lib/js/lang";
    import * as db from "../../lib/js/db";

    import * as Stores from "../../lib/stores";

    /***********
     * Bindings
     ***********/

    /** @type {StorageDialog} */
    let storageDialog;

    /**************************
     * Store: settings-storage
     **************************/

    const settingsStorage = Stores.settingsStorage.create();

    /***********************
     * Function Definitions
     ***********************/

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
        {lang.get("view settings", "titleStorage")}
    </h3>

    <hr />

    {#if $settingsStorage.open}
        <section>
            <figure>
                <table class="storage-data-table">
                    <thead>
                        <tr>
                            <th class="is-text-left">
                                {lang.get("view settings", "tableHeaderYear")}
                            </th>
                            <th class="is-text-left">
                                {lang.get("view settings", "tableHeaderMonth")}
                            </th>
                            <th class="is-text-left" />
                        </tr>
                    </thead>

                    <tbody>
                        {#key $settingsStorage.reload}
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
                                            on:click={() =>
                                                storageDialog.open(item.year, item.month)
                                            }
                                        >
                                            <OpenInNew />
                                        </Button.Icon>

                                        <Button.Icon
                                            style="margin: 4px;"
                                            color="destructive"
                                            ghost
                                            on:click={async () => {
                                                const month = (item.month + 1).toString().padStart(2, "0");
                                                const yes = window.confirm(
                                                    `Delete all data for "${item.year}/${month}" ?`);
                                                if (yes) {
                                                    await db.remove(item.year, item.month);
                                                    settingsStorage.reload();
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
            <Button.Root color="secondary" on:click={() => (settingsStorage.open())}>
                {lang.get("view settings", "storageFetchDataButton")}
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
