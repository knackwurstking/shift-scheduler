<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    /** @type {boolean} */
    export let open;

    let name = "";
    let shortName = "";
    let visible = true;
</script>

<dialog {open}>
    <article>
        <label for="name">
            Name
            <input type="text" name="name" bind:value={name} />
        </label>

        <label for="shortName">
            Short Name
            <input type="text" name="shortName" bind:value={shortName} />
        </label>

        <label for="visible">
            Visible
            <input type="checkbox" name="visible" bind:checked={visible} />
        </label>

        <button class="secondary" on:click={() => (open = false)}>Cancel</button>

        <button
            on:click={() => dispatch("submit", { name, shortName, visible })}
        >OK</button>
    </article>
</dialog>
