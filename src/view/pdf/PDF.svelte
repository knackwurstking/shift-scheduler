<script>
    import * as Store from "../../lib/stores";

    import * as utils from "../../lib/js/utils";

    import Page from "./Page.svelte";

    /******************************
     * Variable Export Definitions
     ******************************/

    export let year;
    $: if (!!year && !!weekStart) (async () => {
        const newData = [];
        for (let month = 0; month < 12; month++) {
            newData.push(
                await utils.getDaysForMonth(
                    year, month,
                    { weekStart: $weekStart }
                )
            );
        }
        data = newData;
    })();

    /***********************
     * Variable Definitions
     ***********************/

    /** @type {import("../calendar").Day[][]} */
    let data = [];
    $: console.debug(data);

    /********************
     * Store: week-start
     ********************/

    const weekStart = Store.weekStart.create();
</script>

<div {...$$restProps}>
    {#each data as month, index}
        <Page month={index} data={month} />
    {/each}
</div>

<style>
    div {
        width: 100%;
    }
</style>
