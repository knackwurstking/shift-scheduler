<script>
    import { createEventDispatcher } from "svelte";

    import DeleteOutline from "svelte-material-icons/DeleteOutline.svelte";

    import { IconButton, Dialog, DialogHeader } from "svelte-css";

    import * as lang from "../../js/lang";
    import * as db from "../../js/db";

    const dispatch = createEventDispatcher();

    /** @type {Dialog} */
    let dialog;

    /** @type {number} */
    let year;
    /** @type {number} */
    let month;

    /**
     *
     * @type {{
     *  key: string;
     *  shift: import("../../stores/shift-setup-store").Shift | null;
     *  note: string;
     * }[]}
     */
    let data;

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

    /**
     * @param {number} _year
     * @param {number} _month
     */
    export async function open(_year, _month) {
        year = _year;
        month = _month;

        await loadData();

        dialog.showModal();
    }

    export async function close() {
        dialog.close();
    }
</script>

<Dialog bind:this={dialog} fullscreen>
    <DialogHeader
        title={`Data: ${year}/${(month + 1).toString().padStart(2, "0")}`}
        on:close={() => dispatch("close")}
    />

    <section
        style="height: calc(100% - 6rem); overflow-y: auto; padding-left: 0; padding-right: 0;"
    >
        <figure style="width: 100%;">
            <table>
                <thead>
                    <tr>
                        <th class="left">
                            {lang.get("storageDialog", "tableHeaderDay")}
                        </th>
                        <th class="left">
                            {lang.get("storageDialog", "tableHeaderShift")}
                        </th>
                        <th class="left">
                            {lang.get("storageDialog", "tableHeaderNote")}
                        </th>
                        <th class="right" />
                    </tr>
                </thead>
                <tbody>
                    {#if !!data}
                        {#each data.sort( (a, b) => (parseInt(a.key.split("-", 3)[2], 10) > parseInt(b.key.split("-", 3)[2], 10) ? 1 : -1) ) as item}
                            <tr>
                                <td class="left">
                                    {item.key.split("-", 3)[2]}
                                </td>
                                <td class="left">
                                    {item.shift?.name || null}
                                </td>
                                <td class="left">
                                    <p
                                        style={`
                                            display: -webkit-box;
                                            -webkit-line-clamp: 3;
                                            -webkit-box-orient: vertical;
                                            overflow: hidden;
                                            text-overflow: ellipsis;
                                            max-height: calc(3em * var(--line-height, 1));
                                            user-select: text;
                                        `}
                                    >
                                        {item.note || ""}
                                    </p>
                                </td>
                                <td class="right" style="font-size: 1.1em;">
                                    <IconButton
                                        style="margin: 4px;"
                                        color="destructive"
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
                                    </IconButton>
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </figure>
    </section>
</Dialog>

<style>
    tr > *:nth-child(1) {
        width: 2.5em;
    }

    tr > *:nth-child(2) {
        width: 7.5em;
    }

    tr > *:nth-child(4) {
        width: 3em;
    }
</style>
