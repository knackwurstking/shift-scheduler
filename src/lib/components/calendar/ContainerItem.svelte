<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    /** @type {[string, string, string, string, string, string]} */
    let headerItems = [
        "Sun", "Mon", "Tue", "Wen", "Thu", "Fri", "Sat",
    ];
</script>

<div
    class="calendar-item"
    {...$$restProps}
    on:transitionend={() => {
        dispatch("transitionend");
    }}
>
    <div>
        <div class="header">
            {#each headerItems as item}
                <span
                    class:sunday={item === "Sun"}
                    class:saturday={item === "Sat"}
                >{item}</span>
            {/each}
        </div>

        <!-- TODO: slot for ContentItem.svelte component -->
        <slot />
    </div>
</div>

<style>
    div.calendar-item {
        min-width: 100%;
        width: 100%;
        max-width: 100%;
        height: 100%;
    }

    div.calendar-item > div {
        width: 100%; 
        height: 100%;
    }

    div.calendar-item > div > div.header {
        height: 40px;
        padding: 4px 4px;

        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    }

    div.calendar-item > div > div.header > span {
        display: flex;
        justify-content: center;
        align-items: center;

        margin: 0 2px;

        font-weight: bolder;

        border: 1px solid var(--muted-border-color);
        border-radius: var(--border-radius);
    }

    div.calendar-item > div > div.header > span.sunday,
    div.calendar-item > div > div.header > span.saturday {
        color: var(--secondary);
    }
</style>
