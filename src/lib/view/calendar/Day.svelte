<script>
    /******************************
     * Variable Export Definitions
     ******************************/

    /** @type {number} */
    export let currentMonth;

    /** @type {import(".").Day} */
    export let day;
    $: day && setData();

    /***********************
     * Function Definitions
     ***********************/

    async function setData() {
        if (currentMonth !== day.date.getMonth()) {
            day.data = { shift: null, note: "" };
            return;
        }
    }
</script>

<div
    class={
        "ui-card " +
        "is-max " +
        "day " +
        (
            day.date.getMonth() === currentMonth
                ? `date-${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`
                : ""
        )
    }

    class:disabled={day.date.getMonth() !== currentMonth}

    class:today={day.date.getFullYear() === new Date().getFullYear() &&
        day.date.getMonth() === new Date().getMonth() &&
        day.date.getDate() === new Date().getDate()}

    class:has-note={!!day.data?.note}

    data-value={`${
        day.date.getMonth() === currentMonth ? day.date.getDate() : NaN
    }`}
>
    <span class="date" class:has-shift={!!day.data?.shift}>
        {day.date.getDate()}
    </span>

    {#if !!day.data?.shift}
        <span
            class="shift"
            style={
                `--shift-color: ${day.data.shift.color || "hsl(var(--card-foreground))"};`
            }
        >
            {day.data.shift.visible ? day.data.shift.shortName || "" : ""}
        </span>
    {/if}
</div>

<style>
    .ui-card {
        overflow: hidden;
    }

    .ui-card.disabled {
        opacity: 0.25;
    }

    .ui-card.today {
        border: 0.1em solid hsl(var(--primary));
        box-shadow: 0 0 0.1em hsla(var(--primary), 0.8) inset,
            0 0 0.25em hsla(var(--primary), 0.6) inset;
    }

    .ui-card .date {
        position: absolute;
        top: var(--spacing);
        left: var(--spacing);

        font-weight: normal;
        font-size: 3vmin;
        font-size: clamp(0em, 3vmin, 1em);
    }

    .ui-card.today .date {
        font-weight: bolder;
    }

    .ui-card .shift {
        position: absolute;
        top: var(--spacing);
        right: var(--spacing);
        bottom: var(--spacing);
        left: var(--spacing);

        display: flex;
        justify-content: center;
        align-items: center;

        font-weight: bold;
        font-size: 4vmin;
        font-size: clamp(0em, 4vmin, 1.5em);

        color: var(--shift-color);
        text-shadow: .1em .1em .1em hsl(var(--border));
    }

    .ui-card.has-note .date {
        color: hsl(var(--destructive));
        font-weight: 900;
    }

    .ui-card.has-note .date,
    .ui-card.today .date {
        text-shadow: .1em .1em .1em hsl(var(--border));
    }
</style>
