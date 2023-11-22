<script>
    import WeekDaysHeader from "./WeekDaysHeader.svelte";
    import Day from "./Day.svelte";

    import * as lang from "../../lib/js/lang";

    /** @type {number} */
    export let month;
    /** @type {import("../calendar").Day[]} */
    export let data;
</script>

<div>
    <h3>{lang.get("months", month.toString())}</h3>

    <table>
        <WeekDaysHeader />

        <tbody>
            {#each data as day}
                {#if day.date.getMonth() === month}
                    <Day
                        date={day.date.getDate()}
                        shift={day.data.shift}
                    />
                {/if}
            {/each}
        </tbody>
    </table>
</div>

<style>
    div {
        width: 100%;
        aspect-ratio: 1 / 1.414;
    }
</style>
