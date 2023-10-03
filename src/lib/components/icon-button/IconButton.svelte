<script>
    import { createEventDispatcher } from "svelte";
    
    let _class = "";
    export { _class as class };

    /** @type {"primary" | "secondary" | "contrast"} */
    export let variant = "contrast";
    /** @type {string | undefined} */
    export let margin = undefined;

    const dispatch = createEventDispatcher();
</script>

<style>
    .icon-button {
        height: 2.5rem;
        width: 2.5rem;
        padding: 4px;
    }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<button
    class={`${variant} outline icon-button ${_class}`}
    style={`
        margin: ${margin !== undefined ? margin : "var(--spacing)"};
    `}
    {...$$restProps}
    on:click={() => {
        setTimeout(() => {
            dispatch("click");
        }, 100);
    }}
>
    <slot />
</button>
