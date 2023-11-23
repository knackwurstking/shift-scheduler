<script>
    import WeekDaysHeader from "./WeekDaysHeader.svelte";
    import Day from "./Day.svelte";

    import * as lang from "../../lib/js/lang";

    /** @type {number} */
    export let month;
    /** @type {import("../calendar").Day[]} */
    export let data;
</script>

<div
    class="has-border"
>
    <h3>{lang.get("months", month.toString())}</h3>

    <table
        style:width="100%"
        style:height="50%"
    >
        <WeekDaysHeader />

        <tbody>
            {#each [[0,7],[7,14],[14,21],[21,28],[28,35],[35,42]] as i}
                <tr>
                    {#each data.slice(i[0], i[1]) as day}
                        {#if day.date.getMonth() === month}
                            <Day
                                date={day.date.getDate()}
                                shift={day.data.shift}
                            />
                        {:else}
                            <td />
                        {/if}
                    {/each}
                </tr>
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
