<script>
    import * as db from "../../js/db";
    import EditDayDialog from "./EditDayDialog.svelte";

    /** @type {Day} */
    export let day;
    $: getData()

    /** @type {Shift | null} */
    export let editModeShift;

    let editItemDialog_open = false;

    async function getData() {
        if (!day) return
        if (!day.disable) return
        const storageItem = (await db.get(day.date));
        day.data = {
            shift: storageItem ? storageItem.shift : null,
            note: storageItem ? storageItem.note : "",
        }
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
        if (!day.disable) return;

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
    <!-- TODO: display the current date -->
    <!-- TODO: note marker -->
    <!-- TODO: display the custom or default shift -->
</div>

<style>
    div._container {
        width: 100%;
        height: 100%;
    }
</style>