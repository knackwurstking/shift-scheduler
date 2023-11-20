<script>
    import { createEventDispatcher } from "svelte";

    import { FlexGrid } from "svelte-css";

    import Day from "./Day.svelte";

    import * as db from "../../lib/js/db";

    import * as Store from "../../lib/stores";

    /******************************
     * Variable Export Definitions
     ******************************/

    /** @type {number} */
    export let index;
    /** @type {Date} */
    export let currentDate;
    $: currentDate && setDays();
    $: index === 1 && currentDate && dispatch("currentdatechange", currentDate);

    /********************
     * Store: shift-setup
     ********************/

    const shiftSetup = Store.shiftSetup.create();

    /********************
     * Store: week-start
     ********************/

    const weekStart = Store.weekStart.create();

    /***********************
     * Variable Definitions
     ***********************/

    const dispatch = createEventDispatcher();

    /** @type {import(".").Day[]} */
    let days = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ].map(() => ({ date: currentDate, data: { shift: null, note: "" } }));

    /***********************
     * Function Definitions
     ***********************/

    async function setDays() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        let startDay = new Date(year, month, 1).getDay();
        if ($weekStart === "mon") {
            startDay = startDay === 0 ? 6 : startDay - 1;
        }

        const data = await db.get(year, month);

        for (let i = 0; i < days.length; i++) {
            days[i].date = new Date(year, month, i + 1 - startDay);

            const key = `${days[i].date.getFullYear()}-${days[
                i
            ].date.getMonth()}-${days[i].date.getDate()}`;

            let shift = data[key]?.shift;
            if (shift) {
                shift = shiftSetup.getShiftForID(shift.id) || shift;
            }

            days[i].data = {
                shift: shift || shiftSetup.calcShiftStep(days[i].date),
                note: data[key]?.note || "",
            };
        }
    }
</script>

<FlexGrid.Row class="is-max-height" gap=".1em">
    {#each days.slice(0, 7) as day}
        <FlexGrid.Col class="is-max-height" style="width: calc(100% / 7);">
            <Day currentMonth={currentDate.getMonth()} {day} />
        </FlexGrid.Col>
    {/each}
</FlexGrid.Row>

<FlexGrid.Row class="is-max-height" gap=".1em">
    {#each days.slice(7, 14) as day}
        <FlexGrid.Col class="is-max-height" style="width: calc(100% / 7);">
            <Day currentMonth={currentDate.getMonth()} {day} />
        </FlexGrid.Col>
    {/each}
</FlexGrid.Row>

<FlexGrid.Row class="is-max-height" gap=".1em">
    {#each days.slice(14, 21) as day}
        <FlexGrid.Col class="is-max-height" style="width: calc(100% / 7);">
            <Day currentMonth={currentDate.getMonth()} {day} />
        </FlexGrid.Col>
    {/each}
</FlexGrid.Row>

<FlexGrid.Row class="is-max-height" gap=".1em">
    {#each days.slice(21, 28) as day}
        <FlexGrid.Col class="is-max-height" style="width: calc(100% / 7);">
            <Day currentMonth={currentDate.getMonth()} {day} />
        </FlexGrid.Col>
    {/each}
</FlexGrid.Row>

<FlexGrid.Row class="is-max-height" gap=".1em">
    {#each days.slice(28, 35) as day}
        <FlexGrid.Col class="is-max-height" style="width: calc(100% / 7);">
            <Day currentMonth={currentDate.getMonth()} {day} />
        </FlexGrid.Col>
    {/each}
</FlexGrid.Row>

<FlexGrid.Row class="is-max-height" gap=".1em">
    {#each days.slice(35, 42) as day}
        <FlexGrid.Col class="is-max-height" style="width: calc(100% / 7);">
            <Day currentMonth={currentDate.getMonth()} {day} />
        </FlexGrid.Col>
    {/each}
</FlexGrid.Row>
