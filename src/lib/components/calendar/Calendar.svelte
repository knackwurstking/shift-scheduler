<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import Container from "./Container.svelte";
    import ContainerItem from "./ContainerItem.svelte";
    import Content from "./Content.svelte";

    /** @type {import("../settings").Settings} */
    export let settings;

    /**
     * 
     * @param {Date} date
     */
    export function set(date) {
        _container.setCurrentDate(date);
    }

    export function reload() {
        _container.reload();
    }

    /** @type {Container} */
    let _container;
</script>

<Container
    bind:this={_container}
    on:click={(ev) => {
        dispatch("click", ev.detail);
    }}
>
    <ContainerItem
        slot="container-item"
        style={`
            transform: translateX(${currentTranslateX});
            transition: ${transition};
        `}
        let:index
        let:currentDate
        let:currentTranslateX
        let:transition
        let:transitionend
        on:transitionend={() => transitionend()}
    >
        <Content
            {index}
            {currentDate}
            {settings}
            on:currentdatechange={(ev) => {
                dispatch("currentdatechange", ev.detail)
            }}
        />
    </ContainerItem>
</Container>
