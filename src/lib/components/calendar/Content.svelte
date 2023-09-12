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

<div>
    <div>
        {#each days as day}
            <DayContent
                currentMonth={currentDate.getMonth()}
                {day}
            />
        {/each}
    </div>
</div>