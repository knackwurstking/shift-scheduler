<script>
    import { createEventDispatcher } from "svelte";

    import Button from "../button";

    const dispatch = createEventDispatcher();

    /** @type {string} */
    let _class = "";
    export { _class as class };

    /** @type {string | undefined | null} */
    export let style = undefined;

    /** @type {Date} */
    export let currentDate;
</script>

<Button
    class={"date-picker--preview outline" + _class}
    style={`
        padding: calc(var(--spacing) / 2);
    ` + style}
    {...$$restProps}
    on:click={() => {
        dispatch("click", { year: currentDate.getFullYear(), month: currentDate.getMonth() });
    }}
>
    <span>
        {currentDate.getFullYear()} / {(currentDate.getMonth() + 1).toString().padStart(2, "0")}
    </span>
</Button>
