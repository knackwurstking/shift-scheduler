<script>
    import { ripple } from "../../js/ripple";
    let _ripple = ripple({ usePointer: true });

    let _class = "";
    export { _class as class };

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
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<button
    class={"contrast outline icon-button " + _class}
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

        display: flex;
        justify-content: center;
        align-items: center;

        color: var(--color);

        height: 42px;
        width: 42px;

        padding: 8px;

        border-radius: 50%;
        border: none;
        box-shadow: none;
    }
</style>
