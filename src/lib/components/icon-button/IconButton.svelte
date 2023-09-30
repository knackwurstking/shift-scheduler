<script>
    import { ripple } from "../../js/ripple";

    let _class = "";
    export { _class as class };

    /** @type {"primary" | "secondary" | "contrast"} */
    export let variant = "contrast";
    /** @type {string | undefined} */
    export let margin = undefined;
    /** @type {number} */
    export let rippleDuration = 600;
    /** @type {string} */
    export let rippleColor = "var(--ripple-color)";

    $: {
        if (!!rippleColor) {
            _ripple = ripple({ duration: rippleDuration, color: rippleColor, usePointer: true });
        }
    }

    let _ripple = ripple({ usePointer: true });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<button
    class={`${variant} outline icon-button ${_class}`}
    style={`
        margin: ${margin !== undefined ? margin : "var(--spacing)"};
    `}
    {...$$restProps}
    use:_ripple
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
