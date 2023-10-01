<script>
    import { createEventDispatcher } from "svelte";

    import { ripple } from "../../js/ripple";

    const dispatch = createEventDispatcher();

    let _contrastRipple = ripple({ color: "var(--ripple-contrast-color)", usePointer: true });
    let _primaryRipple = ripple({ color: "var(--ripple-primary-color)", usePointer: true });

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
                use:_contrastRipple
                on:click={async () => dispatch("cancel")}
            >
                Cancel
            </button>

            <button
                use:_primaryRipple
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

            <!--button class="secondary" use:_secondaryRipple on:click={() => dispatch("cancel")}>
                Cancel
            </button>

            <button
                use:_primaryRipple
                on:click={() =>
                    dispatch("submit", {
                        name,
                        shortName: shortName || name[0] || "",
                        color: color,
                        visible: !hidden,
                    })}
            >
                OK
            </button-->
        </footer>
    </article>
</dialog>

<style>
    dialog article > *:nth-child(4) {
        margin-top: var(--spacing);
    }
</style>
