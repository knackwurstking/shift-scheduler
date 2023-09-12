<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    /**
     * 
     * @param {Date} date
     */
    export function setCurrentDate(date) {
        currentDate = date;
    }

    export function reload() {
        currentDate = currentDate;
    }

    /** @type {[number, number, number]} */
    let items = [-1, 0, 1];
    /** @type {string} */
    let transition = "none";
    /** @type {string} */
    let currentTranslateX = "-100%";
    /** @type {Date} */
    let currentDate = new Date();
    /** @type {HTMLDivElement} */
    let _container;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    bind:this={_container}
    on:click={(ev) => {
        // @ts-ignore
        for (const el of (ev?.path || ev.composedPath() || [])) {
            if (el.classList?.contains("item-content-day")) {
                dispatch("click", new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    parseInt(el.getAttribute("data-value"), 10),
                ));
            }
        }
    }}
>
    {#each items as _item, index}
        <slot
            name="container-item"
            {index}
            currentDate={new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + (index - 1)
            )}
            {currentTranslateX}
            {transition}
            transitionend={() => {
                // TODO: ...
            }}
        />
    {/each}
</div>