<script>
    import { createEventDispatcher } from "svelte";

    import Day from "./Day.svelte";

    import * as utils from "../../js/utils";
    import * as db from "../../js/db";

    /** @type {number} */
    export let index;
    /** @type {Date} */
    export let currentDate;

    $: currentDate && setDays();
    $: index === 1 && currentDate && dispatch("currentdatechange", currentDate);

    const dispatch = createEventDispatcher();

    /** @type {import(".").Day[]} */
    let days = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ].map(() => ({ date: currentDate, data: { shift: null, note: "" } }));

    async function setDays() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const startDay = new Date(year, month, 1).getDay();
        const data = await db.get(year, month);
        for (let i = 0; i < days.length; i++) {
            days[i].date = new Date(year, month, i + 1 - startDay);

            const key = `${days[i].date.getFullYear()}-${days[i].date.getMonth()}-${days[i].date.getDate()}`;
            days[i].data = {
                shift: data[key]?.shift || utils.calcShiftStep(days[i].date),
                note: data[key]?.note || "",
            };
        }
    }
</script>

<div class="container">
    <div>
        {#each days as day}
            <Day currentMonth={currentDate.getMonth()} {day} />
        {/each}
    </div>
</div>

<style>
    div.container {
        min-width: 100%;
        width: 100%;
        max-width: 100%;
        height: calc(100% - 40px);
        padding: 0;
        margin: 0;
    }

    div.container > div {
        width: 100%;
        height: 100%;

        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-gap: 0;
    }
</style>
