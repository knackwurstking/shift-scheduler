<script>
    import { createEventDispatcher } from "svelte";

    import Container from "./SwipeHandler.svelte";
    import ContentContainer from "./ContentContainer.svelte";
    import Content from "./Content.svelte";

    const dispatch = createEventDispatcher();

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
    <ContentContainer
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
            on:currentdatechange={(ev) => {
                dispatch("currentdatechange", ev.detail);
            }}
        />
    </ContentContainer>
</Container>
