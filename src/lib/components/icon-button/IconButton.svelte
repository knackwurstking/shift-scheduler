<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let _class = "";
    export { _class as class };

    import * as ripple from "../../ripple";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<button
    class={"contrast outline icon-button " + _class}
    {...$$restProps}
    on:pointerdown={(ev) => {
        if (ev.buttons === 1) {
            ripple.add(ev, ev.currentTarget);
        }
    }}
    on:click={(ev) => {
        dispatch("click");
    }}
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
        margin: var(--spacing);

        border-radius: 50%;
        border: none;
        box-shadow: none;
    }
</style>
