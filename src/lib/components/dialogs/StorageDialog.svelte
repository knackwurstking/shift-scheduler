<script>
    import DeleteOutline from "svelte-material-icons/DeleteOutline.svelte";

    import {
        Button,
        Dialog,
    } from "svelte-css";

    import * as Store from "../../stores";

    import * as lang from "../../js/lang";
    import * as db from "../../js/db";

    /***********
     * Bindings
     ***********/

    /** @type {Dialog.Root} */
    let dialog;

    /***********************
     * Variable Definitions
     ***********************/

    /** @type {number} */
    let year;
    /** @type {number} */
    let month;

    /**
     *
     * @type {{
     *  key: string;
     *  shift: import("../../stores/shift-setup").Shift | null;
     *  note: string;
     * }[]}
     */
    let data;

    /**************
     * Store: view
     **************/

    const view = Store.view.create();

    /******************************
     * Function Export Definitions
     ******************************/

    /**
     * @param {number} _year
     * @param {number} _month
     */
    export async function open(_year, _month) {
        year = _year;
        month = _month;

        await loadData();

        dialog.showModal();
        view.lock();
    }

    export async function close() {
        dialog.close();
        view.unlock();
    }

    /***********************
     * Function Definitions
     ***********************/

    async function loadData() {
        data = [];
        for (let [key, value] of Object.entries(await db.get(year, month))) {
            data.push({
                key,
                ...value,
            });
        }
        data = data;
    }
</script>

<Dialog.Root bind:this={dialog} fullscreen>
    <Dialog.Header
        title={`Data: ${year}/${(month + 1).toString().padStart(2, "0")}`}
        on:close={() => close()}
    />

    <section
        style="height: calc(100% - 6rem); overflow-y: auto;"
    >
        <figure style="width: 100%;">
            <table>
                <thead>
                    <tr>
                        <th class="is-text-left">
                            {lang.get("storageDialog", "tableHeaderDay")}
                        </th>
                        <th class="is-text-left">
                            {lang.get("storageDialog", "tableHeaderShift")}
                        </th>
                        <th class="is-text-left">
                            {lang.get("storageDialog", "tableHeaderNote")}
                        </th>
                        <th class="is-text-right" />
                    </tr>
                </thead>
                <tbody>
                    {#if !!data}
                        {#each data.sort( (a, b) => (parseInt(a.key.split("-", 3)[2], 10) > parseInt(b.key.split("-", 3)[2], 10) ? 1 : -1) ) as item}
                            <tr>
                                <td class="is-text-left">
                                    {item.key.split("-", 3)[2]}
                                </td>
                                <td class="is-text-left">
                                    {item.shift?.name || null}
                                </td>
                                <td class="is-text-left">
                                    <p
                                        style={
                                            "display: -webkit-box;" +
                                            "-webkit-line-clamp: 3;" +
                                            "-webkit-box-orient: vertical;" +
                                            "overflow: hidden;" +
                                            "text-overflow: ellipsis;" +
                                            "max-height: calc(3em * var(--line-height, 1));"
                                        }
                                    >
                                        {item.note || ""}
                                    </p>
                                </td>
                                <td class="is-text-right" style="font-size: 1.1em;">
                                    <Button.Icon
                                        style="margin: 4px;"
                                        color="destructive"
                                        ghost
                                        on:click={async () => {
                                            if (
                                                window.confirm(
                                                    `Delete data for "${year}/${
                                                        month + 1
                                                    }/${
                                                        item.key.split(
                                                            "-",
                                                            3
                                                        )[2]
                                                    }" ?`
                                                )
                                            ) {
                                                await db.removeData(
                                                    year,
                                                    month,
                                                    item.key
                                                );
                                                await loadData();
                                            }
                                        }}
                                    >
                                        <DeleteOutline />
                                    </Button.Icon>
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </figure>
    </section>
</Dialog.Root>

<style>
    tr > *:nth-child(1) {
        width: 2.5em;
    }

    tr > *:nth-child(2) {
        width: 7.5em;
    }

    tr > *:nth-child(4) {
        width: calc(2.5em + (var(--spacing) * 2));
    }
</style>
