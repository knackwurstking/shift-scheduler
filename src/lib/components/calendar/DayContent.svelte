<script>
    import * as utils from "../../js/utils";
    import * as db from "../../js/db";

    /** @type {number} */
    export let currentMonth;
    /** @type {import(".").Day} */
    export let day;
    /** @type {import("../settings").Settings} */
    export let settings;

    $: day && setData();

    async function setData() {
        if (currentMonth !== day.date.getMonth()) {
            day.data = { shift: null, note: "" };
            return
        }
        // TODO: this is too slow, need to update all the data before the transition ends
        const item = await db.get(day.date);
        day.data = {
            shift: item?.shift || utils.calcShiftStep(settings, day.date),
            note: item?.note || "",
        };
    }
</script>

<div
    class="day-content"
    class:disabled={day.date.getMonth() !== currentMonth}
    class:today={day.date.getFullYear() === new Date().getFullYear() &&
        day.date.getMonth() === new Date().getMonth() &&
        day.date.getDate() === new Date().getDate()}
    data-value={`${day.date.getMonth() === currentMonth ? day.date.getDate() : NaN}`}
>
    {#if !!day.data}
        <span class="shift">{day.data.shift?.shortName || ""}</span>
        {#if !!day.data.note}
            <div class="note-marker"></div>
        {/if}
    {/if}

    <span
        class="date"
        class:has-shift={!!day.data?.shift}
    >
        {day.date.getDate()}
    </span>
</div>

<style>
    /* TODO: add styles here */
    div.day-content {
        position: relative;

        display: flex;
        justify-content: center;
        align-items: center;

        overflow: hidden;

        border: 1px solid var(--muted-border-color);
        border-radius: var(--border-radius);
    }

    div.day-content.disabled {
        filter: blur(1px);
        opacity: 0.5;
    }

    div.day-content.today {
        color: var(--primary);
        border-color: var(--primary);
    }

    div.day-content .date {
        position: absolute;
        font-size: 1em;
    }

    div.day-content .date.has-shift {
        position: absolute;
        font-size: 0.85rem;
        top: 4px;
        left: 4px;
    }

    div.day-content .shift {
        display: block;
        position: absolute;
        font-size: 1rem;
        font-weight: bold;
        max-width: calc(100% - 8px);
        padding: 4px;
        overflow: hidden;
    }

    div.day-content .note-marker {
        position: absolute;
        right: -0.75em;
        bottom: -0.75em;
        width: 1.5em;
        height: 1.5em;
        transform: rotate(45deg);
        background-color: red;
    }
</style>
