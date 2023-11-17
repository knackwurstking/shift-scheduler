<script>
    import { onDestroy } from "svelte";

    import { EditDayDialog } from "./lib/components";

    import SettingsView from "./lib/view/settings";
    import CalendarView from "./lib/view/calendar";

    import {
        createEditModeStore,
        createEditModeIndexStore,
    } from "./lib/stores/edit-mode-store";

    import { createViewStore } from "./lib/stores/view-store";
    import { createShiftSetupStore } from "./lib/stores/shift-setup-store";

    import * as db from "./lib/js/db";

    /***********
     * Bindings
     ***********/

    /** @type {EditDayDialog} */
    let editDayDialog;

    /** @type {CalendarView} */
    let calendarView;

    /******************************
     * Variable Export Definitions
     ******************************/

    /** @type {Date} */
    export let currentDate = new Date();

    /**************
     * Store: view
     **************/

    let unsubscribeView;

    const view = createViewStore();

    $: view && subscribeView();

    async function subscribeView() {
        const handler = async (view) => console.debug(`view=${view}`);
        console.debug("subscribe to view");
        unsubscribeView = view.subscribe(handler);
    }

    /**************************************
     * Store: edit-mode && edit-mode-index
     **************************************/

    const editMode = createEditModeStore();
    const editModeIndex = createEditModeIndexStore();

    /*********************
     * Store: shift-setup
     *********************/

    const shiftSetup = createShiftSetupStore();

    /***********************
     * Function Definitions
     ***********************/

    /**
     * @returns {Promise<(-2 | import("./lib/stores/shift-setup-store").Shift | undefined)>}
     */
    async function getEditModeShift() {
        if ($editModeIndex === -2) return -2; // NOTE: "reset"
        return shiftSetup.getShift($editModeIndex);
    }

    /**
     * @param {Date} date
     */
    async function animateDayCardItem(date) {
        const el = calendarView.querySelector(
            `.card.day.date-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        );
        if (el) {
            el.animate(
                [
                    { transform: "scale(1)" },
                    { transform: "scale(.9)" },
                    { transform: "scale(1)" },
                ],
                { duration: 500 }
            );
        }
    }

    /********************
     * Mount and Destroy
     ********************/

    onDestroy(() => {
        if (unsubscribeView) unsubscribeView();
    });
</script>

<main
    class="ui-container is-debug"
    style:bottom={$editMode ? "4.5em" : "0"}
>
    {#if $view === "calendar"}
        <CalendarView
            bind:this={calendarView}
            bind:currentDate
            on:click={async (ev) => {
                if (ev.detail && $editMode) {
                    let shift = await getEditModeShift();
                    if (!shift) return;

                    animateDayCardItem(ev.detail);

                    const key = `${ev.detail.getFullYear()}-${ev.detail.getMonth()}-${ev.detail.getDate()}`;

                    const { note } = await db.getData(
                        ev.detail.getFullYear(),
                        ev.detail.getMonth(),
                        key
                    );

                    if (shift === -2) {
                        // reset shift for this day
                        shift = null;

                        if (note)
                            await db.setData(
                                ev.detail.getFullYear(),
                                ev.detail.getMonth(),
                                key,
                                null,
                                note
                            );
                        else
                            await db.removeData(
                                ev.detail.getFullYear(),
                                ev.detail.getMonth(),
                                key
                            );
                    } else {
                        // update shift for this day
                        await db.setData(
                            ev.detail.getFullYear(),
                            ev.detail.getMonth(),
                            key,
                            shift,
                            note
                        );
                    }

                    calendarView.reload();
                } else if (ev.detail) {
                    animateDayCardItem(ev.detail);

                    setTimeout(() => {
                        editDayDialog.open(
                            ev.detail.getFullYear(),
                            ev.detail.getMonth(),
                            ev.detail.getDate()
                        );
                    }, 100);
                }
            }}
            on:currentdatechange={({ detail }) => (currentDate = detail)}
        />
    {:else if $view === "settings"}
        <SettingsView />
    {/if}
</main>

<EditDayDialog
    bind:this={editDayDialog}
    on:close={async () => editDayDialog.close()}
    on:submit={async ({ detail }) => {
        const key = `${detail.date.year}-${detail.date.month}-${detail.date.date}`;

        if (!detail.shift && !detail.note) {
            await db.removeData(detail.date.year, detail.date.month, key);
        } else {
            await db.setData(
                detail.date.year,
                detail.date.month,
                key,
                detail.shift,
                detail.note
            );
        }

        editDayDialog.close();
        calendarView.reload();
    }}
/>

<style>
    main {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;

        padding: 0;
        padding-top: 3.5em;
    }
</style>
