<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import * as ripple from "../../ripple";

    import Dialog from "./Dialog.svelte";

    export let style = "";
    let _class = "";
    export { _class as class };

    /** @type {number} */
    export let year;
    /** @type {number} */
    export let month;

    let picker = false;
</script>

{#if picker}
    <Dialog
        open={picker}
        month={month + 1}
        year={year}
        on:submit={(ev) => {
            year = ev.detail?.year || year,
            month = (ev.detail?.month || month) - 1,
            dispatch("datechanged", { year: year, month: month });
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
        picker = true;
    }}
>
    <span>{year} / {(month + 1).toString().padStart(2, "0")}</span>
</button>

<style>
    button {
        padding: calc(var(--spacing) / 2);
    }
</style>
