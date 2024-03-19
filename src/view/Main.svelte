<script>
  import { onDestroy, onMount } from "svelte";

  import { EditDayDialog } from "../lib/components";

  import * as Store from "../lib/stores";
  import * as db from "../lib/js/db";
  import * as constants from "../lib/js/constants";

  import CalendarView from "./calendar";
  import SettingsView from "./settings";
  import PdfView from "./pdf";

  const cleanUp = [];

  const view = Store.view.create();
  const editMode = Store.editMode.create();
  const shiftSetup = Store.shiftSetup.create();

  /** @type {Date} */
  export let currentDate = new Date();

  /** @type {EditDayDialog} */
  let editDayDialog;
  /** @type {CalendarView} */
  let calendarView;

  /**
   * @returns {Promise<(-2 | import("../lib/stores/shift-setup").Shift | undefined)>}
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
    <CalendarView
      bind:this={calendarView}
      bind:currentDate
      on:click={async (ev) => {
        if (ev.detail && $editMode.open) {
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
        } else if (ev.detail) {
          animateDayCardItem(ev.detail);

          setTimeout(() => {
            editDayDialog.open(
              ev.detail.getFullYear(),
              ev.detail.getMonth(),
              ev.detail.getDate(),
            );
          }, 100);
        }
      }}
      on:currentdatechange={({ detail }) => (currentDate = detail)}
    />
  {:else if $view === "settings"}
    <SettingsView />
  {:else if $view === "pdf"}
    <PdfView year={currentDate.getFullYear()} />
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
        detail.note,
      );
    }

    editDayDialog.close();
    calendarView.reload();
  }}
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
