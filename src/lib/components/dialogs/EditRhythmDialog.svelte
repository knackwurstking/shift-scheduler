<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import Shift from "../shift";

  import * as settings from "../../js/settings";

  /**
   * @type {import("../settings").Shift[]}
   */
  export let shifts;
  /**
   * @type {number[]}
   */
  export let rhythm;
</script>

<dialog open>
  <article>
    <h6>Pick a shift from the bottom to add.</h6>

    <ul>
      {#each rhythm as id, index}
        {#if !!settings.getShift(id)}
          <Shift
            {...settings.getShift(id)}
            on:click={() => {
              rhythm = [...rhythm.slice(0, index), ...rhythm.slice(index + 1)];
            }}
          />
        {/if}
      {/each}
    </ul>

    <div class="shifts-container">
      {#each shifts as shift}
        <div class="container">
          <Shift
            {...shift}
            on:click={() => {
              rhythm = [...rhythm, shift.id];
            }}
          />
        </div>
      {/each}
    </div>

    <button type="submit" on:click={() => dispatch("submit", rhythm)}>OK</button
    >
  </article>
</dialog>

<style>
  article {
    height: 90%;
    width: 100%;

    overflow: hidden;
  }

  article > h6 {
    height: 2em;
  }

  article > ul {
    height: calc(100% - 12rem);

    overflow: hidden;
    overflow-y: auto;

    border-bottom: 1px solid var(--muted-border-color);

    padding: 0;
  }

  article .shifts-container {
    overflow: hidden;
    overflow-x: auto;

    -ms-overflow-style: none;
    scrollbar-width: none;

    display: flex;

    border-bottom: 1px solid var(--muted-border-color);
  }

  article .shifts-container::-webkit-scrollbar {
      display: none;
  }

  article .shifts-container .container {
    width: calc(4.5em + 16px);
    margin: calc(var(--spacing) / 2);
  }
</style>
