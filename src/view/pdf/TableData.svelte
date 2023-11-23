<script>
    /** @type {number} */
    export let date;
    /** @type {import("../../lib/stores/shift-setup").Shift} */
    export let shift;
    export let empty = false;
</script>

<td
    class="is-text-center"
    style:height="3em"
    style:width="calc(100% / 7)"
>
    {#if !empty}
        <div class="is-max-width flex column">
            <span
                style:display="block"
                style:font-size=".85em"
                style:font-weight="lighter"
            >{date}</span>
            {#if shift.visible}
                <span
                    style:width="100%"
                    style:display="block"
                    style:color={shift.color || "hsl(var(--fg))"}
                    style:text-shadow={shift.visible ? ".1em .1em .1em hsl(var(--border))" : undefined}
                    style:overflow="hidden"
                    style:text-overflow="ellipsis"
                    style:white-space="nowrap"
                    style:font-size=".9em"
                >{shift.shortName}</span>
            {/if}
        </div>
    {/if}
</td>
