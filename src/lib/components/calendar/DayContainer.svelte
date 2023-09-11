<script>
    import * as db from "../../js/db";

    /** @type {Day} */
    export let day;
    $: getData()

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

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class="_container"
    class:today={day.today}
    class:disabled={day.disable}
    on:click={() => {
        if (!day.disable) return;
        // TODO: handle `editMode` and/or `editDayDialog`
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