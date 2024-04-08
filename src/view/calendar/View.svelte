<script>
    import { createEventDispatcher, onMount, onDestroy } from "svelte";

    import Container from "./Container.svelte";
    import ContainerItem from "./ContainerItem.svelte";
    import Days from "./Days.svelte";

    const dispatch = createEventDispatcher();
    /** @type {(() => void)[]} */
    const cleanUp = [];

    /** @type {Date} */
    export let currentDate;

    /** @type {Container} */
    let swipeHandler;

    let mounted = false;

    /** @type {[number, number, number]} */
    let items = [-1, 0, 1];

    /** @type {number | null} */
    let clientX = null;
    /** @type {number | null} */
    let startX = null;
    /** @type {-1| 0 | 1} */
    let direction = 0;

    let transform = "translate(-100%)";
    let transition = "none";

    /**
     * Trigger a calendar reload after a database update
     */
    export function reload() {
        swipeHandler.reload();
    }

    /**
     * @param {string} selector
     */
    export function querySelector(selector) {
        return swipeHandler.querySelector(selector);
    }

    async function leftSwipe() {
        resetSwipe(() => {
            items = [items[1], items[2], items[0]];
            currentDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
            );
        });
    }

    async function rightSwipe() {
        items = [items[2], items[0], items[1]];
        resetSwipe();
        currentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1,
        );
    }

    async function resetSwipe(cb) {
        const transitionTime = 1000;
        transition = `transform ${transitionTime}ms ease`;
        if (direction > 0) {
            transform = `translate(-200)`;
        } else if (direction < 0) {
            transform = `translate(-100%)`;
        } else {
            transform = `translate(-0%)`;
        }

        setTimeout(() => {
            transition = `none`;
            transform = `translate(-100%)`;
            if (cb) cb();

            startX = clientX = null;
            direction = 0;
        }, transitionTime);
    }

    onMount(async () => {
        // TODO: clean up this mess here, too many callback functions (move it away)
        mounted = true;

        let ratio = window.innerWidth / 1080;

        {
            const resizeHandler = async () => {
                ratio = window.innerWidth / 1080;
            };
            document.addEventListener("resize", resizeHandler);
            cleanUp.push(() =>
                document.removeEventListener("resize", resizeHandler),
            );
        }

        const swipeRange = 100;

        {
            const handleSwipe = async () => {
                if (!mounted) {
                    return;
                }

                // NOTE: If clientX is set, startX is also set
                if (clientX == null) {
                    requestAnimationFrame(handleSwipe);
                    return;
                }

                transform = `translate(calc(-100% - ${startX - clientX}px))`;

                // Update direction left/right/reset
                const s = Math.floor(swipeRange * ratio);
                const r = startX - clientX;
                if (Math.abs(r) < s) {
                    direction = 0; // reset
                } else if (r < 0) {
                    direction = -1; // right swipe
                } else if (r > 0) {
                    direction = 1; // left swipe
                }

                requestAnimationFrame(handleSwipe);
            };

            // TODO: Handle app pause and resume events?
            requestAnimationFrame(handleSwipe);
        }

        {
            let container = document.querySelector(".calendar-container");

            /** @param {TouchEvent} ev */
            const trackMovement = async (ev) => {
                if (startX == null) {
                    clientX = startX = ev.changedTouches[0].clientX;
                    return;
                }

                clientX = ev.changedTouches[0].clientX;
            };

            const stopTracking = async () => {
                // TODO: Lock all movements here...
                // ...

                if (direction > 0) {
                    leftSwipe();
                } else if (direction < 0) {
                    rightSwipe();
                } else {
                    resetSwipe();
                }
            };

            container.addEventListener("touchmove", trackMovement);
            container.addEventListener("touchend", stopTracking);
            cleanUp.push(() => {
                container.removeEventListener("touchmove", trackMovement);
                container.removeEventListener("touchend", stopTracking);
            });
        }
    });

    onDestroy(() => {
        mounted = false;
        cleanUp.forEach((fn) => fn());
    });
</script>

<Container
    bind:this={swipeHandler}
    bind:currentDate
    bind:items
    on:click={(ev) => {
        dispatch("click", ev.detail);
    }}
>
    <ContainerItem
        slot="item"
        style={`transform: ${transform}; transition: ${transition};`}
        let:index
        let:currentDate
    >
        <Days
            {index}
            {currentDate}
            on:currentdatechange={(ev) => {
                dispatch("currentdatechange", ev.detail);
            }}
        />
    </ContainerItem>
</Container>
