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

    onMount(() => {
        mounted = true;

        let ratio = window.innerWidth / 1080;

        {
            const resizeHandler = () => {
                ratio = window.innerWidth / 1080;
            };
            document.addEventListener("resize", resizeHandler);
            cleanUp.push(() =>
                document.removeEventListener("resize", resizeHandler),
            );
        }

        const swipeRange = Math.floor(50 * ratio);

        /** @type {number | null} */
        let clientX = null;
        /** @type {number | null} */
        let startX = null;

        {
            let containerItems = document.querySelectorAll(
                ".calendar-container-item",
            );

            const handleSwipe = () => {
                if (!mounted) {
                    return;
                }

                // NOTE: If clientX is set, startX is also set
                if (clientX == null) {
                    requestAnimationFrame(handleSwipe);
                    return;
                }

                // TODO: Move containerItems transform (translate) prop
                // ...

                requestAnimationFrame(handleSwipe);
            };

            // TODO: Handle app pause and resume events?
            requestAnimationFrame(handleSwipe);
        }

        {
            let container = document.querySelector(".calendar-container");

            /** @param {TouchEvent} ev */
            const trackMovement = (ev) => {
                if (startX == null) {
                    clientX = startX = ev.changedTouches[0].clientX;
                    return;
                }

                clientX = ev.changedTouches[0].clientX;
            };

            const stopTracking = () => {
                clientX = null;
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
    on:click={(ev) => {
        dispatch("click", ev.detail);
    }}
>
    <ContainerItem
        slot="item"
        style={`
            transform: translateX(-100%);
            will-change: transform;
        `}
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
