<script>
    import DayContent from "./DayContent.svelte";

    /** @type {number} */
    export let index;
    /** @type {Date} */
    export let currentDate;

    /** @type {import(".").Day[]} */
    let days = [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ].map(() => ({ date: currentDate }))
</script>

<div class="container">
    <div>
        {#each days as day}
            <DayContent
                currentMonth={currentDate.getMonth()}
                {day}
            />
        {/each}
    </div>
</div>

<style>
    div.container {
        min-width: 100%;
        width: 100%;
        max-width: 100%;
        height: calc(100% - 44px);
        padding: 4px;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    div.container > div {
        width: 100%;
        height: 100%;

        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr ;
        grid-gap: 4px;
    }
</style>