<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
</script>

<div
    class="calendar-item"
    {...$$restProps}
    on:transitionend={() => {
        dispatch("transitionend");
    }}
>
    <div class="calendar-item__inner">
        <!-- TODO: header -->

        <!-- TODO: slot for ContentItem.svelte component -->
        <slot />
    </div>
</div>