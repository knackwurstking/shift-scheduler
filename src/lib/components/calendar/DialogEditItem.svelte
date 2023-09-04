<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    // TODO: notes and custom shift for the current grid item (date: "YYYY:MM:DD")
    export let open = false;

    /** @type {Date} */
    export let date;

    /** @type {ShiftItem | null} */
    export let shift = null;
    /** @type {string | null} */
    export let note = null;
</script>

<dialog {open}>
    <article>
        <!-- TODO: ... -->

        <button on:click={() => dispatch("submit", { default: null, shift, note })}>OK</button>
    </article>
</dialog>