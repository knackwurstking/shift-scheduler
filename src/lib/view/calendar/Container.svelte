<script>
    import { createEventDispatcher, onDestroy } from "svelte";

    import { createWeekStartStore } from "../../stores/week-start-store";

    import * as lang from "../../js/lang";

    /******************************
     * Variable Export Definitions
     ******************************/

    let _class = "";
    export { _class as class };

    export let style = "";

    /***********************
     * Variable Definitions
     ***********************/

    const dispatch = createEventDispatcher();

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

    /** @type {import("svelte/store").Unsubscriber} */
    let unsubscribeWeekStart;
    const weekStart = createWeekStartStore();
    $: weekStart && setHeaderItems();

    /***********************
     * Function Definitions
     ***********************/

    async function setHeaderItems() {
        unsubscribeWeekStart = weekStart.subscribe((weekStart) => {
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
        });
    }

    /********************
     * Mount and Destroy
     ********************/

    onDestroy(() => {
        if (unsubscribeWeekStart) unsubscribeWeekStart();
    });
</script>

<div
    {...$$restProps}
    class={"container no-user-select " + _class}
    style={`
        min-width: 100%;
        width: 100%;
        max-width: 100%;

        height: 100%;
    ` + style}
    on:transitionend={(ev) => {
        if (ev.propertyName === "transform") {
            dispatch("transformend");
        }
    }}
>
    <div
        style={`
            height: 100%;
        `}
    >
        <div
            class="row"
            style={`
                height: 3em;
                align-items: center;
            `}
        >
            {#each headerItems as item}
                <div
                    class="col"
                    style={`
                        width: calc(100% / 7);
                        height: 100%;
                    `}
                >
                    <div
                        class="card"
                        class:sunday={item === "Sun"}
                        class:saturday={item === "Sat"}
                    >
                        {item}
                    </div>
                </div>
            {/each}
        </div>

        <slot />
    </div>
</div>

<style>
    .card {
        display: flex;
        justify-content: center;
        align-items: center;

        font-size: 0.9em;
    }

    .card.saturday,
    .card.sunday {
        font-weight: 700;
    }

    .card:not(.saturday, .sunday) {
        font-weight: 400;
    }
</style>
