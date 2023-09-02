<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    // @ts-ignore
    import IoIosAdd from 'svelte-icons/io/IoIosAdd.svelte';
</script>

<button class="card outline secondary" on:click={() => dispatch("click")}>
    <span>
        <IoIosAdd />
    </span>
</button>

<style>
    .card {
        display: inline-block;

        overflow: hidden;

        border: 1px solid var(--muted-border-color);
        border-radius: var(--border-radius);

        height: calc(3em + 16px);
        width: calc(6em + 16px);
        padding: 8px;
        margin: 4px;
    }

    .card span {
        filter: opacity(0.45);
    }
</style>
