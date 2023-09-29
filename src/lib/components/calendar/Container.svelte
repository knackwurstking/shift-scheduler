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
    /** @type {"left" | "right" | null} */
    let direction = null;
    /** @type {boolean} */
    let pointerlock = false;
    /** @type {boolean} */
    let waitForTransition = false;
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
                startClientX = ev.clientX;
                minSwipeRange = container.getBoundingClientRect().width / 5;

                //if (waitForTransition || pointerlock) return;

                //transition = "none";
                //startClientX = ev.clientX;
                //minSwipeRange = container.getBoundingClientRect().width / 5;
                ////minSwipeRange = 75;
            };

            container.onpointerup = () => {
                if (direction === "left") {
                    container.children[0].style.left = "-200%";
                    container.children[1].style.left = "-100%";
                    container.children[2].style.left = "0";
                    container.append(container.firstChild);
                } else if (direction === "right") {
                    container.children[0].style.left = "0";
                    container.children[1].style.left = "100%";
                    container.children[2].style.left = "200%";
                    container.prepend(container.lastChild);
                }

                container.children[0].style.left = "-100%";
                container.children[1].style.left = "0";
                container.children[2].style.left = "100%";

                direction = null;
                lastClientX = null;

                //if (waitForTransition) return;

                //if (pointerlock) {
                //    waitForTransition = true;
                //    transition = "transform 0.25s linear";

                //    if (direction === "left") {
                //        currentTranslateX = "-200%";
                //    } else if (direction === "right") {
                //        currentTranslateX = "0";
                //    } else {
                //        currentTranslateX = "-100%";
                //        resetTransition();
                //    }
                //}
            };

            container.onpointercancel = container.onpointerup;

            container.onpointermove = (ev) => {
                // TODO: ...
                if (ev.buttons !== 1) {
                    return;
                }

                const startDiff = startClientX - ev.clientX;

                if (ev.clientX < lastClientX && Math.abs(startDiff) > minSwipeRange) {
                    // left swipe

                    if (direction === "right") {
                        // direction change from a right to a left swipe

                        if (ev.clientX < startClientX) {
                            direction = null;
                        }
                    } else {
                        direction = "left";
                    }
                } else if (ev.clientX > lastClientX && Math.abs(startDiff) > minSwipeRange) {
                    // right swipe

                    if (direction === "left") {
                        // direction change from a left to a right swipe

                        if (ev.clientX > startClientX) {
                            direction = null;
                        }
                    } else {
                        direction = "right";
                    }
                }

                for (let x = 0; x < container.children.length; x++) {
                    const child = container.children[x];
                    child.style.left = `calc(${x === 0 ? "-100%" : x === 1 ? "0%" : "100%"} + ${(0 - startDiff)}px)`;
                }


                //if (waitForTransition) return;

                //if (pointerlock && ev.buttons === 1) {
                //    const startDiff = startClientX - ev.clientX;

                //    if (ev.clientX < lastClientX && Math.abs(startDiff) > minSwipeRange) {
                //        // left swipe

                //        if (direction === "right") {
                //            // direction change from a right to a left swipe

                //            if (ev.clientX < startClientX) {
                //                direction = null;
                //            }
                //        } else {
                //            direction = "left";
                //        }
                //    } else if (ev.clientX > lastClientX && Math.abs(startDiff) > minSwipeRange) {
                //        // right swipe

                //        if (direction === "left") {
                //            // direction change from a left to a right swipe

                //            if (ev.clientX > startClientX) {
                //                direction = null;
                //            }
                //        } else {
                //            direction = "right";
                //        }
                //    }

                //    currentTranslateX = `calc(-100% + ${0 - startDiff}px)`;
                //    lastClientX = ev.clientX;
                //    return;
                //}

                //if (ev.buttons !== 1) {
                //    if (pointerlock) container.onpointerup(ev);
                //    return;
                //}

                //if (!pointerlock) {
                //    if (startClientX - ev.clientX > 2 || startClientX - ev.clientX < -2) {
                //        pointerlock = true;
                //    }
                //    return;
                //}
            };
        }
    }

    function resetTransition() {
        direction = null;
        lastClientX = null;
        pointerlock = false;
        setTimeout(() => (waitForTransition = false), 100);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    bind:this={container}
    on:click={async (ev) => {
        if (waitForTransition || pointerlock) return;
        // @ts-ignore
        for (const el of ev?.path || ev.composedPath() || []) {
            if (el.classList?.contains("day-content")) {
                const date = parseInt(el.getAttribute("data-value"), 10);
                if (isNaN(date)) dispatch("click", null);
                else {
                    dispatch(
                        "click",
                        new Date(currentDate.getFullYear(), currentDate.getMonth(), date)
                    );
                }
                return;
            }
        }
    }}
>
    {#each items as _item, index}
        <slot
            name="container-item"
            {index}
            currentDate={new Date(currentDate.getFullYear(), currentDate.getMonth() + (index - 1))}
        />
    {/each}
</div>

<style>
    div {
        width: 100%;
        height: 100%;

        overflow: hidden;

        touch-action: none;
        user-select: none;
    }
</style>
