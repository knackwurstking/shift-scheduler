<script>
  import { UI } from "ui";

  import { lang, constants } from "../lib/js";
  import * as Store from "../lib/stores";

  import FooterItems from "./FooterItems.svelte";

  const editMode = Store.EditMode.create();
</script>

<footer
  class="ui-container is-max-width has-top-border"
  class:visible={$editMode.open}
  style:height={constants.footerHeight}
>
  <span class="separator-title">{lang.get()["footer"]["edit mode"]}</span>

  {#if $editMode.open}
    <figure
      class="flex no-scrollbar is-max"
      style:padding-top="calc(var(--spacing) / 2)"
    >
      <UI.FlexGrid.Row gap=".1em">
        <FooterItems />
      </UI.FlexGrid.Row>
    </figure>
  {/if}
</footer>

<style>
  footer {
    transform: none;
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    transition: transform 0.15s ease-out;
  }

  .separator-title {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background-color: hsl(var(--bg));
    padding: 0 var(--spacing);
  }

  footer:not(.visible) {
    transform: translateY(150%);
  }
</style>
