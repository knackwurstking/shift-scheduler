<script>
    import * as ripple from "../../ripple";

    import Dialog from "./Dialog.svelte";

    export let style = "";
    let _class = "";
    export { _class as class };

    /** @type {number} */
    export let monthCount;
    $: typeof monthCount === "number" && setCurrent();

    /** @type {Date} */
    let current;
    let picker = false;

    function setCurrent() {
        const today = new Date();
        current = new Date(today.getFullYear(), today.getMonth() + monthCount, 1);
    }
</script>

{#if picker}
    <Dialog
        open={picker}
        year={current.getFullYear()}
        month={current.getMonth() + 1}
        on:submit={({ detail }) => {
            // calculate the new monthCount
            const yearDiff = (detail.year - current.getFullYear()) * 12;
            const monthDiff = detail.month - (current.getMonth() + 1);
            monthCount += yearDiff + monthDiff;
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
    <span>{current.getFullYear()} / {(current.getMonth() + 1).toString().padStart(2, "0")}</span>
</button>

<style>
    button {
        padding: calc(var(--spacing) / 2);
    }
</style>
