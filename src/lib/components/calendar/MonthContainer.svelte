<script>
    import DayContainer from "./DayContainer.svelte";

    /** @type {Day[]} */
    export let data;
</script>

<div class="_cotainer grid">
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
    div._container {
    }

    div._container div.header {
    }

    div._container div.item {
    }
</style>
