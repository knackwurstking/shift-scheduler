<script>
    import * as db from "../../js/db";
    import EditDayDialog from "./EditDayDialog.svelte";

    /** @type {Day} */
    export let day;
    $: getData();

    /** @type {Shift | null} */
    export let editModeShift;

    let editItemDialog_open = false;

    async function getData() {
        if (!day) return;
        if (!day.disable) return;
        const storageItem = await db.get(day.date);
        day.data = {
            shift: storageItem ? storageItem.shift : null,
            note: storageItem ? storageItem.note : "",
        };
        if (day.today) console.debug(day);
    }
</script>

{#if editItemDialog_open}
    <EditDayDialog
        bind:open={editItemDialog_open}
        {day}
        on:submit={async ({ detail }) => {
            editItemDialog_open = false;
            day.data = detail;
            if (day.data.shift) {
                await db.put(day.date, day.data.shift, day.data.note);
            } else if (day.data.note) {
                await db.put(day.date, null, day.data.note);
            } else {
                await db.remove(day.date);
            }
        }}
    />
{/if}

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class="_container"
    class:today={day.today}
    class:disabled={day.disable}
    on:click={async () => {
        if (day.disable) return;

        if (!!editModeShift) {
            day.data.shift = !!editModeShift.name ? editModeShift : null;
            if (!day.data.shift?.name) {
                await db.remove(day.date);
            } else {
                await db.put(day.date, editModeShift, day.data.note);
            }
        } else {
            editItemDialog_open = true;
        }
    }}
>
    <span class="date">{day.date.getDate()}</span>

    {#if !!day.data.note}
        <div class="note-marker" />
    {/if}

    {#if !!day.data.shift}
        <span class="shift" class:visible={!!day.data.shift.visible}>
            {day.data.shift.shortName}
        </span>
    {:else if !!day.defaultShift}
        <span class="shift" class:visible={!!day.defaultShift.visible}>
            {day.defaultShift.shortName}
        </span>
    {/if}
</div>

<style>
    div._container {
        position: relative;
        width: 100%;
        height: 100%;
    }

    div._container.today {
        color: orange;
    }

    div._container.disabled {
        opacity: 0.7;
        filter: blur(1px);
    }

    div._container .date {
        margin-top: calc(var(--spacing) / 2);
        margin-left: calc(var(--spacing) / 2);

        font-size: 0.85em;

        text-decoration: underline;
    }

    div._container .note-marker {
        position: absolute;
        right: -0.8rem;
        bottom: -0.8rem;
        width: 1.5rem;
        height: 1.5rem;
        background-color: red;
        transform: rotate(45deg);
    }

    div._container .shift {
        position: absolute;

        top: calc(50% - 0.5em);
        left: 4px;
        width: calc(100% - 8px);

        text-align: center;
        font-weight: bold;

        border-radius: var(--border-radius);

        font-size: 1em;
    }

    div._container .shift:not(.visible) {
        display: none;
    }
</style>
