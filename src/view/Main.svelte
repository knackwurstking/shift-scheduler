<script>
    import { onDestroy, onMount } from "svelte";

    import { EditDayDialog } from "../lib/components";

    import { db, constants } from "../lib/js";
    import * as Store from "../lib/stores";

    import Calendar from "./calendar";
    import Pdf from "./pdf";
    import Settings from "./settings";

    const cleanUp = [];

    const view = Store.View.create();
    const editMode = Store.EditMode.create();
    const shiftSetup = Store.ShiftSetup.create();

    /** @type {Date} */
    export let currentDate = new Date();

    /** @type {EditDayDialog} */
    let editDayDialog;
    /** @type {Calendar} */
    let calendarView;

    /**
     * @returns {Promise<(-2 | _Shift | undefined)>}
     */
    async function getEditModeShift() {
        if ($editMode.index === -2) return -2; // NOTE: "reset"
        return shiftSetup.getShift($editMode.index);
    }

    /**
     * @param {Date} date
     */
    async function animateDayCardItem(date) {
        const el = calendarView.querySelector(
            `.ui-card.day.date-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        );
        if (el) {
            el.animate(
                [
                    { transform: "scale(1)" },
                    { transform: "scale(.9)" },
                    { transform: "scale(1)" },
                ],
                { duration: 500 },
            );
        }
    }

    /**
     * @param {CustomEvent<Date | null>} ev
     */
    async function handleCalendarClick(ev) {
        if (!ev.detail) {
            return;
        }

        if ($editMode.open) {
            // edit selected day (update shift)
            let shift = await getEditModeShift();
            if (!shift) return;

            animateDayCardItem(ev.detail);

            const key = `${ev.detail.getFullYear()}-${ev.detail.getMonth()}-${ev.detail.getDate()}`;

            const { note } = await db.getData(
                ev.detail.getFullYear(),
                ev.detail.getMonth(),
                key,
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
                        note,
                    );
                else
                    await db.removeData(
                        ev.detail.getFullYear(),
                        ev.detail.getMonth(),
                        key,
                    );
            } else {
                // update shift for this day
                await db.setData(
                    ev.detail.getFullYear(),
                    ev.detail.getMonth(),
                    key,
                    shift,
                    note,
                );
            }

            calendarView.reload();
            return;
        }

        // animate click event and open the dialog (day-dialog) with a timeout of 100ms
        animateDayCardItem(ev.detail);

        setTimeout(() => {
            editDayDialog.open(
                ev.detail.getFullYear(),
                ev.detail.getMonth(),
                ev.detail.getDate(),
            );
        }, 100);
    }

    /**
     * @param {_DayDialogSubmit} detail
     */
    async function submitDay(detail) {
        const key = `${detail.date.year}-${detail.date.month}-${detail.date.date}`;

        if (!detail.shift && !detail.note) {
            await db.removeData(detail.date.year, detail.date.month, key);
        } else {
            await db.setData(
                detail.date.year,
                detail.date.month,
                key,
                detail.shift,
                detail.note,
            );
        }

        editDayDialog.close();
        calendarView.reload();
    }

    onMount(() => {
        const onResume = () => {
            if (calendarView) calendarView.reload();
        };
        document.addEventListener("resume", onResume);
        cleanUp.push(onResume);
    });

    onDestroy(() => cleanUp.forEach((fn) => fn()));
</script>

<main
    class="ui-container"
    style:bottom={$editMode.open ? constants.footerHeight : "0"}
>
    {#if $view === "calendar"}
        <Calendar
            bind:this={calendarView}
            bind:currentDate
            on:click={handleCalendarClick}
            on:currentdatechange={({ detail }) => (currentDate = detail)}
        />
    {:else if $view === "settings"}
        <Settings />
    {:else if $view === "pdf"}
        <Pdf year={currentDate.getFullYear()} />
    {/if}
</main>

<EditDayDialog
    bind:this={editDayDialog}
    on:close={() => editDayDialog.close()}
    on:submit={({ detail }) => submitDay(detail)}
/>

<style>
    main {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        transition: bottom 0.15s ease-out;
    }
</style>
