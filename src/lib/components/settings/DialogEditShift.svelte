<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    /** @type {boolean} */
    export let open;

    /** @type {ShiftItem[]} */
    export let shiftsToEdit = [];

    let name = "";
    let shortName = "";
    let visible = true;
</script>

<dialog {open}>
    <form action="#">
        <select name="shiftsToEdit">
            {#each shiftsToEdit as shift}
                <option value={shift.name}>{shift.name}</option>
            {/each}
        </select>

        <label for="name">
            Name
            <input type="text" name="name" bind:value={name} />
        </label>

        <label for="shortName">
            ShortName
            <input type="text" name="shortName" bind:value={shortName} />
        </label>

        <label for="visible">
            Visible
            <input type="checkbox" name="visible" bind:value={visible} />
        </label>

        <button
            type="submit"
            on:click={() => dispatch("submit", shiftsToEdit)}
        >OK</button>
    </form>
</dialog>
