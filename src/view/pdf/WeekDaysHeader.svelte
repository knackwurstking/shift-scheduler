<script>
    import { onDestroy } from "svelte";

    import * as Store from "../../lib/stores";

    import * as lang from "../../lib/js/lang";

    /***********************
     * Variable Definitions
     ***********************/

    let cleanUp = []

    /** @type {string[]} */
    let headerItems = [
        lang.get("misc", "sun"),
        lang.get("misc", "mon"),
        lang.get("misc", "tue"),
        lang.get("misc", "wed"),
        lang.get("misc", "thu"),
        lang.get("misc", "fri"),
        lang.get("misc", "sat"),
    ];

    /********************
     * Store: week-start
     ********************/

    const weekStart = Store.weekStart.create();
    $: !!weekStart && cleanUp.push(weekStart.subscribe(weekStart => {
        const items = [
            lang.get("misc", "sun"),
            lang.get("misc", "mon"),
            lang.get("misc", "tue"),
            lang.get("misc", "wed"),
            lang.get("misc", "thu"),
            lang.get("misc", "fri"),
            lang.get("misc", "sat"),
        ];

        if (weekStart === "mon") {
            items.push(items.shift());
        }

        headerItems = items;
    }));

    /********************
     * Mount and Destroy
     ********************/

    onDestroy(() => cleanUp.forEach(fn => fn()));
</script>

<thead>
    <tr>
        {#each headerItems as item}
            <th>{item}</th>
        {/each}
    </tr>
</thead>
