<script>
</script>

<!-- TODO: tree containers (divs), visible view will always be the second one, on scroll(end) reorder divs -->
<div>
    <section></section>
    <section></section>
    <section></section>
</div>

<style>
    div {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;

        overflow-y: scroll;

        scroll-snap-type: y mandatory;

        border: 1px solid red;
    }

    div > section {
        width: 100%;

        min-height: 100%;
        height: 100%;
        max-height: 100%;

        border: 1px solid yellow;
    }

    div > section:nth-child(1) {
        scroll-snap-align: start;
    }

    div > section:nth-child(2) {
        scroll-snap-align: center;
    }

    div > section:nth-child(3) {
        scroll-snap-align: end;
    }
</style>