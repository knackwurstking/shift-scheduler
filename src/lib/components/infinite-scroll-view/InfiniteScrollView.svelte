<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import Item from "./Item.svelte";

    let rect;

    /** @type {HTMLElement} */
    let container;
    $: {
        if (container) {
            rect = container.getBoundingClientRect();

            let cs = window.getComputedStyle(container);
            const borderWidth = parseInt(cs.borderTopWidth, 10) + parseInt(cs.borderBottomWidth, 10);

            cs = window.getComputedStyle(container.children[0]);
            const sectionMargin = parseInt(cs.marginTop, 10) + parseInt(cs.marginBottom, 10);

            resetScrollTop(sectionMargin, borderWidth);
        }
    }

    export let slotsOrder;

    export let lock = false;

    function resetScrollTop(sectionMargin, borderWidth) {
        container.scrollTop = rect.height + sectionMargin - borderWidth;
        lock = false;
    }
</script>

<div
    bind:this={container}
    style={lock ? "pointer-events: none" : ""}
    on:pointerup={() => (lock = true)}
    on:scroll={(ev) => {
        let cs = window.getComputedStyle(ev.currentTarget);
        const borderWidth = parseInt(cs.borderTopWidth, 10) + parseInt(cs.borderBottomWidth, 10);

        cs = window.getComputedStyle(ev.currentTarget.children[0]);
        const sectionMargin = parseInt(cs.marginTop, 10) + parseInt(cs.marginBottom, 10);

        switch (ev.currentTarget.scrollTop) {
            case 0:
                ev.currentTarget.insertBefore(
                    ev.currentTarget.removeChild(ev.currentTarget.children[2]),
                    ev.currentTarget.firstChild
                );

                resetScrollTop(sectionMargin, borderWidth);

                slotsOrder.unshift(slotsOrder.pop());
                slotsOrder = slotsOrder;
                dispatch("scrollup", { slotsOrder: slotsOrder });
                break;

            case (rect.height + sectionMargin - borderWidth) * 2:
                ev.currentTarget.appendChild(ev.currentTarget.removeChild(ev.currentTarget.children[0]));

                // NOTE: is there a better way to do this?
                resetScrollTop(sectionMargin, borderWidth);

                slotsOrder.push(slotsOrder.shift());
                slotsOrder = slotsOrder;
                dispatch("scrolldown", { slotsOrder: slotsOrder });
                break;
        }
    }}
>
    <Item><slot name="0" /></Item>
    <Item><slot name="1" /></Item>
    <Item><slot name="2" /></Item>
</div>

<style>
    div {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;

        overflow-y: scroll;
        scroll-snap-type: y mandatory;

        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    div::-webkit-scrollbar {
        display: none;
    }
</style>
