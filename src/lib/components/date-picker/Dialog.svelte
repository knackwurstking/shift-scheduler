<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    /** @type {boolean} */
    export let open;

    /** @type {number} */
    export let year;
    /** @type {number} */
    export let month;
</script>

<dialog class="date-picker--dialog" {open}>
    <article>
        <label>
            Choose a Year
            <input type="number" bind:value={year} /> 
        </label>

        <label>
            And a Month
            <input type="number" min={1} max={12} bind:value={month} /> 
        </label>

        <button
            type="submit"
            on:click={() => dispatch("submit", { year, month })}
        >
            OK
        </button>
    </article>
</dialog>

<style>
    dialog {
        width: 100%;
        height: 100%;
    }

    dialog article {
        padding: var(--spacing);
    }
</style>
