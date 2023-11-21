<script>
    import * as Store from "../../lib/stores";

    import * as utils from "../../lib/js/utils";

    import Page from "./Page.svelte";

    /******************************
     * Variable Export Definitions
     ******************************/

    export let year;
    $: if (!!year) (async () => {
        data = [];
        for (let month = 0; month < 12; month++) {
            data.push(
                await utils.getDaysForMonth(
                    year, month,
                    { weekStart: $weekStart }
                )
            );
        }
    })();

    /***********************
     * Variable Definitions
     ***********************/

    /** @type {import("../calendar").Day[][]} */
    let data = [];

    /********************
     * Store: week-start
     ********************/

    const weekStart = Store.weekStart.create();
</script>

<div>
    {#each data as month, index}
        <Page month={index} data={month} />
    {/each}
</div>

<style>
    div {
        width: 100%;
    }
</style>
