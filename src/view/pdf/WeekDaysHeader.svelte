<script>
    import { onDestroy } from "svelte";

    import * as Store from "../../lib/stores";

    import * as lang from "../../lib/js/lang";

    /***********************
     * Variable Definitions
     ***********************/

    let cleanUp = [];

    /** @type {string[]} */
    let headerItems = [
        lang.get("week-days", "sun"),
        lang.get("week-days", "mon"),
        lang.get("week-days", "tue"),
        lang.get("week-days", "wed"),
        lang.get("week-days", "thu"),
        lang.get("week-days", "fri"),
        lang.get("week-days", "sat"),
    ];

    /********************
     * Store: week-start
     ********************/

    const weekStart = Store.weekStart.create();
    $: !!weekStart &&
        cleanUp.push(
            weekStart.subscribe((weekStart) => {
                const items = [
                    lang.get("week-days", "sun"),
                    lang.get("week-days", "mon"),
                    lang.get("week-days", "tue"),
                    lang.get("week-days", "wed"),
                    lang.get("week-days", "thu"),
                    lang.get("week-days", "fri"),
                    lang.get("week-days", "sat"),
                ];

                if (weekStart === "mon") {
                    items.push(items.shift());
                }

                headerItems = items;
            }),
        );

    /********************
     * Mount and Destroy
     ********************/

    onDestroy(() => cleanUp.forEach((fn) => fn()));
</script>

<thead>
    <tr>
        {#each headerItems as item}
            <th class="is-text-center no-padding">{item}</th>
        {/each}
    </tr>
</thead>
