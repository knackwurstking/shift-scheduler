<script>
    import { createEventDispatcher } from "svelte";

    import * as utils from "../../js/utils";

    const dispatch = createEventDispatcher();

    /** @type {HTMLDialogElement} */
    let dialog;

    /** @type {number} */
    let year;
    /** @type {number} */
    let month;
    /** @type {string} */
    let dateString;
    /** @type {boolean} */
    let invalidYear = false;
    /** @type {boolean} */
    let invalidMonth = false;

    $: !dateString && year && month && setDate();
    $: dateString && parseDate();

    /**
     *
     * @param {number} _year
     * @param {number} _month
     */
    export async function open(_year, _month) {
        year = _year;
        month = _month + 1;
        dialog.show();
    }

    export async function close() {
        dialog.close();
    }

    async function setDate() {
        dateString = `${year}-${month}`;
    }

    async function parseDate() {
        const [y, m] = dateString.split("-", 2);
        year = parseInt(y, 10);
        month = parseInt(m, 10);
    }
</script>

<!-- TODO: use header/footer tag and contrast cancel button -->
<dialog bind:this={dialog}>
    <article>
        {#if utils.isAndroid()}
            <label>
                Pick a Date
                <input type="month" bind:value={dateString} />
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

        <footer>
            <button
                class="contrast"
                on:click={async () => dispatch("cancel")}
            >
                Cancel
            </button>

            <button
                type="submit"
                on:click={async () => {
                    if (invalidMonth || invalidYear) return;
                    dispatch("submit", { year, month: month - 1 });
                }}
            >
                Confirm
            </button>
        </footer>
    </article>
</dialog>
