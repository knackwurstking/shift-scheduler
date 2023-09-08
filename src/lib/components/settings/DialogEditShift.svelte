<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    /** @type {boolean} */
    export let open;

    /** @type {ShiftItem[]} */
    export let shifts = [];

    /** @type {string} */
    export let selected = "0";

    let hidden = !shifts[selected].visible; 
    $: (hidden !== shifts[parseInt(selected)].visible) && (shifts[parseInt(selected)].visible = !hidden);
</script>

<dialog {open}>
    <article>
        <select
            name="shiftsToEdit"
            bind:value={selected}
        >
            {#each shifts as shift, index}
                <option value={index.toString()} selected={parseInt(selected) === index}>{shift.name}</option>
            {/each}
        </select>

        <label for="name">
            Name
            <input type="text" name="name" bind:value={shifts[parseInt(selected)].name} />
        </label>

        <label for="shortName">
            ShortName
            <input type="text" name="shortName" bind:value={shifts[parseInt(selected)].shortName} />
        </label>

        <label for="hidden">
            <input type="checkbox" name="hidden" bind:checked={hidden} />
            Hidden Shift (Not visible in calendar)
        </label>

        <button
            class="secondary"
            on:click={() => {
                if (window.confirm(`Delete "${shifts[parseInt(selected)].name}"?`)) {
                    shifts = [...shifts.slice(0, parseInt(selected)), ...shifts.slice(parseInt(selected) + 1)];
                    if (!shifts.length) open = !open;
                    else selected = "0";
                }
            }}>Delete</button
        >

        <button on:click={() => dispatch("submit", shifts)}>OK</button>
    </article>
</dialog>
