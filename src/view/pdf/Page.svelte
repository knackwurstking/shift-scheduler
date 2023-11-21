<script>
    /** @type {number} */
    export let month;
    /** @type {import("../calendar").Day[]} */
    export let data;
</script>

<div>
    <!-- TODO: create table for month -->
    {#each data as day}
    {/each}
</div>

<style>
    div {
        width: 100%;
        aspect-ratio: 1 / 1.414;
    }
</style>
