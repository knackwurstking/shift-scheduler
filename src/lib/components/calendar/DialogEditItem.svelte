<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let open = false;

    /** @type {Date} */
    export let date;
    /** @type {GridItem} */
    export let item;
    /** @type {Settings} */
    export let settings;
</script>

<dialog {open}>
    <article>
        <!-- TODO: display year/month/date as title -->

        <!-- TODO: custom shift select with a reset button? -->

        <!-- TODO: multiline note entry -->

        <button
            on:click={() =>
                dispatch("submit", {
                    default: item.data.default || null,
                    shift: item.data.shift || null,
                    note: item.data.note || null,
                })}
        >
            OK
        </button>
    </article>
</dialog>
