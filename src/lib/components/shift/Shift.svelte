<script>
    /******************************
     * Variable Export Definitions
     ******************************/

    /** @type {number} */
    export let id;

    /** @type {string} */
    export let name;

    /** @type {string} */
    export let shortName = "";

    /** @type {boolean} */
    export let visible = true;

    /** @type {string} */
    export let color = "transparent";

    export let active = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div {...$$restProps} class="card has-user-select-none" class:active on:click>
    <div
        class="background"
        style={`background-color: ${color || "transparent"};`}
    />
    <div class="name">{name}</div>
    <div class="short-name" class:visible>{shortName || name[0]}</div>
</div>

<style>
    .card {
        transition: border-color .25s linear;
    }

    .card.active {
        border: var(--border-width) solid hsl(var(--primary));
    }

    .card .background {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;

        opacity: 0.25;
    }

    .card .name {
        width: 5rem;

        font-size: 0.8rem;
        font-weight: 400;

        text-overflow: ellipsis;
        overflow: hidden;
    }

    .card .short-name {
        width: 4rem;

        font-size: 0.9rem;
        font-weight: 600;
        font-style: italic;

        text-overflow: ellipsis;
        overflow: hidden;
    }

    .card .short-name:not(.visible) {
        display: none;
    }
</style>
