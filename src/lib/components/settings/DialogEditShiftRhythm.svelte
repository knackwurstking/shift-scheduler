<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import Shift from "./Shift.svelte";

    export let open;
    export let shifts;
    export let rhythm;
</script>

<dialog {open}>
    <article>
        <ul>
            {#each rhythm as name, index}
                <Shift
                    {...shifts.find((s) => s.name === name) || { name: name, visible: true }}
                    on:click={() => {
                        rhythm = [...rhythm.slice(0, index), ...rhythm.slice(index + 1)];
                    }}
                />
            {/each}
        </ul>

        <ul>
            <!-- TODO: this needs some different styling -->
            {#each shifts as shift, index}
                <Shift
                    {...shift}
                    on:click={() => {
                        rhythm = [
                            ...rhythm,
                            shift.name,
                        ];
                    }}
                />
            {/each}
        </ul>

        <button type="submit" on:click={() => dispatch("submit", rhythm)}>OK</button>
    </article>
</dialog>

<style>
</style>