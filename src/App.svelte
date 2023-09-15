<script>
  import { onMount } from "svelte";
  import { App } from "@capacitor/app";

  import TiArrowBackOutline from "svelte-icons/ti/TiArrowBackOutline.svelte";
  import TiSpanner from "svelte-icons/ti/TiSpanner.svelte";
  import MdModeEdit from "svelte-icons/md/MdModeEdit.svelte";
  import MdToday from "svelte-icons/md/MdToday.svelte";

  //import * as ripple from "./lib/js/ripple";
  import * as utils from "./lib/js/utils";
  import * as db from "./lib/js/db";

  import { EditDayDialog } from "./lib/components/dialogs";
  import DatePicker from "./lib/components/date-picker";
  import IconButton from "./lib/components/icon-button";
  import Calendar from "./lib/components/calendar";
  import SettingsView from "./lib/components/settings";
  import ShiftCard from "./lib/components/shift";

  /** @type {Themes} */
  let currentTheme = "custom";
  /** @type {Views} */
  let view = "calendar";
  /** @type {Views[]}*/
  let viewStack = [view];
  /** @type {Date} */
  let currentDate = new Date();
  /** @type {boolean} */
  let editMode_open = false;
  /** @type {number} - -2 will remove the custom shift from the database */
  let editMode_index = -1;

  /** @type {Calendar} */
  let calendar;

  /** @type {boolean} */
  let editDayDialog_open = false;
  /** @type {Date} */
  let editDayDialog_date;

  /** @type {Date} */
  let today = new Date();

  $: {
    if (view === "calendar") {
      settings = JSON.parse(
        localStorage.getItem("settings") ||
          '{ "shifts": [], "startDate": "", "shiftRhythm": [], "currentTheme": "custom", "mode": "auto" }'
      );
      currentTheme = settings.currentTheme;
      if (settings.mode !== "auto") {
        document.documentElement.setAttribute("data-theme", settings.mode);
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    }
  }

  function goBackInHistory() {
    if (viewStack.length === 1) return;
    viewStack.pop();
    viewStack = viewStack;
    view = viewStack[viewStack.length - 1];
  }

  /**
   *
   * @param {Views} v
   */
  function goTo(v) {
    editMode_open = false;
    viewStack = [...viewStack, v];
    view = v;
  }

  /**
   *
   * @param {Date | null} date
   */
  function setCurrentDate(date) {
    if (date) currentDate = date;
    calendar.set(currentDate);
  }

  /**
   * @returns {import("./lib/components/settings").Shift}
   */
  function getEditModeShift() {
    if (editMode_index === -2)
      return { name: "", shortName: "", visible: false };
    return settings.shifts[editMode_index] || null;
  }

  // TODO: need to update today after 12:00 AM

  onMount(async () => {
    if (utils.isAndroid()) {
      App.addListener("backButton", () => goBackInHistory());
    }
  });
</script>

<svelte:head>
  <link rel="stylesheet" href="/css/themes/{currentTheme}.min.css" />
</svelte:head>

{#if editDayDialog_open}
  <EditDayDialog
    date={editDayDialog_date}
    on:submit={async ({ detail }) => {
      editDayDialog_open = false;
      db.setDataForDay(editDayDialog_date, detail.shift, detail.note);
      calendar.reload();
    }}
  />
{/if}

<header class="container-fluid" style="font-size: 1rem;">
  <!-- Top app bar -->

  {#if view !== viewStack[0]}
    <div class="actions">
      <IconButton on:click={() => goBackInHistory()}>
        <TiArrowBackOutline />
      </IconButton>
    </div>
  {/if}

  {#if view === "calendar"}
    <!--DatePicker style="margin: 0; width: 30rem;" bind:monthCount={currentMonthCount} /-->
    <DatePicker
      style="margin: 0; width: 30rem;"
      bind:currentDate
      on:currentdatechanged={() => setCurrentDate(null)}
    />
  {:else if view === "settings"}
    <h1 style="margin: 0; margin-left: 8px;">Settings</h1>
  {/if}

  <span class="spacer" />

  <div class="actions">
    {#if view === "calendar"}
      <!-- Edit Shifts -->
      <IconButton
        on:click={() => {
          editMode_open = !editMode_open;
        }}><MdModeEdit /></IconButton
      >

      <!-- GoTo Today -->
      <IconButton
        disabled={today.getFullYear() === currentDate.getFullYear() &&
          today.getMonth() === currentDate.getMonth()}
        on:click={() => setCurrentDate(new Date())}
      >
        <MdToday />
      </IconButton>

      <!-- Settings -->
      <IconButton on:click={() => goTo("settings")}><TiSpanner /></IconButton>
    {/if}
  </div>
</header>

<main
  class="container-fluid"
  style={`bottom: ${editMode_open ? "calc(3em + 22px)" : "1px"}`}
>
  {#if view === "calendar"}
    <Calendar
      bind:this={calendar}
      {settings}
      on:click={async ({ detail }) => {
        if (detail && editMode_open) {
          let shift = getEditModeShift();
          if (!shift) {
            return;
          }

          if (!shift.name) shift = null;
          const { note } = db.getDataForDay(detail);

          if (shift || note) {
            db.setDataForDay(detail, shift, note);
          } else {
            db.removeDataForDay(detail);
          }

          calendar.reload();
        } else if (detail) {
          editDayDialog_date = detail;
          editDayDialog_open = true;
        }
      }}
      on:currentdatechange={({ detail }) => (currentDate = detail)}
    />
  {:else if view === "settings"}
    <SettingsView />
  {/if}
</main>

<footer class="container-fluid" class:visible={editMode_open}>
  {#if editMode_open && !!settings}
    <span>
      <ShiftCard
        name="Reset"
        visible={false}
        active={editMode_index === -2}
        color="var(--color)"
        on:click={() => {
          editMode_index = editMode_index === -2 ? -1 : -2;
        }}
      />
    </span>

    {#each settings.shifts as shift, index}
      <span>
        <ShiftCard
          {...shift}
          active={editMode_index == index}
          on:click={() => {
            editMode_index = editMode_index === index ? -1 : index;
          }}
        />
      </span>
    {/each}
  {/if}
</footer>

<style>
  :global(html, body) {
    overflow: hidden;
  }

  :global(button) {
    position: relative;
    overflow: hidden;
  }

  :global(*) {
    box-sizing: border-box;
  }

  header {
    position: relative;
    height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid var(--muted-border-color);
  }

  header > .spacer {
    width: 100%;
    border: none;
  }

  header > .actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
  }

  main {
    position: fixed;
    top: 60px;
    right: 0;
    left: 0;
  }

  footer {
    transform: none;
    height: calc(3em + 22px);
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute;
    border-top: 1px solid var(--muted-border-color);
    display: flex;
    overflow: hidden;
    overflow-x: auto;
    background-color: var(--background-color);
  }

  footer:not(.visible) {
    transform: translateY(100%);
  }
</style>
