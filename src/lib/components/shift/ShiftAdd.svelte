<script>
    import { ripple } from "../../js/ripple";
    let _secondaryRipple = ripple({ usePointer: true });

    // @ts-ignore
    import IoIosAdd from "svelte-icons/io/IoIosAdd.svelte";
</script>

<div class="card">
    <button class="outline secondary" use:_secondaryRipple on:click>
        <span>
            <IoIosAdd />
        </span>
    </button>
</div>

<style>
    .card {
        display: inline-block;

        overflow: hidden;

        height: calc(3em + 16px);
        width: calc(4.5em + 16px);
        padding: 4px;
        margin: 2px;
    }

    .card button {
        width: calc(100%);
        height: calc(100%);

        border: 1px solid;
        border-radius: var(--border-radius);
    }

    .card button span {
        filter: opacity(0.45);
    }
</style>
