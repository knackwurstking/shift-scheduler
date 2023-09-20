<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import * as ripple from "../../ripple";

    import Dialog from "./Dialog.svelte";

    /** @type {string} */
    let _class = "";
    export { _class as class };

    /** @type {Date} */
    export let currentDate;

    /** @type {boolean} */
    let picker = false;
</script>

{#if picker}
    <Dialog
        open={picker}
        year={currentDate.getFullYear()}
        month={currentDate.getMonth() + 1}
        on:cancel={() => {
            picker = false;
        }}
        on:submit={({ detail }) => {
            currentDate = new Date(detail.year, detail.month - 1, currentDate.getDate());
            dispatch("currentdatechanged", currentDate);
            picker = false;
        }}
    />
{/if}

<button
    class={"date-picker--preview outline " + _class}
    {...$$restProps}
    on:pointerdown={(ev) => {
        if (ev.buttons === 1) {
            ripple.add(ev, ev.currentTarget);
        }
    }}
    on:click={(ev) => {
        picker = true;
    }}
>
    <span>
        {currentDate.getFullYear()} / {(currentDate.getMonth() + 1).toString().padStart(2, "0")}
    </span>
</button>
