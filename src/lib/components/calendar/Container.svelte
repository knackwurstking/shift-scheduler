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
    /** @type {"left" | "right" | null} */
    let direction = null;
    /** @type {boolean} */
    let pointerlock = false;
    /** @type {number | null} */
    let lastClientX = null
    /** @type {Date} */
    let currentDate = new Date();
    /** @type {HTMLDivElement} */
    let _container;

    function resetTransition() {
        direction = null;
        pointerlock = false; 
        lastClientX = null;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    bind:this={_container}
    on:click={(ev) => {
        // @ts-ignore
        for (const el of (ev?.path || ev.composedPath() || [])) {
            if (el.classList?.contains("day-content")) {
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
                transition = "none";
                currentTranslateX = "-100%";

                if (direction === "left") {
                    items = [items[1], items[2], items[0]];
                    currentDate = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() + 1,
                    );
                } else if (direction === "right") {
                    items = [items[2], items[0], items[1]];
                    currentDate = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() - 1,
                    );
                }

                resetTransition();
            }}
        />
    {/each}
</div>