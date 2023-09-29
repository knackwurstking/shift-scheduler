<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import * as utils from "../../js/utils";
    import { ripple } from "../../js/ripple";
    let _secondaryRipple = ripple({ color: "var(--ripple-secondary-color)", usePointer: true });
    let _primaryRipple = ripple({ color: "var(--ripple-primary-color)", usePointer: true });

    /** @type {HTMLDialogElement} */
    let dialog;

    /** @type {number} */
    let year;
    /** @type {number} */
    let month;
    /** @type {string} */
    let date;
    /** @type {boolean} */
    let invalidYear = false;
    /** @type {boolean} */
    let invalidMonth = false;

    $: !date && year && month && setDate();
    $: date && parseDate();

    async function setDate() {
        date = `${year}-${month}`;
    }

    async function parseDate() {
        const [y, m] = date.split("-", 2);
        year = parseInt(y, 10);
        month = parseInt(m, 10);
    }

    export async function on() {
        if (dialog) dialog.show();
    }
</script>

<dialog bind:this={dialog}>
    <article>
        {#if utils.isAndroid()}
            <label>
                Pick a Date
                <input type="month" bind:value={date} />
            </label>
        {:else}
            <div>
                <label>
                    Year
                    <input
                        type="number"
                        bind:value={year}
                        aria-invalid={invalidYear}
                        on:input={async () => {
                            if (year === null) {
                                invalidYear = true;
                            } else {
                                invalidYear = false;
                            }
                        }}
                    />
                </label>
                <label>
                    Month
                    <input
                        type="number"
                        min={1}
                        max={12}
                        bind:value={month}
                        aria-invalid={invalidMonth}
                        on:input={async () => {
                            if (month < 1 || month > 12 || month === null) {
                                invalidMonth = true;
                            } else {
                                invalidMonth = false;
                            }
                        }}
                    />
                </label>
            </div>
        {/if}

        <button
          class="secondary"
          use:_secondaryRipple
          on:click={async () => dispatch("cancel", { year, month })}
        >
            Cancel
        </button>

        <button
            type="submit"
            use:_primaryRipple
            on:click={async () => {
                if (invalidMonth || invalidYear) return;
                dispatch("submit", { year, month });
            }}
        >
            OK
        </button>
    </article>
</dialog>

<style>
    dialog article {
        /* Need to set a width */
        padding: var(--spacing);
        width: 100%;
    }
</style>
