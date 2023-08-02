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

  import * as ripple from "./lib/js/ripple";
  import * as utils from "./lib/js/utils";

  import DatePicker from "./lib/components/date-picker";
  import IconButton from "./lib/components/icon-button";
  import InfiniteScrollView from "./lib/components/infinite-scroll-view";

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

  let itemsData = [{ monthCount: -1 }, { monthCount: 0 }, { monthCount: 1 }];

  /** @type {"edit" | null} */
  let footerMode = null;

  function goBackInHistory() {
    const v = viewStack.pop();
    viewStack = viewStack;
    view = v;
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="/themes/{currentTheme}.css" />
</svelte:head>

<header class="container-fluid" style="font-size: 1rem;">
  <!-- Top app bar -->

  {#if utils.isAndroid() && view !== viewStack[0]}
    <!-- Back Button (only if not on android) -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <dev
      class="icon"
      role="button"
      tabindex="0"
      on:click={() => goBackInHistory()}
    >
      <TiArrowBackOutline />
    </dev>
  {/if}

  <DatePicker style="margin: 0;" bind:current={datePickerCurrent} />

  <span class="spacer" />

  <div class="actions">
    <!-- Edit Shifts -->
    <IconButton
      disabled
      on:click={() => {
        // TODO: enable (footer) edit mode
      }}><MdModeEdit /></IconButton
    >

    <!-- GoTo Today -->
    <IconButton
      disabled
      on:click={() => {
        // TODO: goto today's date (year, month), update datePickerCurrent
      }}><MdToday /></IconButton
    >

    <!-- Settings -->
    <IconButton
      disabled
      on:click={() => {
        // TODO: goto settings view (add to stack, use goto function)
      }}><TiSpanner /></IconButton
    >
  </div>
</header>

<main class="container-fluid" style={`bottom: ${!!footerMode ? "80px" : "0"}`}>
  <!-- Month view (infinite swipe) -->
  <InfiniteScrollView
    on:scrollup={(ev) => {
      itemsData[ev.detail.slotsOrder[0]].monthCount -= 3;
      itemsData = itemsData;
    }}
    on:scrolldown={(ev) => {
      itemsData[ev.detail.slotsOrder[2]].monthCount += 3;
      itemsData = itemsData;
    }}
  >
    <div slot="0">{itemsData[0].monthCount}</div>
    <div slot="1">{itemsData[1].monthCount}</div>
    <div slot="2">{itemsData[2].monthCount}</div>
  </InfiniteScrollView>
</main>

<footer class="container-fluid" class:visible={!footerMode}>
  <!-- TODO: Toolbar for the edit shifts mode -->
</footer>

<style>
  header {
    position: relative;
    height: 80px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid;
  }

  header > .spacer {
    width: 100%;
  }

  header > .actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
  }

  main {
    position: fixed;
    top: 80px;
    right: 0;
    left: 0;
  }

  footer:not(.visible) {
    margin-top: 100%;
    position: absolute;
    height: 64px;
    right: 0;
    bottom: 0;
    left: 0;
    border-top: 1px solid;
  }
</style>
