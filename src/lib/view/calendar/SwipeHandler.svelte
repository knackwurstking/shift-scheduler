<script>
    import { createEventDispatcher } from "svelte";

    /***********
     * Bindings
     ***********/

    /** @type {HTMLDivElement} */
    let container;

    /******************************
     * Variable Export Definitions
     ******************************/

    /** @type {Date} */
    export let currentDate = new Date();

    /***********************
     * Variable Definitions
     ***********************/

    const dispatch = createEventDispatcher();

    /** @type {boolean} */
    let pointerlock = false;
    /** @type {boolean} */
    let waitForTransition = false;

    /** @type {[number, number, number]} */
    let items = [-1, 0, 1];

    /** @type {number} */
    let minSwipeRange;

    /** @type {string} */
    let transition;
    /** @type {string} */
    let currentTranslateX = "-100%";
    /** @type {null | "right" | "left"} */
    let direction = null;

    /** @type {number} */
    let _startX = 0;
    /** @type {number | null} */
    let _lastX = null;

    /******************************
     * Function Export Definitions
     ******************************/

    /**
     * Trigger a calendar reload after a database update
     */
    export function reload() {
        currentDate = currentDate;
    }

    /**
     * @param {string} selector
     */
    export function querySelector(selector) {
        return container.querySelector(selector);
    }

    /***********************
     * Function Definitions
     ***********************/

    async function setCurrentTranslateX() {
        switch (direction) {
            case null:
                currentTranslateX = "-100%";
                break;
            case "left":
                currentTranslateX = "-200%";
                break;
            case "right":
                currentTranslateX = "0";
                break;
        }
    }

    /**
     * @param {number} x
     */
    async function swipeStart(x) {
        if (!waitForTransition && !pointerlock) {
            _startX = x;
            transition = "none";
            minSwipeRange = container.getBoundingClientRect().width / 7;
        }
    }

    async function swipeEnd() {
        if (pointerlock && !waitForTransition) {
            transition = "transform .25s ease-out";
            waitForTransition = true;

            if (Math.abs(_lastX - _startX) < minSwipeRange) {
                direction = null;
            } else if (_lastX < _startX) {
                direction = "left";
            } else if (_lastX > _startX) {
                direction = "right";
            }

            await setCurrentTranslateX();
            pointerlock = false;
        }
    }

    /**
     * @param {number} buttons
     * @param {number} x
     */
    async function swipeMove(buttons, x) {
        if (waitForTransition) return;

        if (pointerlock && buttons === 1 && !waitForTransition) {
            currentTranslateX = `calc(-100% + ${0 - (_startX - x)}px)`;
            _lastX = x;
            return;
        }

        if (!pointerlock && buttons === 1) {
            if (Math.abs(_startX - x) > minSwipeRange / 2) {
                _startX = x;
                pointerlock = true;
            }
            return;
        }
    }

    async function resetSwipe() {
        direction = null;
        _lastX = null;
        waitForTransition = false;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    bind:this={container}
    style={`
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;

        overflow: hidden;

        touch-action: none;
        user-select: none;
    `}
    on:pointerdown={(ev) => swipeStart(ev.clientX)}
    on:pointerup={() => swipeEnd()}
    on:pointercancel={() => swipeEnd()}
    on:pointerleave={() => swipeEnd()}
    on:pointermove={(ev) => swipeMove(ev.buttons, ev.clientX)}
    on:click={async (ev) => {
        if (waitForTransition || pointerlock) return;
        // @ts-ignore
        for (const el of ev?.path || ev.composedPath() || []) {
            if (el.classList?.contains("day")) {
                const date = el.getAttribute("data-value");
                if (isNaN(date)) dispatch("click", null);
                else {
                    dispatch(
                        "click",
                        new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            date
                        )
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
            currentDate={new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + (index - 1)
            )}
            {currentTranslateX}
            {transition}
            onTransformEnd={async () => {
                if (pointerlock || transition === "none") return;

                if (direction === "left") {
                    items = [items[1], items[2], items[0]];
                    currentDate = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() + 1
                    );
                } else if (direction === "right") {
                    items = [items[2], items[0], items[1]];
                    currentDate = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() - 1
                    );
                }

                await resetSwipe();

                transition = "none";
                currentTranslateX = "-100%";
            }}
        />
    {/each}
</div>
