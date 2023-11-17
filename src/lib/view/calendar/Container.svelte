<script>
    import { createEventDispatcher, onDestroy } from "svelte";

    import { Grid } from "svelte-css";

    import { createWeekStartStore } from "../../stores/week-start-store";

    import * as lang from "../../js/lang";

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
    class={"ui-container is-max no-user-select " + ($$restProps.class || "")}
    style:min-width="100%"
    on:transitionend={(ev) => {
        if (ev.propertyName === "transform") {
            dispatch("transformend");
        }
    }}
>
    <Grid.Root class="is-max-height is-debug">
        <Grid.Row height="2em" align="center">
            {#each headerItems as item}
                <Grid.Col width="calc(100% / 7)" height="100%">
                    <div
                        class="ui-card flex justify-center align-center"
                        class:sunday={item === "Sun"}
                        class:saturday={item === "Sat"}
                    >
                        {item}
                    </div>
                </Grid.Col>
            {/each}
        </Grid.Row>

        <slot />
    </Grid.Root>
</div>

<style>
    .ui-card {
        font-size: 0.9em;
    }

    .ui-card.saturday,
    .ui-card.sunday {
        font-weight: 700;
    }

    .ui-card:not(.saturday, .sunday) {
        font-weight: 400;
    }
</style>
