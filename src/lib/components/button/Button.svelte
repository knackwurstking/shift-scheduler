<script>
    import { createEventDispatcher } from "svelte";

    let _class = "";
    export {_class as class};

    /** @type {string | undefined | null} */
    export let style = undefined;

    const dispatch = createEventDispatcher();
</script>

<button
    class={_class}
    {style}
    {...$$restProps}
    on:click={() => {
        setTimeout(() => {
            dispatch("click");
        }, 100);
    }}
>
    <slot></slot>
</button>
