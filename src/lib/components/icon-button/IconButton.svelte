<script>
    let _class = "";
    export { _class as class };

    /** @type {"primary" | "secondary" | "contrast"} */
    export let variant = "contrast";
    /** @type {string | undefined} */
    export let margin = undefined;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<button
    class={`${variant} outline icon-button ${_class}`}
    style={`
        margin: ${margin !== undefined ? margin : "var(--spacing)"};
    `}
    {...$$restProps}
    on:click
>
    <slot />
</button>

<style>
    .icon-button {
        position: relative;
        overflow: hidden;

        height: 1.75rem;
        width: 1.75rem;
        padding: 4px;

        display: flex;
        justify-content: center;
        align-items: center;

        border: none;
        box-shadow: var(--button-box-shadow);
    }
</style>
