<script>
    import WeekDaysHeader from "./WeekDaysHeader.svelte";
    import Day from "./Day.svelte";

    import * as lang from "../../lib/js/lang";

    /** @type {number} */
    export let month;

    /** @type {import("../calendar").Day[]} */
    export let data;
</script>

<section
    {...$$restProps}
>
    <h3>{lang.get("months", month.toString())}</h3>

    <table>
        <WeekDaysHeader />

        <tbody>
            {#each [[0,7],[7,14],[14,21],[21,28],[28,35],[35,42]] as i}
                <tr>
                    {#each data.slice(i[0], i[1]) as day}
                        <Day
                            date={day.date.getDate()}
                            shift={day.data.shift}
                            empty={day.date.getMonth() !== month}
                        />
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</section>

<style>
    table {
        width: 100%;
        height: fit-content;
        max-height: 50%;
        table-layout: fixed;
    }
</style>
