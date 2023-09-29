<script>
    import { ripple } from "../../js/ripple";
    let _ripple = ripple({ usePointer: true });

    /** @type {number} */
    export let currentMonth;
    /** @type {import(".").Day} */
    export let day;

    $: day && setData();

    async function setData() {
        if (currentMonth !== day.date.getMonth()) {
            day.data = { shift: null, note: "" };
            return;
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
    use:_ripple
>
    {#if !!day.data}
        {#if day.data.shift}
            <div class="background" style={`background-color: ${day.data.shift.color};`} />
            <span class="shift">
                {day.data.shift.visible ? day.data.shift.shortName || "" : ""}
            </span>
        {/if}
        {#if !!day.data.note}
            <div class="note-marker" />
        {/if}
    {/if}

    <span class="date" class:has-shift={!!day.data?.shift}>
        {day.date.getDate()}
    </span>
</div>

<style>
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

    :global(div.day-content.disabled .ripple) {
        display: none;
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

    div.day-content .background {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;

        opacity: 0.25;
    }

    div.day-content .shift {
        display: block;
        position: absolute;
        font-weight: bolder;
        font-size: 1rem;
        font-style: italic;
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
