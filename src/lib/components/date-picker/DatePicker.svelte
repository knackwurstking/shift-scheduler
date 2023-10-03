<script>
    import { createEventDispatcher } from "svelte";

    import Button from "../button";

    const dispatch = createEventDispatcher();

    /** @type {string} */
    let _class = "";
    export { _class as class };

    /** @type {Date} */
    export let currentDate;
</script>

<Button
    class={"button primary" + _class}
    {...$$restProps}
    on:click={() => {
        dispatch("click", { year: currentDate.getFullYear(), month: currentDate.getMonth() });
    }}
>
    {currentDate.getFullYear()} / {(currentDate.getMonth() + 1).toString().padStart(2, "0")}
</Button>
