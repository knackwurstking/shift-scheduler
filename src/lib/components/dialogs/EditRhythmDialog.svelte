<script>
    import { createEventDispatcher } from "svelte";

    import Shift from "../shift";

    import { ripple } from "../../js/ripple";
    import * as settings from "../../js/settings";

    const dispatch = createEventDispatcher();

    let _contrastRipple = ripple({ color: "var(--ripple-contrast-color)", usePointer: true });
    let _primaryRipple = ripple({ color: "var(--ripple-primary-color)", usePointer: true });

    /** @type {HTMLDialogElement} */
    let dialog;
    /** @type {HTMLElement} */
    let footer;
    /** @type {HTMLElement} */
    let header;

    /**
     * @type {import("../settings").Shift[]}
     */
    let shifts = [];
    /**
     * @type {number[]}
     */
    let rhythm = [];

    let footer_and_header_height = 0;

    /**
     * @param {import("../settings").Shift[]} _shifts
     * @param {number[]} _rhythm
     */
    export async function open(_shifts, _rhythm) {
        shifts = _shifts;
        rhythm = _rhythm;
        dialog.show();
        footer_and_header_height = header.getBoundingClientRect().height + footer.getBoundingClientRect().height;
    }

    export async function close() {
        dialog.close();
    }
</script>

<dialog bind:this={dialog}>
    <article>
        <header bind:this={header}>Shift Rhythm</header>
        <div
            class="content"
            style={`
                height: calc(100% - ${footer_and_header_height}px);
            `}
        >
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
        </div>

        <footer bind:this={footer}>
            <button
                class="contrast"
                use:_contrastRipple
                on:click={async () => dispatch("cancel")}
            >
                Cancel
            </button>

            <button
                type="submit"
                use:_primaryRipple
                on:click={() => dispatch("submit", rhythm)}
            >
               Confirm 
            </button>
        </footer>
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

    article > .content {
        width: 100%;
        overflow: hidden;
    }

    article > .content > ul {
        height: calc(100% - 7.5rem);

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
