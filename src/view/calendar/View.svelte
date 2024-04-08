<script>
    import { createEventDispatcher, onMount, onDestroy } from "svelte";

    import Container from "./Container.svelte";
    import ContainerItem from "./ContainerItem.svelte";
    import Days from "./Days.svelte";

    const dispatch = createEventDispatcher();

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

        let container = document.querySelectorAll(".calendar-container-item");
        console.log(...container);

        const handleSwipe = () => {
            if (!mounted) {
                return;
            }

            // TODO: read input (pointermove, touchmove or whatever) and swipe (set Container transform translateX)
            //  - update transform, finish transition (see transform end callback in Container.svelte, reorder items prop)

            requestAnimationFrame(handleSwipe);
        };

        // TODO: handle app pause and resume events?
        requestAnimationFrame(handleSwipe);
    });

    onDestroy(() => {
        mounted = false;
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
