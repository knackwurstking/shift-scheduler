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
    class={`card no-shadow day ${
        day.date.getMonth() === currentMonth
            ? `date-${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`
            : ""
    }`}
    class:disabled={day.date.getMonth() !== currentMonth}
    class:today={day.date.getFullYear() === new Date().getFullYear() &&
        day.date.getMonth() === new Date().getMonth() &&
        day.date.getDate() === new Date().getDate()}
    class:has-note={!!day.data?.note}
    data-value={`${
        day.date.getMonth() === currentMonth ? day.date.getDate() : NaN
    }`}
>
    {#if day.data.shift}
        <div
            class="background"
            style={`
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: ${day.data.shift.color || "transparent"};
                opacity: .25;
            `}
        />
    {/if}

    <span class="date" class:has-shift={!!day.data?.shift}>
        {day.date.getDate()}
    </span>

    {#if !!day.data?.shift}
        <span class="shift">
            {day.data.shift.visible ? day.data.shift.shortName || "" : ""}
        </span>
    {/if}
</div>

<style>
    .card {
        overflow: hidden;
    }

    .card.disabled {
        opacity: 0.25;
    }

    .card.today {
        border: 0.1em solid hsl(var(--primary));
        box-shadow: 0 0 0.1em hsla(var(--primary), 0.8) inset,
            0 0 0.25em hsla(var(--primary), 0.6) inset;
    }

    .date {
        position: absolute;
        top: var(--spacing);
        left: var(--spacing);

        font-weight: 300;
        font-size: 3vmin;
        font-size: clamp(0em, 3vmin, 1em);

        text-decoration: underline;
    }

    .card.today .date {
        font-weight: 900;
    }

    .shift {
        position: absolute;
        top: var(--spacing);
        right: var(--spacing);
        bottom: var(--spacing);
        left: var(--spacing);

        display: flex;
        justify-content: center;
        align-items: center;

        font-weight: 500;
        font-size: 4vmin;
        font-size: clamp(0em, 4vmin, 1.5em);
    }

    .has-note .date {
        color: hsl(var(--destructive));
    }
</style>
