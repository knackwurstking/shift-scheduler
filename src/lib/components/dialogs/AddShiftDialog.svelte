<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    /** @type {HTMLDialogElement} */
    let dialog;

    let name = "";
    let shortName = "";
    let hidden = false;
    let color;

    export async function open() {
        dialog.show();
    }

    export async function close() {
        dialog.close();
    }
</script>

<dialog bind:this={dialog}>
    <article>
        <label for="name">
            Shift Name
            <input type="text" name="name" bind:value={name} />
        </label>

        <label for="shortName">
            Short Shift Name
            <input type="text" name="shortName" bind:value={shortName} />
        </label>

        <label for="hidden">
            <input type="checkbox" name="hidden" bind:checked={hidden} />
            Hidden Shift (Not visible in calendar)
        </label>

        <label for="color">
            Color
            <input type="color" name="color" bind:value={color} />
        </label>

        <footer>
            <button
                class="contrast"
                on:click={async () => dispatch("cancel")}
            >
                Cancel
            </button>

            <button
                on:click={async () => {
                    dispatch("submit", {
                        name,
                        shortName: shortName || name[0] || "",
                        color: color,
                        visible: !hidden,
                    });
                }}
            >
                Confirm
            </button>
        </footer>
    </article>
</dialog>

<style>
    dialog article > *:nth-child(4) {
        margin-top: var(--spacing);
    }
</style>
