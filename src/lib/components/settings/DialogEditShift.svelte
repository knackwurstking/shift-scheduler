<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    /** @type {boolean} */
    export let open;

    /** @type {ShiftItem[]} */
    export let shifts = [];

    let currentShift = shifts[0].name;

    let name = shifts[0].name || "";
    let shortName = shifts[0].shortName || "";
    let visible = !!shifts[0].visible;

    $: {
        if (!!name && !!currentShift) {
            const shift = shifts.find(s => s.name === currentShift);
            if (shift) {
                shift.name = name;
            }
        }

        if (typeof shortName === "string" && !!currentShift) {
            const shift = shifts.find(s => s.name === currentShift);
            if (shift) {
                shift.shortName = shortName;
            }
        };

        if (typeof visible === "boolean" && !!currentShift) {
            const shift = shifts.find(s => s.name === currentShift);
            if (shift) {
                shift.visible = visible;
            }
        };
    }
</script>

<dialog {open}>
    <article>
        <select name="shiftsToEdit" bind:value={currentShift} on:change={() => {
            const shift = shifts.find(s => s.name === currentShift);
            if (shift) {
                name = shift.name;
                shortName = shift.shortName;
                visible = shift.visible;
            }
        }}>
            {#each shifts as shift}
                <option value={shift.name} selected={currentShift === shift.name}>{shift.name}</option>
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
            <input type="checkbox" name="visible" bind:checked={visible} />
        </label>

        <button class="secondary" on:click={() => {
            if (window.confirm(`Delete ${currentShift}?`)) {
                /** @type {number} */
                let idx;
                shifts.find((s, i) => {
                    if (s.name === currentShift) {
                        idx = i;
                        return true;
                    }

                    return false;
                });
                shifts = [
                    ...shifts.slice(0, idx),
                    ...shifts.slice(idx+1),
                ];
                name = ""; shortName = ""; visible = false;
                currentShift = undefined;
            }
        }}>Delete</button>

        <button
            on:click={() => dispatch("submit", shifts)}
        >OK</button>
    </article>
</dialog>
