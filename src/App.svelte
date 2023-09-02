<script>
  import "./lib/css/pico.min.css";

  // @ts-ignore
  import TiArrowBackOutline from "svelte-icons/ti/TiArrowBackOutline.svelte";
  // @ts-ignore
  import TiSpanner from "svelte-icons/ti/TiSpanner.svelte";
  // @ts-ignore
  import MdToday from "svelte-icons/md/MdToday.svelte";
  // @ts-ignore
  import MdModeEdit from "svelte-icons/md/MdModeEdit.svelte";

  //import * as ripple from "./lib/js/ripple";
  import * as utils from "./lib/js/utils";

  import DatePicker from "./lib/components/date-picker";
  import IconButton from "./lib/components/icon-button";
  import InfiniteScrollView from "./lib/components/infinite-scroll-view";
  import { Content as ViewCalendarContent } from "./lib/components/calendar";
  import SettingsView from "./lib/components/settings";

  /** @type {Themes} */
  let currentTheme = "default"; // TODO: Add a theme picker to the settings page

  /** @type {DatePickerCurrent} */
  let datePickerCurrent = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  };

  /** @type {Views} */
  let view = "calendar";
  /** @type {Views[]}*/
  let viewStack = [view];

  /** @type {[number, number, number]} */
  let slotsOrder;
  let itemsData = [{ monthCount: -1 }, { monthCount: 0 }, { monthCount: 1 }];

  /** @type {"edit" | null} */
  let footerMode = null;

  function goBackInHistory() {
    viewStack.pop();
    viewStack = viewStack;
    view = viewStack[viewStack.length-1];
  }

  /**
   *
   * @param {Views} v
   */
  function goTo(v) {
    viewStack = [...viewStack, v];
    view = v;
  }

  // TODO: Need some handler (setTimeout) to update the today highlighting if its 12:00 AM
</script>

<svelte:head>
  <link rel="stylesheet" href="/themes/{currentTheme}.css" />
</svelte:head>

<header class="container-fluid" style="font-size: 1rem;">
  <!-- Top app bar -->

  {#if !utils.isAndroid() && view !== viewStack[0]}
    <!-- Back Button (only if not on android) -->
    <div class="actions">
      <IconButton on:click={() => goBackInHistory()}>
        <TiArrowBackOutline />
      </IconButton>
    </div>
  {/if}

  <DatePicker
    style="margin: 0; width: 30rem;"
    bind:current={datePickerCurrent}
  />

  <span class="spacer" />

  <div class="actions">
    {#if view === "calendar"}
      <!-- Edit Shifts -->
      <IconButton
        on:click={() => {
          footerMode = footerMode === "edit" ? null : "edit";
        }}><MdModeEdit /></IconButton
      >

      <!-- GoTo Today -->
      <IconButton
        disabled={datePickerCurrent.year === new Date().getFullYear() &&
          datePickerCurrent.month === new Date().getMonth()}
        on:click={() => {
          const today = new Date();
          datePickerCurrent = {
            year: today.getFullYear(),
            month: today.getMonth(),
          };
          itemsData[slotsOrder[0]].monthCount = -1;
          itemsData[slotsOrder[1]].monthCount = 0;
          itemsData[slotsOrder[2]].monthCount = 1;
          itemsData = itemsData;
        }}><MdToday /></IconButton
      >

      <!-- Settings -->
      <IconButton on:click={() => goTo("settings")}><TiSpanner /></IconButton>
    {/if}
  </div>
</header>

<main class="container-fluid" style={`bottom: ${!!footerMode ? "60px" : "0"}`}>
  {#if view === "calendar"}
    <!-- Month view (infinite swipe) -->
    <InfiniteScrollView
      bind:slotsOrder
      on:scrollup={() => {
        itemsData[slotsOrder[0]].monthCount -= 3;

        const today = new Date();
        const date = new Date(
          today.getFullYear(),
          today.getMonth() + itemsData[slotsOrder[1]].monthCount,
          1
        );
        datePickerCurrent = {
          year: date.getFullYear(),
          month: date.getMonth(),
        };

        itemsData = itemsData;
      }}
      on:scrolldown={() => {
        itemsData[slotsOrder[2]].monthCount += 3;

        const today = new Date();
        const date = new Date(
          today.getFullYear(),
          today.getMonth() + itemsData[slotsOrder[1]].monthCount,
          1
        );
        datePickerCurrent = {
          year: date.getFullYear(),
          month: date.getMonth(),
        };

        itemsData = itemsData;
      }}
    >
      <div style="width: 100%; height: 100%;" slot="0">
        <ViewCalendarContent monthCount={itemsData[0].monthCount} />
      </div>

      <div style="width: 100%; height: 100%;" slot="1">
        <ViewCalendarContent monthCount={itemsData[1].monthCount} />
      </div>

      <div style="width: 100%; height: 100%;" slot="2">
        <ViewCalendarContent monthCount={itemsData[2].monthCount} />
      </div>
    </InfiniteScrollView>
  {:else if view === "settings"}
    <SettingsView />
  {/if}
</main>

<footer class="container-fluid" class:visible={footerMode === "edit"}>
  <!-- TODO: Toolbar for the edit shifts mode -->
</footer>

<style>
  :global(html, body) {
    overflow: hidden;
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
    height: 60px;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute;
    border-top: 1px solid var(--muted-border-color);
  }

  footer:not(.visible) {
    transform: translateY(100%);
  }
</style>
