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
    <form action="#">
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
            <input type="checkbox" name="visible" bind:value={visible} />
        </label>

        <button
            type="submit"
            on:click={() => dispatch("submit", { name, shortName, visible })}
        >
            OK
        </button>
    </form>
</dialog>
