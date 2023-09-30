<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import Shift from "../shift";

    import * as settings from "../../js/settings";
    import { ripple } from "../../js/ripple";
    let _primaryRipple = ripple({ color: "var(--ripple-primary-color)", usePointer: true });

    /** @type {HTMLDialogElement} */
    let dialog;

    /**
     * @type {import("../settings").Shift[]}
     */
    let shifts;
    /**
     * @type {number[]}
     */
    let rhythm;

    export async function open() {
        // ...
    }

    export async function close() {
        dialog.close();
    }
</script>

<dialog bind:this={dialog}>
    <article>
        <div>
            <h6>Shift Rhythm</h6>

            <div class="spacer" />

            <ul>
                {#each rhythm as id, index}
                    {#if !!settings.getShift(id)}
                        <Shift
                            {...settings.getShift(id)}
                            on:click={() => {
                                rhythm = [...rhythm.slice(0, index), ...rhythm.slice(index + 1)];
                            }}
                        />
                    {/if}
                {/each}
            </ul>

            <div class="spacer" />

            <div class="shifts-container">
                {#each shifts as shift}
                    <div class="container">
                        <Shift
                            {...shift}
                            on:click={() => {
                                rhythm = [...rhythm, shift.id];
                            }}
                        />
                    </div>
                {/each}
            </div>

            <div class="spacer" />

            <button type="submit" use:_primaryRipple on:click={() => dispatch("submit", rhythm)}>
                OK
            </button>
        </div>
    </article>
</dialog>

<style>
    .spacer {
        border-bottom: 1px solid var(--muted-border-color);
        margin-bottom: var(--spacing);
    }

    article {
        height: 90%;
        width: 100%;

        overflow: hidden;
    }

    article > div {
        width: 100%;
        height: 100%;
    }

    article > div > ul {
        height: calc(100% - 17em);

        overflow: hidden;
        overflow-y: auto;

        padding: 0;
    }

    .shifts-container {
        height: fit-content;

        overflow: hidden;
        overflow-x: auto;

        -ms-overflow-style: none;
        scrollbar-width: none;

        display: flex;
    }

    .shifts-container::-webkit-scrollbar {
        display: none;
    }

    .shifts-container .container {
        width: calc(4.5em + 16px);
        margin: calc(var(--spacing) / 2);
    }
</style>
