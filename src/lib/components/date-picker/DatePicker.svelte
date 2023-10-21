<script>
    import { createEventDispatcher } from "svelte";

    import { Button } from "svelte-css";

    /******************************
     * Variable Export Definitions
     ******************************/

    /** @type {Date} */
    export let currentDate;

    /***********************
     * Variable Definitions
     ***********************/

    const dispatch = createEventDispatcher();
</script>

<Button
    {...$$restProps}
    color="primary"
    variant="outline"
    on:click={() => {
        dispatch("click", {
            year: currentDate.getFullYear(),
            month: currentDate.getMonth(),
        });
    }}
>
    {currentDate.getFullYear()} / {(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}
</Button>
