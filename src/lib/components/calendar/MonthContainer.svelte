<script>
    import DayContainer from "./DayContainer.svelte";

    /** @type {Day[]} */
    export let data;
</script>

<div class="_container grid">
    <div class="header">Sun</div>
    <div class="header">Mon</div>
    <div class="header">Tue</div>
    <div class="header">Wen</div>
    <div class="header">Thu</div>
    <div class="header">Fri</div>
    <div class="header">Sat</div>

    {#each data as day}
        <div class="item">
            <DayContainer
                {day}
            />
        </div>
    {/each}
</div>

<style>
    div._container.grid {
        width: 100%;
        height: 100%;

        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 1.5rem 1fr 1fr 1fr 1fr 1fr 1fr;

        grid-column-gap: 2px;
        grid-row-gap: 2px;

        padding: var(--spacing) 0;
    }

    div._container div.header {
        text-align: center;
    }

    div._container div.header,
    div._container div.item {
        border: 1px solid var(--muted-border-color);
        border-radius: var(--border-radius);
    }
</style>
