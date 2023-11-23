<script>
    import Page from "./Page.svelte";
    import Article from "./Article.svelte";

    import * as Store from "../../lib/stores";

    import * as utils from "../../lib/js/utils";

    /******************************
     * Variable Export Definitions
     ******************************/

    export let year;
    $: if (!!year && !!weekStart) (async () => {
        const data = [];
        for (let month = 0; month < 12; month++) {
            data.push(
                await utils.getDaysForMonth(
                    year, month,
                    { weekStart: $weekStart }
                )
            );
        }
        pagesData = data;
    })();

    /***********************
     * Variable Definitions
     ***********************/

    /** @type {import("../calendar").Day[][]} */
    let pagesData = [];

    /********************
     * Store: week-start
     ********************/

    const weekStart = Store.weekStart.create();
</script>

<div {...$$restProps}>
    {#each pagesData as data, index}
        <Page>
            <Article
                style="height: 50%;"
                month={index}
                data={data}
            />
            <Article
                style="height: 50%;"
                month={index}
                data={data}
            />
        </Page>
    {/each}
</div>

<style>
    div {
        width: 100%;
    }
</style>
