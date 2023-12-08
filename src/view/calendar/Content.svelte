<script>
    import { createEventDispatcher } from "svelte";

    import { FlexGrid } from "svelte-css";

    import Day from "./Day.svelte";

    import * as Store from "../../lib/stores";

    import * as utils from "../../lib/js/utils";

    /******************************
     * Variable Export Definitions
     ******************************/

    /** @type {number} */
    export let index;

    /** @type {Date} */
    export let currentDate;

    $: index === 1 && currentDate && dispatch("currentdatechange", currentDate);

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
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ].map(() => ({ date: currentDate, data: { shift: null, note: "" } }));

    $: currentDate && utils.getDaysForMonth(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        {
            weekStart: $weekStart
        }
    ).then(result => days = result);
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
