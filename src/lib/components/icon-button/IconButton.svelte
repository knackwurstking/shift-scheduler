<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import * as ripple from "../../js/ripple";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class="contrast outline icon-button"
    role="button"
    tabindex="0"
    on:click={(ev) => {
        ripple.add(ev, ev.currentTarget);
        dispatch("click");
    }}
>
    <slot></slot>
</div>

<style>
    .icon-button {
        position: relative;
        overflow: hidden;

        --ripple-color: var(--color);
        color: var(--color);

        height: 56px;
        width: 56px;

        padding: 8px 8px;
        margin: 8px;

        border-radius: 50%;
        border: none;
        box-shadow: none;
    }
</style>