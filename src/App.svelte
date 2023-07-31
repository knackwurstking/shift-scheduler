<script>
  import "./lib/css/pico.min.css";

  import TiArrowBackOutline from "svelte-icons/ti/TiArrowBackOutline.svelte";

  import * as ripple from "./lib/js/ripple";
  import * as utils from "./lib/js/utils";

  /** @type {Themes} */
  let currentTheme = "default"; // TODO: Add a theme picker to the settings page

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

<header>
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

  <!-- TODO: Date picker for selecting the current month and year -->
</header>

<main>
  <!-- TODO: Month view (infinite swipe) -->
</main>

<footer>
  <!-- TODO: Toolbar for the edit shifts mode -->
</footer>

<style>
  :global(*) {
    border: 1px solid red;
  }

  footer:not(.visible) {
    margin-top: 100%;
    position: absolute;
    height: 64px;
    right: 0;
    bottom: 0;
    left: 0;
  }
</style>
