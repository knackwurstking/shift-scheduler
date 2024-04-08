<script>
    import { lang } from "../../lib/js";

    import WeekDaysHeader from "./pdf-page-section/WeekDaysHeader.svelte";
    import TableData from "./pdf-page-section/TableData.svelte";

    /** @type {number} */
    export let month;
    /** @type {_Day[]} */
    export let data;
</script>

<section {...$$restProps}>
    <h3>{lang.get()["months"][month.toString()]}</h3>

    <table class="is-max-width">
        <WeekDaysHeader />

        <tbody>
            {#each [[0, 7], [7, 14], [14, 21], [21, 28], [28, 35], [35, 42]] as i}
                <tr>
                    {#each data.slice(i[0], i[1]) as day}
                        <TableData
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
        height: fit-content;
        max-height: 50%;
        table-layout: fixed;
    }
</style>
