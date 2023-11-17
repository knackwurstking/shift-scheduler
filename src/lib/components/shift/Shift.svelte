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
<div {...$$restProps} class={"ui-card no-user-select " + ($$restProps.class || "")} class:active on:click>
    <div class="name">{name}</div>
    <div
        class="short-name"
        class:visible
        style={
            `--shift-color: ${color || "hsl(var(--card-foreground))"};`
        }
    >{shortName || name[0]}</div>
</div>

<style>
    .ui-card {
        transition: border-color .25s linear;
    }

    .ui-card.active {
        border: var(--border-width) solid hsl(var(--primary));
    }

    .ui-card .name {
        width: 5rem;

        font-size: 0.8rem;
        font-weight: 400;

        text-overflow: ellipsis;
        overflow: hidden;
    }

    .ui-card .short-name {
        width: 4rem;

        font-size: 0.9rem;
        font-weight: 600;
        font-style: italic;

        color: var(--shift-color);

        text-overflow: ellipsis;
        text-shadow: .1em .1em .1em hsl(var(--border));

        overflow: hidden;
    }

    .ui-card .short-name:not(.visible) {
        opacity: 0;
    }
</style>
