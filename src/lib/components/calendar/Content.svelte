<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import DayContent from "./DayContent.svelte";

    import * as utils from "../../js/utils";

    /** @type {number} */
    export let index;
    /** @type {Date} */
    export let currentDate;
    /** @type {import("../settings").Settings} */
    export let settings;

    /** @type {import(".").Day[]} */
    let days = [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ].map(() => ({ date: currentDate, data: { shift: null, note: "" } }))

    $: currentDate && setDays();
    $: index === 1 && currentDate &&  dispatch("currentdatechange", currentDate);

    async function setDays() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const startDay = new Date(year, month, 1).getDay();
            for (let i = 0; i < days.length; i++) {
                days[i].date = new Date(year, month, i + 1 - startDay);
                // TODO: get custom data (shift & note) (but don't use this slow indexedDB anymore)
                days[i].data = {
                    shift: utils.calcShiftStep(settings, days[i].date),
                    note: "",
                };
            }
    }
</script>

<div class="container">
    <div>
        {#each days as day}
            <DayContent
                currentMonth={currentDate.getMonth()}
                {settings}
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