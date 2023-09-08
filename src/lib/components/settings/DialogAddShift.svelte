<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    /** @type {boolean} */
    export let open;

    let name = "";
    let shortName = "";
    let hidden = false;
</script>

<dialog {open}>
    <article>
        <label for="name">
            Shift Name
            <input type="text" name="name" bind:value={name} />
        </label>

        <label for="shortName">
            Short Shift Name
            <input type="text" name="shortName" bind:value={shortName} />
        </label>

        <label for="hidden">
            <input type="checkbox" name="hidden" bind:checked={hidden} />
            Hidden Shift (Not visible in calendar)
        </label>

        <button class="secondary" on:click={() => (open = false)}>Cancel</button>

        <button
            on:click={() =>
                dispatch("submit", {
                    name,
                    shortName: shortName || name[0] || "",
                    visible: !hidden,
                })}
        >
            OK
        </button>
    </article>
</dialog>

<style>
    article {
        padding: var(--spacing);
    }

    dialog article > button:nth-child(4) {
        margin-top: var(--spacing);
    }
</style>