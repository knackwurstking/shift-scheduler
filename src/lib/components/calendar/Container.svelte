<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import * as ripple from "../../ripple";

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
    let lastClientX = null;
    /** @type {Date} */
    let currentDate = new Date();
    /** @type {number} */
    let visibleChildIndex = 1;
    /** @type {number} */
    let startClientX = 0;
    /** @type {number} */
    let minSwipeRange;
    /** @type {HTMLDivElement} */
    let container;

    $: container && init();

    function init() {
        const visibleChild = container.children[visibleChildIndex];
        if (visibleChild) {
            container.onpointerdown = (ev) => {
                if (pointerlock) return;
                startClientX = ev.clientX;
                minSwipeRange = container.getBoundingClientRect().width / 4;
            };

            container.onpointerup = () => {
                if (pointerlock) {
                    transition = "transform 0.35s ease";

                    if (direction === "left") {
                        currentTranslateX = "-200%";
                    } else if (direction === "right") {
                        currentTranslateX = "0";
                    } else {
                        currentTranslateX = "-100%";
                        resetTransition();
                    }
                }
            };

            container.onpointermove = (ev) => {
                if (ev.buttons !== 1) {
                    if (pointerlock) container.onpointerup(ev);
                    return;
                }

                if (!pointerlock) {
                    if (startClientX - ev.clientX > 10 || startClientX - ev.clientX < -10)
                        pointerlock = true;
                    return;
                }

                const startDiff = startClientX - ev.clientX;
                if (ev.clientX < lastClientX && Math.abs(startDiff) > minSwipeRange)
                    direction = "left";
                else if (ev.clientX > lastClientX && Math.abs(startDiff) > minSwipeRange)
                    direction = "right";
                else
                    direction = null;

                lastClientX = ev.clientX;
                currentTranslateX = `calc(-100% - ${startClientX - ev.clientX}px)`;
            };
        }
    }

    function resetTransition() {
        direction = null;
        lastClientX = null;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    bind:this={container}
    on:click={!pointerlock &&
        ((ev) => {
            // @ts-ignore
            for (const el of ev?.path || ev.composedPath() || []) {
                if (el.classList?.contains("day-content")) {
                    const date = parseInt(el.getAttribute("data-value"), 10);
                    if (isNaN(date)) dispatch("click", null);
                    else {
                        ripple.add(ev, el);
                        dispatch("click", new Date(currentDate.getFullYear(), currentDate.getMonth(), date));
                    }
                }
            }
        })}
>
    {#each items as _item, index}
        <slot
            name="container-item"
            {index}
            currentDate={new Date(currentDate.getFullYear(), currentDate.getMonth() + (index - 1))}
            {currentTranslateX}
            {transition}
            transitionend={() => {
                transition = "none";
                currentTranslateX = "-100%";

                if (direction === "left") {
                    items = [items[1], items[2], items[0]];
                    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
                } else if (direction === "right") {
                    items = [items[2], items[0], items[1]];
                    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
                }

                resetTransition();
                pointerlock = false;
            }}
        />
    {/each}
</div>

<style>
    div {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;

        overflow: hidden;

        touch-action: none;
        user-select: none;
    }
</style>
