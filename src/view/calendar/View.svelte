<script>
    import { createEventDispatcher, onMount, onDestroy } from "svelte";

    import SwipeHandler from "./SwipeHandler.svelte";
    import Container from "./Container.svelte";
    import Content from "./Content.svelte";

    const dispatch = createEventDispatcher();

    /** @type {Date} */
    export let currentDate;

    /** @type {SwipeHandler} */
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

        let container = document.querySelector(".calendar-container-item");

        const handleSwipe = () => {
            if (!mounted) {
                return;
            }

            if (!container) {
                console.warn("Container not found, rerun querySelector call");
                container = document.querySelector(".calendar-container-item");
            }

            // TODO: read input (pointermove, touchmove or whatever) and swipe (set Container transform translateX)
            // ...

            requestAnimationFrame(handleSwipe);
        };

        requestAnimationFrame(handleSwipe);
    });

    onDestroy(() => {
        mounted = false; // TODO: will this event work?
    });
</script>

<SwipeHandler
    bind:this={swipeHandler}
    bind:currentDate
    on:click={(ev) => {
        dispatch("click", ev.detail);
    }}
>
    <Container
        slot="item"
        style={`
            transform: translateX(${currentTranslateX});
            transition: ${transition || "none"};
            will-change: transform;
        `}
        let:index
        let:currentDate
        let:transition
        let:currentTranslateX
        let:onTransformEnd
        on:transformend={() => onTransformEnd()}
    >
        <Content
            {index}
            {currentDate}
            on:currentdatechange={(ev) => {
                dispatch("currentdatechange", ev.detail);
            }}
        />
    </Container>
</SwipeHandler>
