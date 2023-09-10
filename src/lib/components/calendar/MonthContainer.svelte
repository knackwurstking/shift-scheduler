<script>
    import DayContainer from "./DayContainer.svelte";

    /** @type {Day[]} */
    export let data;
</script>

<div class="_cotainer">
    <span class="_day">
        {#each data as day}
            <DayContainer
                {day}
            />
        {/each}
    </span>
</div>
