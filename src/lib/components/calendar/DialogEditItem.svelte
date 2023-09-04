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
        <h2 class="title">
            {date.getFullYear()} / {date.getMonth().toString().padStart(2, "0")} / {date
                .getDate()
                .toString()
                .padStart(2, "0")}
        </h2>

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

<style>
</style>
