<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import IoIosClose from "svelte-icons/io/IoIosClose.svelte";
    import IoIosTrash from "svelte-icons/io/IoIosTrash.svelte";

    import IconButton from "../icon-button";

    import * as db from "../../js/db";

    /** @type {number} */
    export let year;
    /** @type {number} */
    export let month;

    /**
     *
     * @type {{
     *  key: string;
     *  shift: import("../../components/settings").Shift | null;
     *  note: string;
     * }[]}
     */
    let data;

    $: year, month && initData();

    async function initData() {
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

<dialog open>
    <article>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="icon close" on:click={() => dispatch("close")}>
            <IoIosClose />
        </div>

        <h2 class="title">
            Data: {year}/{(month + 1).toString().padStart(2, "0")}
        </h2>

        <figure>
            <table role="grid">
                <thead>
                    <tr>
                        <th scope="col">Day</th>
                        <th scope="col">Shift</th>
                        <th scope="col">Note</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#if !!data}
                        {#each data.sort( (a, b) => (parseInt(a.key.split("-", 3)[2], 10) > parseInt(b.key.split("-", 3)[2], 10) ? 1 : -1) ) as item}
                            <tr>
                                <td class="key"><code>{item.key.split("-", 3)[2]}</code></td>
                                <td class="shift"><code>{item.shift?.name || null}</code></td>
                                <td class="note"><code>{item.note || ""}</code></td>
                                <td class="delete">
                                    <IconButton
                                        on:click={() => {
                                            // TODO: delete entry and reload table
                                        }}
                                    >
                                        <IoIosTrash />
                                    </IconButton>
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </figure>
    </article>
</dialog>

<style>
    dialog {
        padding: 0;
    }

    article {
        position: relative;
        width: 100%;
        max-width: 100%;
        height: 100%;
        max-height: 100%;
        margin: 0;
    }

    div.icon.close {
        z-index: 2;
        position: fixed;
        top: 0.6rem;
        right: 0;
        width: 45px;
        height: 45px;
    }

    table td.key {
        min-width: 4ch;
        max-width: 4ch;
    }

    table td.shift {
        max-width: 10ch;
    }

    table td.note {
        min-width: 25ch;
    }

    table td.delete {
        max-width: 6ch;
    }
</style>
