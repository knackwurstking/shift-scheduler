<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import IoIosClose from 'svelte-icons/io/IoIosClose.svelte'
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

    function initData() {
        data = [];
        for (let [key, value] of Object.entries(db.get(year, month))) {
            data.push({
                key,
                ...value,
            })
        }
        data = data;
    }
</script>

<dialog open>
    <article>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="icon close"
            on:click={() => dispatch("click")}
        >
            <IoIosClose />
        </div>

        <h2 class="title">
            Data: {year}/{month.toString().padStart(2, "0")}
        </h2>

        <!-- TODO: Make table scrollable -->
        <figure>
            <table role="grid">
                <thead>
                    <tr>
                        <th scope="col">Key</th>
                        <th scope="col">Shift</th>
                        <th scope="col">Note</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {#if !!data}
                        {#each data as item}
                            <tr>
                                <td class="key"><code>{item.key}</code></td>
                                <td class="shift"><code>{item.shift}</code></td>
                                <td class="note"><code>{item.note}</code></td>
                                <td class="delete">
                                    <IconButton
                                        on:click={() => {
                                            // TODO: delete entry
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
    article {
        width: 100%;
        height: 100%;
        position: relative;
    }

    div.icon.close {
        z-index: 2;
        position: absolute;
        top: 0.6rem;
        right: 0;
        width: 45px;
        height: 45px;
    }
</style>