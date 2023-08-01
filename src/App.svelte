<script>
  import "./lib/css/pico.min.css";

  import TiArrowBackOutline from "svelte-icons/ti/TiArrowBackOutline.svelte";

  import * as ripple from "./lib/js/ripple";
  import * as utils from "./lib/js/utils";

  import DatePicker from "./lib/components/date-picker";

  /** @type {Themes} */
  let currentTheme = "default"; // TODO: Add a theme picker to the settings page

  /** @type {DatePickerCurrent} */
  let datePickerCurrent = {
    year: (new Date()).getFullYear(),
    month: (new Date()).getMonth()
  };

  /** @type {Views} */
  let view = "calendar";
  /** @type {Views[]}*/
  let viewStack = [view];

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

  <DatePicker
    bind:current={datePickerCurrent}
  />
</header>

<main class="container-fluid">
  <!-- TODO: Month view (infinite swipe) -->
</main>

<footer class="container-fluid">
  <!-- TODO: Toolbar for the edit shifts mode -->
</footer>

<style>
  header {
    height: 64px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid;
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
