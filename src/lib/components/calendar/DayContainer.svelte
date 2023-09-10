<script>
    import * as db from "../../js/db";
    import Item from "../infinite-scroll-view/Item.svelte";

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

<div
    class="_container"
    class:today={day.today}
>
</div>

<style>
    div._container {
        width: 100%;
        height: 100%;
    }
</style>