<script>
    /** @type {string} */
    export let title;
</script>

{#if !!title}
    <h4 class="title" style:white-space="nowrap">{title}</h4>
{/if}
