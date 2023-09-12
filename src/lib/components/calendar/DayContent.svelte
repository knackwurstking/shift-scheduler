<script>
    import * as db from "../../js/db";

    /** @type {number} */
    export let currentMonth;
    /** @type {import(".").Day} */
    export let day;

    /** @type {import(".").DayData} */
    let data;

    $: {
        if (!!day) {
            if (currentMonth === day.date.getMonth()) {
                db.get(day.date).then((item) => {
                    data = { shift: item?.shift || null, note: item?.note || "" };
                });
            }
        }
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
    {#if !!data}
        <span class="shift">{data.shift?.shortName || ""}</span>
    {/if}

    <span
        class="date"
        class:has-shift={!!data?.shift}
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

    div.day-content.today .date {
        position: absolute;
        font-size: 1em;
    }

    div.day-content.today .date.has-shift {
        position: absolute;
        font-size: 0.85rem;
        top: 4px;
        left: 4px;
    }

    div.day-content.today .shift {
        display: block;
        position: absolute;
        font-size: 1rem;
        font-weight: bold;
        max-width: calc(100% - 8px);
        padding: 4px;
        overflow: hidden;
    }
</style>
