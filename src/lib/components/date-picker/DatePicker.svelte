<script>
    import { createEventDispatcher } from "svelte";

    import { ripple } from "../../js/ripple";

    const dispatch = createEventDispatcher();

    let _ripple = ripple({ color: "var(--ripple-primary-color)", usePointer: true });

    /** @type {string} */
    let _class = "";
    export { _class as class };

    /** @type {Date} */
    export let currentDate;
</script>

<button
    class={"date-picker--preview outline" + _class}
    {...$$restProps}
    use:_ripple
    on:click={() =>
        dispatch("click", { year: currentDate.getFullYear(), month: currentDate.getMonth() })}
>
    <span>
        {currentDate.getFullYear()} / {(currentDate.getMonth() + 1).toString().padStart(2, "0")}
    </span>
</button>

<style>
    button {
        padding: calc(var(--spacing) / 2);
    }
</style>
