<script>
    import { createEventDispatcher, onDestroy } from "svelte";
    import { UI } from "ui";

    import { lang } from "../../lib/js";
    import * as Store from "../../lib/stores";

    const cleanUp = [];
    const dispatch = createEventDispatcher();
    const weekStart = Store.WeekStart.create();

    /** @type {string[]} */
    let headerItems = [
        lang.get()["week-days"]["sun"],
        lang.get()["week-days"]["mon"],
        lang.get()["week-days"]["tue"],
        lang.get()["week-days"]["wed"],
        lang.get()["week-days"]["thu"],
        lang.get()["week-days"]["fri"],
        lang.get()["week-days"]["sat"],
    ];

    $: !!weekStart && initWeekStart();

    async function initWeekStart() {
        cleanUp.push(
            weekStart.subscribe((weekStart) => {
                const items = [
                    lang.get()["week-days"]["sun"],
                    lang.get()["week-days"]["mon"],
                    lang.get()["week-days"]["tue"],
                    lang.get()["week-days"]["wed"],
                    lang.get()["week-days"]["thu"],
                    lang.get()["week-days"]["fri"],
                    lang.get()["week-days"]["sat"],
                ];

                if (weekStart === "mon") {
                    items.push(items.shift());
                }

                headerItems = items;
            }),
        );
    }

    onDestroy(() => cleanUp.forEach((fn) => fn()));
</script>

<div
    {...$$restProps}
    class={"calendar-container-item is-max no-user-select " +
        ($$restProps.class || "")}
    style:min-width="100%"
    on:transitionend={(ev) => {
        if (ev.propertyName === "transform") {
            dispatch("transformend");
        }
    }}
>
    <UI.FlexGrid.Root class="is-max" gap=".1em">
        <UI.FlexGrid.Row style="height: 2em" gap=".1em">
            {#each headerItems as item}
                <UI.FlexGrid.Col
                    style={"font-family: var(--font-family-heading);" +
                        "width: calc(100% / 7);" +
                        "height: 100%;"}
                >
                    <div
                        class="ui-card is-max flex justify-center align-center"
                        class:sunday={item === "Sun"}
                        class:saturday={item === "Sat"}
                    >
                        {item}
                    </div>
                </UI.FlexGrid.Col>
            {/each}
        </UI.FlexGrid.Row>

        <slot />
    </UI.FlexGrid.Root>
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
