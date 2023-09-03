<script>
  import * as ripple from "../../ripple";

  import Dialog from "./Dialog.svelte";

  export let style = "";
  let _class = "";
  export { _class as class };

  /** @type {DatePickerCurrent} */
  export let current;

  let picker = false;
</script>

{#if picker}
  <Dialog
    open={true}
    month={current.month}
    year={current.year}
    on:submit={(ev) => {
      current = {
        year: ev.detail?.year || current.year,
        month: ev.detail?.month || current.month,
      };
      picker = false;
    }}
  />
{/if}

<button
  class={"date-picker--preview outline " + _class}
  {style}
  {...$$restProps}
  on:click={(ev) => {
    ripple.add(ev, ev.currentTarget, { mode: "primary" });
    // TODO: open dialog for changing the current year and month in use
  }}
>
  <span>{current.year} / {(current.month + 1).toString().padStart(2, "0")}</span
  >
</button>

<style>
  button {
    padding: calc(var(--spacing) / 2);
  }
</style>
