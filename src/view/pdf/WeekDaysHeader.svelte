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
        lang.get("weekDays", "sun"),
        lang.get("weekDays", "mon"),
        lang.get("weekDays", "tue"),
        lang.get("weekDays", "wed"),
        lang.get("weekDays", "thu"),
        lang.get("weekDays", "fri"),
        lang.get("weekDays", "sat"),
    ];

    /********************
     * Store: week-start
     ********************/

    const weekStart = Store.weekStart.create();
    $: !!weekStart && cleanUp.push(weekStart.subscribe(weekStart => {
        const items = [
            lang.get("weekDays", "sun"),
            lang.get("weekDays", "mon"),
            lang.get("weekDays", "tue"),
            lang.get("weekDays", "wed"),
            lang.get("weekDays", "thu"),
            lang.get("weekDays", "fri"),
            lang.get("weekDays", "sat"),
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
            <th class="is-text-center no-padding">{item}</th>
        {/each}
    </tr>
</thead>
